// supabase/functions/arca-handler/index.ts
// v7: soporte para producción (certificado y autorización separados de homo)

const AFIPSDK_URL = "https://app.afipsdk.com/api/v1";
const TOKEN = Deno.env.get("ARCA_ACCESS_TOKEN")!;
const CUIT = Deno.env.get("ARCA_CUIT")!;
const PRODUCTION = Deno.env.get("ARCA_PRODUCTION") === "true";
const ENV = PRODUCTION ? "prod" : "dev";

function decodeB64(b64: string): string {
  if (!b64) return "";
  try {
    return atob(b64.trim()).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  } catch (e) {
    console.error("Error decodificando base64:", e);
    return "";
  }
}

// Secrets separados para cada ambiente
const CERT_DEV = decodeB64(Deno.env.get("ARCA_CERT_B64") ?? "");
const KEY_DEV = decodeB64(Deno.env.get("ARCA_KEY_B64") ?? "");
const CERT_PROD = decodeB64(Deno.env.get("ARCA_CERT_PROD_B64") ?? "");
const KEY_PROD = decodeB64(Deno.env.get("ARCA_KEY_PROD_B64") ?? "");

// Elegir cert/key según el ambiente activo
const CERT = PRODUCTION ? CERT_PROD : CERT_DEV;
const KEY = PRODUCTION ? KEY_PROD : KEY_DEV;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function getTA(wsid: string) {
  if (!CERT || !KEY) {
    throw new Error(
      `Faltan cert/key para ambiente ${ENV}. ` +
        (PRODUCTION
          ? "Ejecutá 'crear-certificado-prod' y configurá ARCA_CERT_PROD_B64 / ARCA_KEY_PROD_B64."
          : "Ejecutá 'crear-certificado' y configurá ARCA_CERT_B64 / ARCA_KEY_B64.")
    );
  }
  if (!CERT.startsWith("-----BEGIN")) throw new Error(`Cert de ${ENV} mal formateado`);
  if (!KEY.startsWith("-----BEGIN")) throw new Error(`Key de ${ENV} mal formateada`);

  const res = await fetch(`${AFIPSDK_URL}/afip/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      environment: ENV,
      tax_id: CUIT,
      wsid,
      cert: CERT,
      key: KEY,
    }),
  });

  const data = await res.json();
  console.log(`[getTA] env=${ENV} wsid=${wsid} status=${res.status}`);

  if (!res.ok) throw new Error(`auth failed (${res.status}): ${JSON.stringify(data)}`);
  return data;
}

async function callArca(wsid: string, method: string, params: any) {
  const res = await fetch(`${AFIPSDK_URL}/afip/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ environment: ENV, wsid, method, params }),
  });

  const data = await res.json();
  console.log(`[callArca] env=${ENV} ${method} status=${res.status}`);

  if (!res.ok) throw new Error(`${method} failed (${res.status}): ${JSON.stringify(data)}`);
  return data;
}

