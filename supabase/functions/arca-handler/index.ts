// supabase/functions/arca-handler/index.ts
// Edge Function para ARCA vía AFIP SDK
// Flujo correcto: 1) /auth obtiene TA (token+sign) 2) /requests ejecuta método del WS
// Actions: estado | facturar | consultar-padron | ultimo-comprobante | tipos-comprobante

const AFIPSDK_URL = "https://app.afipsdk.com/api/v1";
const TOKEN = Deno.env.get("ARCA_ACCESS_TOKEN")!;
const CUIT = Deno.env.get("ARCA_CUIT")!;
const PRODUCTION = Deno.env.get("ARCA_PRODUCTION") === "true";
const ENV = PRODUCTION ? "prod" : "dev";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ──────────────────────────────────────────────────────────
// Paso 1: obtener Ticket de Acceso (TA) → { token, sign }
// ──────────────────────────────────────────────────────────
async function getTA(wsid: string) {
  console.log(`[getTA] Solicitando TA para wsid=${wsid} env=${ENV} cuit=${CUIT}`);

  const res = await fetch(`${AFIPSDK_URL}/afip/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ environment: ENV, tax_id: CUIT, wsid }),
  });

  const data = await res.json();
  console.log(`[getTA] status=${res.status} body=${JSON.stringify(data).slice(0, 300)}`);

  if (!res.ok) {
    throw new Error(`auth failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data; // { token, sign, expiration }
}

// ──────────────────────────────────────────────────────────
// Paso 2: ejecutar método del WS de ARCA
// ──────────────────────────────────────────────────────────
async function callArca(wsid: string, method: string, params: any) {
  console.log(`[callArca] wsid=${wsid} method=${method}`);

  const res = await fetch(`${AFIPSDK_URL}/afip/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ environment: ENV, wsid, method, params }),
  });

  const data = await res.json();
  console.log(`[callArca] status=${res.status} body=${JSON.stringify(data).slice(0, 500)}`);

  if (!res.ok) {
    throw new Error(`request failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Chequeo de secrets
  if (!TOKEN || !CUIT) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Faltan secrets ARCA_ACCESS_TOKEN o ARCA_CUIT en la Edge Function",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { action, payload = {} } = await req.json();
    console.log(`[handler] action=${action} payload=${JSON.stringify(payload)}`);

    let result;

    switch (action) {
      // 1) Ping al servidor de facturación (NO requiere TA — el más simple para testear)
      case "estado": {
        result = await callArca("wsfe", "FEDummy", {});
        break;
      }

      // 2) Último comprobante autorizado (requiere TA)
      case "ultimo-comprobante": {
        const { token, sign } = await getTA("wsfe");
        result = await callArca("wsfe", "FECompUltimoAutorizado", {
          Auth: { Token: token, Sign: sign, Cuit: CUIT },
          PtoVta: payload.puntoVenta ?? 1,
          CbteTipo: payload.tipoCbte ?? 11,
        });
        break;
      }

      // 3) Tipos de comprobante disponibles (útil para listar opciones en UI)
      case "tipos-comprobante": {
        const { token, sign } = await getTA("wsfe");
        result = await callArca("wsfe", "FEParamGetTiposCbte", {
          Auth: { Token: token, Sign: sign, Cuit: CUIT },
        });
        break;
      }

      // 4) Facturar — Factura C ($100 sin IVA ni nada, simple)
      case "facturar": {
        const { token, sign } = await getTA("wsfe");
        const puntoVenta = payload.puntoVenta ?? 1;
        const tipoCbte = payload.tipoCbte ?? 11; // 11 = Factura C
        const importe = payload.importe ?? 100;

        // Obtener último y sumarle 1
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
                CondicionIVAReceptorId: payload.condicionIVAReceptor ?? 5, // 5 = consumidor final
              },
            },
          },
        });
        break;
      }

      // 5) Consultar padrón (requiere WS distinto)
      case "consultar-padron": {
        const { token, sign } = await getTA("ws_sr_constancia_inscripcion");
        result = await callArca("ws_sr_constancia_inscripcion", "getPersona_v2", {
          token,
          sign,
          cuitRepresentada: CUIT,
          idPersona: String(payload.cuitConsultado),
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
