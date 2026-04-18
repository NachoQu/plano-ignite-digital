// supabase/functions/arca-handler/index.ts
// v3: agrega acciones de setup inicial (crear-certificado, autorizar-wsfe)
// Flujo: 1) crear-certificado 2) guardar cert+key en secrets 3) autorizar-wsfe 4) usar WSs

const AFIPSDK_URL = "https://app.afipsdk.com/api/v1";
const TOKEN = Deno.env.get("ARCA_ACCESS_TOKEN")!;
const CUIT = Deno.env.get("ARCA_CUIT")!;
const PRODUCTION = Deno.env.get("ARCA_PRODUCTION") === "true";
const ENV = PRODUCTION ? "prod" : "dev";

// Certificado y key (se cargan después de correr crear-certificado)
const CERT = Deno.env.get("ARCA_CERT") ?? "";
const KEY = Deno.env.get("ARCA_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ──────────────────────────────────────────────────────────
// Helper: obtener TA (token + sign) para un web service
// ──────────────────────────────────────────────────────────
async function getTA(wsid: string) {
  if (!CERT || !KEY) {
    throw new Error(
      "Faltan ARCA_CERT y/o ARCA_KEY en secrets. Ejecutá primero la acción 'crear-certificado'."
    );
  }

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

// ──────────────────────────────────────────────────────────
// Helper: llamar método de WS de ARCA
// ──────────────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────
// Helper: correr automatización y esperar resultado
// ──────────────────────────────────────────────────────────
async function runAutomation(automation: string, params: any, maxWaitMs = 180_000) {
  // 1) Iniciar automatización
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

  // Si ya viene completa, devolver
  if (startData.status === "complete") return startData;

  const id = startData.id;
  if (!id) throw new Error(`automation no devolvió id: ${JSON.stringify(startData)}`);

  // 2) Polling cada 3s hasta que complete o falle
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
      // ═══════════════════════════════════════════════════════
      // SETUP (solo se corre 1 vez por CUIT)
      // ═══════════════════════════════════════════════════════

      // Crear certificado de desarrollo — devuelve cert y key
      case "crear-certificado": {
        if (!payload.password) {
          throw new Error("Falta 'password' en payload (clave fiscal de ARCA)");
        }

        result = await runAutomation("create-cert-dev", {
          cuit: CUIT,
          username: payload.username ?? CUIT,
          password: payload.password,
          alias: payload.alias ?? "plano",
        });

        // Extraer solo cert y key para copiar fácil
        if (result.data?.cert && result.data?.key) {
          result = {
            ...result,
            _instrucciones:
              "Copiá 'data.cert' y 'data.key' (incluyendo los -----BEGIN...----- y -----END...-----) " +
              "y guardalos como secrets ARCA_CERT y ARCA_KEY en Supabase. " +
              "Después redesplegá la Edge Function.",
          };
        }
        break;
      }

      // Autorizar web service wsfe al certificado (paso posterior a crear cert)
      case "autorizar-wsfe": {
        if (!payload.password) {
          throw new Error("Falta 'password' en payload (clave fiscal de ARCA)");
        }

        result = await runAutomation("auth-web-service-dev", {
          cuit: CUIT,
          username: payload.username ?? CUIT,
          password: payload.password,
          alias: payload.alias ?? "plano",
          wsid: "wsfe",
        });
        break;
      }

      // ═══════════════════════════════════════════════════════
      // USO NORMAL (requiere cert + key + wsfe autorizado)
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
