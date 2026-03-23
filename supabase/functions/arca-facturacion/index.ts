import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-ignore esm.sh npm import
import Afip from "https://esm.sh/@afipsdk/afip.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar autenticación Supabase
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = Deno.env.get("ARCA_ACCESS_TOKEN");
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "ARCA_ACCESS_TOKEN no configurado" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // CUIT configurable via env var, por defecto el CUIT del contribuyente
    const cuit = parseInt(Deno.env.get("AFIP_CUIT") ?? "20357947783");

    // Inicializar SDK — production: false = homologación (testing)
    // deno-lint-ignore no-explicit-any
    const afip: any = new Afip({
      CUIT: cuit,
      access_token: accessToken,
      production: false,
    });

    const body = await req.json();
    const { action, ...params } = body;

    let result;

    switch (action) {
      case "emitir":
        result = await emitirComprobante(afip, params);
        break;
      case "consultar":
        result = await consultarComprobantes(afip, params);
        break;
      case "ultimo":
        result = await ultimoComprobante(afip, params);
        break;
      default:
        return new Response(
          JSON.stringify({ error: `Acción desconocida: ${action}` }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error en arca-facturacion:", error);
    const message = error instanceof Error ? error.message : "Error interno";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// deno-lint-ignore no-explicit-any
async function emitirComprobante(afip: any, params: Record<string, unknown>) {
  const today = new Date().toISOString().split("T")[0].replace(/-/g, "");

  const res = await afip.ElectronicBilling.createNextVoucher({
    CantReg: 1,
    PtoVta: params.puntoVenta,
    CbteTipo: params.tipoComprobante,
    Concepto: params.concepto,
    DocTipo: params.docTipo,
    DocNro: params.docNro,
    CbteFch: today,
    ImpTotal: params.importeTotal,
    ImpTotConc: 0,
    ImpNeto: params.importeNeto,
    ImpOpEx: 0,
    ImpTrib: 0,
    ImpIVA: params.importeIva,
    MonId: "PES",
    MonCotiz: 1,
    Iva: [
      {
        Id: 5, // Alícuota IVA 21%
        BaseImp: params.importeNeto,
        Importe: params.importeIva,
      },
    ],
  });

  return {
    cae: res.CAE,
    caeFchVto: res.CAEFchVto,
    numero: res.voucher_number,
    resultado: "A",
  };
}

// deno-lint-ignore no-explicit-any
async function consultarComprobantes(afip: any, params: Record<string, unknown>) {
  const { puntoVenta, tipoComprobante } = params;

  const lastNumber: number = await afip.ElectronicBilling.getLastVoucher(
    puntoVenta as number,
    tipoComprobante as number,
  );

  const comprobantes = [];
  const start = Math.max(1, lastNumber - 9);

  for (let i = lastNumber; i >= start; i--) {
    try {
      const info = await afip.ElectronicBilling.getVoucherInfo(
        i,
        puntoVenta as number,
        tipoComprobante as number,
      );
      comprobantes.push({
        tipo: tipoComprobante,
        puntoVenta,
        numero: i,
        fecha: info.CbteFch,
        importeTotal: info.ImpTotal,
        cae: info.CodAutorizacion,
        caeFchVto: info.FchVto,
      });
    } catch {
      // Omitir si el comprobante no existe
    }
  }

  return { comprobantes };
}

// deno-lint-ignore no-explicit-any
async function ultimoComprobante(afip: any, params: Record<string, unknown>) {
  const numero: number = await afip.ElectronicBilling.getLastVoucher(
    params.puntoVenta as number,
    params.tipoComprobante as number,
  );

  return { numero };
}
