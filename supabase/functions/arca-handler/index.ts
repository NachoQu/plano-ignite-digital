// supabase/functions/arca-handler/index.ts
// Edge Function única para probar todo el flujo de ARCA vía AFIP SDK
// Actions: facturar | consultar-padron | constatar | ultimo-comprobante

const AFIPSDK_URL = "https://app.afipsdk.com/api/v1";
const TOKEN = Deno.env.get("ARCA_ACCESS_TOKEN")!;
const CUIT = Deno.env.get("ARCA_CUIT")!;
const PRODUCTION = Deno.env.get("ARCA_PRODUCTION") === "true";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Helper: llama a cualquier web service de ARCA vía AFIP SDK
// deno-lint-ignore no-explicit-any
async function callArca(webService: string, method: string, params: any) {
  const res = await fetch(`${AFIPSDK_URL}/afip/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      environment: PRODUCTION ? "prod" : "dev",
      tax_id: CUIT,
      web_service: webService,
      method,
      params,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { action, payload } = await req.json();

    let result;
    switch (action) {
      // ──────────────────────────────────────────────────────────
      // 1) Emitir Factura C (ideal para monotributo / homo)
      // ──────────────────────────────────────────────────────────
      case "facturar": {
        const puntoVenta = payload.puntoVenta ?? 1;
        const tipoCbte = payload.tipoCbte ?? 11; // 11 = Factura C
        const importe = payload.importe;
        const docNro = payload.docNro ?? 0; // consumidor final = 0
        const docTipo = payload.docTipo ?? 99; // 99 = sin identificar

        // 1.a) Obtener último comprobante autorizado en ARCA
        const ultimo = await callArca("wsfe", "FECompUltimoAutorizado", {
          Auth: { Cuit: Number(CUIT) },
          PtoVta: puntoVenta,
          CbteTipo: tipoCbte,
        });
        const proximo = (ultimo.FECompUltimoAutorizadoResult?.CbteNro ?? 0) + 1;

        // 1.b) Solicitar CAE a ARCA
        const hoy = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        result = await callArca("wsfe", "FECAESolicitar", {
          Auth: { Cuit: Number(CUIT) },
          FeCAEReq: {
            FeCabReq: { CantReg: 1, PtoVta: puntoVenta, CbteTipo: tipoCbte },
            FeDetReq: {
              FECAEDetRequest: {
                Concepto: 1, // 1 = productos
                DocTipo: docTipo,
                DocNro: docNro,
                CbteDesde: proximo,
                CbteHasta: proximo,
                CbteFch: hoy,
                ImpTotal: importe,
                ImpTotConc: 0,
                ImpNeto: importe,
                ImpOpEx: 0,
                ImpTrib: 0,
                ImpIVA: 0,
                MonId: "PES",
                MonCotiz: 1,
              },
            },
          },
        });
        break;
      }

      // ──────────────────────────────────────────────────────────
      // 2) Consultar padrón de ARCA (datos de contribuyente por CUIT)
      // ──────────────────────────────────────────────────────────
      case "consultar-padron": {
        result = await callArca("ws_sr_constancia_inscripcion", "getPersona", {
          token: "AUTO",
          sign: "AUTO",
          cuitRepresentada: Number(CUIT),
          idPersona: Number(payload.cuitConsultado),
        });
        break;
      }

      // ──────────────────────────────────────────────────────────
      // 3) Constatar comprobante en ARCA (validar un CAE ya emitido)
      // ──────────────────────────────────────────────────────────
      case "constatar": {
        result = await callArca("ws_sr_constancia_comprobantes", "comprobanteConstatar", {
          Auth: { Cuit: Number(CUIT) },
          CmpReq: {
            CbteModo: "CAE",
            CuitEmisor: payload.cuitEmisor,
            PtoVta: payload.puntoVenta,
            CbteTipo: payload.tipoCbte,
            CbteNro: payload.cbteNro,
            CbteFch: payload.fecha, // YYYYMMDD
            ImpTotal: payload.importe,
            CodAutorizacion: payload.cae,
            DocTipoReceptor: payload.docTipoReceptor ?? 99,
            DocNroReceptor: payload.docNroReceptor ?? 0,
          },
        });
        break;
      }

      // ──────────────────────────────────────────────────────────
      // 4) Último comprobante autorizado en ARCA (útil para debug)
      // ──────────────────────────────────────────────────────────
      case "ultimo-comprobante": {
        result = await callArca("wsfe", "FECompUltimoAutorizado", {
          Auth: { Cuit: Number(CUIT) },
          PtoVta: payload.puntoVenta ?? 1,
          CbteTipo: payload.tipoCbte ?? 11,
        });
        break;
      }

      default:
        throw new Error(`Action desconocida: ${action}`);
    }

    return new Response(
      JSON.stringify({ ok: true, environment: PRODUCTION ? "prod" : "dev", result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
