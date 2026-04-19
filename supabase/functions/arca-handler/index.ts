// supabase/functions/arca-handler/index.ts
// v7: normaliza PEM decodificado y re-emite base64 canónico para evitar errores de parseo en AFIPSDK

const AFIPSDK_URL = "https://app.afipsdk.com/api/v1";
const TOKEN = Deno.env.get("ARCA_ACCESS_TOKEN")!;
const CUIT = Deno.env.get("ARCA_CUIT")!;
const PRODUCTION = Deno.env.get("ARCA_PRODUCTION") === "true";
const ENV = PRODUCTION ? "prod" : "dev";

// Decodifica base64 a string UTF-8 (el PEM original)
function decodeB64(b64: string): string {
  if (!b64) return "";
  try {
    const binary = atob(b64.trim());
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error("Error decodificando base64:", e);
    return "";
  }
}

function normalizePem(pem: string): string {
  if (!pem) return "";

  return `${pem
    .replace(/\u0000/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim()}\n`;
}

const CERT = normalizePem(decodeB64(Deno.env.get("ARCA_CERT_B64") ?? ""));
const KEY = normalizePem(decodeB64(Deno.env.get("ARCA_KEY_B64") ?? ""));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function getTA(wsid: string) {
  if (!CERT || !KEY) {
    throw new Error(
      "Faltan ARCA_CERT_B64 y/o ARCA_KEY_B64 en secrets. Corré 'crear-certificado' y seguí las instrucciones."
    );
  }
  if (!CERT.startsWith("-----BEGIN")) {
    throw new Error("ARCA_CERT_B64 decodeado no empieza con -----BEGIN. Reviselo.");
  }
  if (!KEY.startsWith("-----BEGIN")) {
    throw new Error("ARCA_KEY_B64 decodeado no empieza con -----BEGIN. Reviselo.");
  }

    console.log(
    `[getTA] wsid=${wsid} certLen=${CERT.length} keyLen=${KEY.length} certCR=${CERT.includes("\r")} keyCR=${KEY.includes("\r")}`
  );

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
  console.log(`[getTA] wsid=${wsid} status=${res.status}`);

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
  console.log(`[callArca] ${method} status=${res.status}`);

  if (!res.ok) throw new Error(`${method} failed (${res.status}): ${JSON.stringify(data)}`);
  return data;
}

async function runAutomation(automation: string, params: any, maxWaitMs = 180_000) {
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
    console.log(`[handler] action=${action}`);

    let result;

    switch (action) {
      case "crear-certificado": {
        if (!payload.password) {
          throw new Error("Falta 'password' en payload (clave fiscal de ARCA)");
        }

        const automationResult = await runAutomation("create-cert-dev", {
          cuit: CUIT,
          username: payload.username ?? CUIT,
          password: payload.password,
          alias: payload.alias ?? "plano",
        });

        // Convertir cert y key a base64 automáticamente, así el usuario solo copia-pega
        if (automationResult.data?.cert && automationResult.data?.key) {
          const normalizedCert = normalizePem(automationResult.data.cert);
          const normalizedKey = normalizePem(automationResult.data.key);
          const cert_b64 = btoa(normalizedCert);
          const key_b64 = btoa(normalizedKey);

          result = {
            status: automationResult.status,
            _instrucciones:
              "Copiá los strings cert_b64 y key_b64 de abajo y pegalos como secrets " +
              "ARCA_CERT_B64 y ARCA_KEY_B64 en Supabase. Son base64, una sola línea, " +
              "no tienen saltos ni caracteres raros. Redesplegá después de guardar.",
            cert_b64,
            key_b64,
            // Los PEM originales también por si querés verlos
            _cert_original_para_verificar: normalizedCert.slice(0, 50) + "...",
            _key_original_para_verificar: normalizedKey.slice(0, 50) + "...",
          };
        } else {
          result = automationResult;
        }
        break;
      }

      case "autorizar-wsfe": {
        if (!payload.password) {
          throw new Error("Falta 'password' en payload (clave fiscal de ARCA)");
        }

        result = await runAutomation("auth-web-service-dev", {
          cuit: CUIT,
          username: payload.username ?? CUIT,
          password: payload.password,
          alias: payload.alias ?? "plano",
          service: payload.service ?? "wsfe",
        });
        break;
      }

      case "verificar-cert": {
        result = {
          cert_cargado: !!CERT,
          cert_longitud: CERT.length,
          cert_empieza_con: CERT.slice(0, 40),
          cert_termina_con: CERT.slice(-40),
          cert_tiene_saltos_reales: CERT.includes("\n"),
          cert_cantidad_saltos: (CERT.match(/\n/g) || []).length,
          key_cargada: !!KEY,
          key_longitud: KEY.length,
          key_empieza_con: KEY.slice(0, 40),
          key_termina_con: KEY.slice(-40),
          key_tiene_saltos_reales: KEY.includes("\n"),
          key_cantidad_saltos: (KEY.match(/\n/g) || []).length,
        };
        break;
      }

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
        const nro = (ultimo.CbteNro ?? 0) + 1;
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