async function runAutomation(automation: string, params: any, maxWaitMs = 300_000) {
  const startRes = await fetch(`${AFIPSDK_URL}/automations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ automation, params }),
  });

  const startData = await startRes.json();
  console.log(`[automation:${automation}] start status=${startRes.status} id=${startData.id}`);

  if (!startRes.ok) {
    throw new Error(`automation start failed (${startRes.status}): ${JSON.stringify(startData)}`);
  }

  if (startData.status === "complete") return startData;

  const id = startData.id;
  if (!id) throw new Error(`automation no devolvió id: ${JSON.stringify(startData)}`);

  const started = Date.now();
  while (Date.now() - started < maxWaitMs) {
    await new Promise((r) => setTimeout(r, 3000));

    const statusRes = await fetch(`${AFIPSDK_URL}/automations/${id}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const statusData = await statusRes.json();
    console.log(`[automation:${automation}] poll status=${statusData.status}`);

    if (statusData.status === "complete") return statusData;
    if (statusData.status === "error" || statusData.status === "failed") {
      throw new Error(`automation falló: ${JSON.stringify(statusData)}`);
    }
  }

  throw new Error(`automation timeout después de ${maxWaitMs / 1000}s`);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (!TOKEN || !CUIT) {
    return new Response(
      JSON.stringify({ ok: false, error: "Faltan ARCA_ACCESS_TOKEN o ARCA_CUIT" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { action, payload = {} } = await req.json();
    console.log(`[handler] action=${action} env=${ENV}`);

    let result;

    switch (action) {
      // ═══════════════════════════════════════════════════════
      // SETUP HOMOLOGACIÓN
      // ═══════════════════════════════════════════════════════
      case "crear-certificado": {
        if (!payload.password) throw new Error("Falta 'password' (clave fiscal)");

        const automationResult = await runAutomation("create-cert-dev", {
          cuit: CUIT,
          username: payload.username ?? CUIT,
          password: payload.password,
          alias: payload.alias ?? "plano",
        });

        if (automationResult.data?.cert && automationResult.data?.key) {
          result = {
            status: automationResult.status,
            ambiente: "DESARROLLO (homologación)",
            _instrucciones:
              "Guardá cert_b64 como ARCA_CERT_B64 y key_b64 como ARCA_KEY_B64. Redesplegá.",
            cert_b64: btoa(automationResult.data.cert),
            key_b64: btoa(automationResult.data.key),
          };
        } else {
          result = automationResult;
        }
        break;
      }

      case "autorizar-wsfe": {
        if (!payload.password) throw new Error("Falta 'password' (clave fiscal)");
        result = await runAutomation("auth-web-service-dev", {
          cuit: CUIT,
          username: payload.username ?? CUIT,
          password: payload.password,
          alias: payload.alias ?? "plano",
          service: payload.service ?? "wsfe",
        });
        break;
      }

      // ═══════════════════════════════════════════════════════
      // SETUP PRODUCCIÓN (nuevos)
      // ═══════════════════════════════════════════════════════
      case "crear-certificado-prod": {
        if (!payload.password) throw new Error("Falta 'password' (clave fiscal)");

        const automationResult = await runAutomation("create-cert-prod", {
          cuit: CUIT,
          username: payload.username ?? CUIT,
          password: payload.password,
          alias: payload.alias ?? "plano-prod",
        });

        if (automationResult.data?.cert && automationResult.data?.key) {
          result = {
            status: automationResult.status,
            ambiente: "PRODUCCIÓN (facturas reales con validez fiscal)",
            _instrucciones:
              "Guardá cert_b64 como ARCA_CERT_PROD_B64 y key_b64 como ARCA_KEY_PROD_B64. " +
              "Después cambiá ARCA_PRODUCTION=true y redesplegá.",
            cert_b64: btoa(automationResult.data.cert),
            key_b64: btoa(automationResult.data.key),
          };
        } else {
          result = automationResult;
        }
        break;
      }

      case "autorizar-wsfe-prod": {
        if (!payload.password) throw new Error("Falta 'password' (clave fiscal)");
        result = await runAutomation("auth-web-service-prod", {
          cuit: CUIT,
          username: payload.username ?? CUIT,
          password: payload.password,
          alias: payload.alias ?? "plano-prod",
          service: payload.service ?? "wsfe",
        });
        break;
      }

      case "habilitar-admin-certs": {
        // A veces en prod hay que habilitar el servicio "Administración de Certificados Digitales"
        // antes de poder crear el cert de prod
        if (!payload.password) throw new Error("Falta 'password' (clave fiscal)");
        result = await runAutomation("enable-cert-prod-admin", {
          cuit: CUIT,
          username: payload.username ?? CUIT,
          password: payload.password,
        });
        break;
      }

      // ═══════════════════════════════════════════════════════
      // DIAGNÓSTICO
      // ═══════════════════════════════════════════════════════
      case "info-ambiente": {
        result = {
          ambiente_activo: ENV,
          production_flag: PRODUCTION,
          cert_dev_cargado: !!CERT_DEV,
          key_dev_cargada: !!KEY_DEV,
          cert_prod_cargado: !!CERT_PROD,
          key_prod_cargada: !!KEY_PROD,
          cuit: CUIT,
        };
        break;
      }

      case "verificar-cert": {
        result = {
          ambiente: ENV,
          cert_cargado: !!CERT,
          cert_longitud: CERT.length,
          cert_empieza_con: CERT.slice(0, 40),
          cert_termina_con: CERT.slice(-40),
          key_cargada: !!KEY,
          key_longitud: KEY.length,
          key_empieza_con: KEY.slice(0, 40),
          key_termina_con: KEY.slice(-40),
        };
        break;
      }

      // ═══════════════════════════════════════════════════════
      // USO NORMAL (funciona en dev o prod según ARCA_PRODUCTION)
      // ═══════════════════════════════════════════════════════
      case "estado": {
        result = await callArca("wsfe", "FEDummy", {});
        break;
      }

      case "ultimo-comprobante": {
        const { token, sign } = await getTA("wsfe");
        result = await callArca("wsfe", "FECompUltimoAutorizado", {
          Auth: { Token: token, Sign: sign, Cuit: CUIT },
          PtoVta: payload.puntoVenta ?? 1,
          CbteTipo: payload.tipoCbte ?? 11,
        });
        break;
      }

      case "facturar": {
        const { token, sign } = await getTA("wsfe");
        const puntoVenta = payload.puntoVenta ?? 1;
        const tipoCbte = payload.tipoCbte ?? 11;
        const importe = payload.importe ?? 100;

        const ultimo = await callArca("wsfe", "FECompUltimoAutorizado", {
          Auth: { Token: token, Sign: sign, Cuit: CUIT },
          PtoVta: puntoVenta,
          CbteTipo: tipoCbte,
        });
        const ultimoNro =
          ultimo.FECompUltimoAutorizadoResult?.CbteNro ?? ultimo.CbteNro ?? 0;
        const nro = ultimoNro + 1;
        const hoy = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ""));

        result = await callArca("wsfe", "FECAESolicitar", {
          Auth: { Token: token, Sign: sign, Cuit: CUIT },
          FeCAEReq: {
            FeCabReq: { CantReg: 1, PtoVta: puntoVenta, CbteTipo: tipoCbte },
            FeDetReq: {
              FECAEDetRequest: {
                Concepto: 1,
                DocTipo: payload.docTipo ?? 99,
                DocNro: payload.docNro ?? 0,
                CbteDesde: nro,
                CbteHasta: nro,
                CbteFch: hoy,
                ImpTotal: importe,
                ImpTotConc: 0,
                ImpNeto: importe,
                ImpOpEx: 0,
                ImpTrib: 0,
                ImpIVA: 0,
                MonId: "PES",
                MonCotiz: 1,
                CondicionIVAReceptorId: payload.condicionIVAReceptor ?? 5,
              },
            },
          },
        });
        break;
      }

      default:
        throw new Error(`Action desconocida: ${action}`);
    }

    return new Response(
      JSON.stringify({ ok: true, environment: ENV, action, result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("[handler] ERROR", err);
    return new Response(
      JSON.stringify({ ok: false, error: err.message ?? String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
