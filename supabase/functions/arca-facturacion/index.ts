import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ARCA Testing (homologación) base URL
const ARCA_BASE_URL = "https://wswhomo.afip.gov.ar/wsfev1/service.asmx";
const ARCA_WSDL_URL = "https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ARCA_TOKEN = Deno.env.get("ARCA_ACCESS_TOKEN");
    if (!ARCA_TOKEN) {
      return new Response(JSON.stringify({ error: "ARCA_ACCESS_TOKEN no configurado" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, ...params } = body;

    let result;

    switch (action) {
      case "emitir":
        result = await emitirComprobante(ARCA_TOKEN, params);
        break;
      case "consultar":
        result = await consultarComprobantes(ARCA_TOKEN, params);
        break;
      case "ultimo":
        result = await ultimoComprobante(ARCA_TOKEN, params);
        break;
      default:
        return new Response(JSON.stringify({ error: `Acción desconocida: ${action}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
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

function buildSoapEnvelope(method: string, innerXml: string, token: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <${method} xmlns="http://ar.gov.afip.dif.FEV1/">
      <Auth>
        <Token>${token}</Token>
        <Sign></Sign>
        <Cuit></Cuit>
      </Auth>
      ${innerXml}
    </${method}>
  </soap:Body>
</soap:Envelope>`;
}

async function callSoap(soapBody: string): Promise<string> {
  const response = await fetch(ARCA_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: "",
    },
    body: soapBody,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`ARCA API error [${response.status}]: ${text.substring(0, 500)}`);
  }

  return response.text();
}

function extractValue(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, "s");
  const match = xml.match(regex);
  return match ? match[1] : "";
}

async function emitirComprobante(token: string, params: Record<string, unknown>) {
  const {
    puntoVenta,
    tipoComprobante,
    concepto,
    docTipo,
    docNro,
    importeTotal,
    importeNeto,
    importeIva,
  } = params;

  // First get last invoice number
  const ultimoSoap = buildSoapEnvelope(
    "FECompUltimoAutorizado",
    `<PtoVta>${puntoVenta}</PtoVta><CbteTipo>${tipoComprobante}</CbteTipo>`,
    token
  );
  const ultimoResponse = await callSoap(ultimoSoap);
  const lastNumber = parseInt(extractValue(ultimoResponse, "CbteNro") || "0");
  const nextNumber = lastNumber + 1;

  const today = new Date().toISOString().split("T")[0].replace(/-/g, "");

  const detailXml = `
    <FeCAEReq>
      <FeCabReq>
        <CantReg>1</CantReg>
        <PtoVta>${puntoVenta}</PtoVta>
        <CbteTipo>${tipoComprobante}</CbteTipo>
      </FeCabReq>
      <FeDetReq>
        <FECAEDetRequest>
          <Concepto>${concepto}</Concepto>
          <DocTipo>${docTipo}</DocTipo>
          <DocNro>${docNro}</DocNro>
          <CbteDesde>${nextNumber}</CbteDesde>
          <CbteHasta>${nextNumber}</CbteHasta>
          <CbteFch>${today}</CbteFch>
          <ImpTotal>${importeTotal}</ImpTotal>
          <ImpTotConc>0</ImpTotConc>
          <ImpNeto>${importeNeto}</ImpNeto>
          <ImpOpEx>0</ImpOpEx>
          <ImpTrib>0</ImpTrib>
          <ImpIVA>${importeIva}</ImpIVA>
          <MonId>PES</MonId>
          <MonCotiz>1</MonCotiz>
          <Iva>
            <AlicIva>
              <Id>5</Id>
              <BaseImp>${importeNeto}</BaseImp>
              <Importe>${importeIva}</Importe>
            </AlicIva>
          </Iva>
        </FECAEDetRequest>
      </FeDetReq>
    </FeCAEReq>`;

  const soapBody = buildSoapEnvelope("FECAESolicitar", detailXml, token);
  const response = await callSoap(soapBody);

  const cae = extractValue(response, "CAE");
  const caeFchVto = extractValue(response, "CAEFchVto");
  const resultado = extractValue(response, "Resultado");

  if (resultado === "R") {
    const obs = extractValue(response, "Msg");
    throw new Error(`Comprobante rechazado: ${obs || "Sin detalle"}`);
  }

  return {
    cae,
    caeFchVto,
    numero: nextNumber,
    resultado,
  };
}

async function consultarComprobantes(token: string, params: Record<string, unknown>) {
  const { puntoVenta, tipoComprobante } = params;

  // Get the last number first
  const ultimoSoap = buildSoapEnvelope(
    "FECompUltimoAutorizado",
    `<PtoVta>${puntoVenta}</PtoVta><CbteTipo>${tipoComprobante}</CbteTipo>`,
    token
  );
  const ultimoResponse = await callSoap(ultimoSoap);
  const lastNumber = parseInt(extractValue(ultimoResponse, "CbteNro") || "0");

  // Fetch last 10 invoices
  const comprobantes = [];
  const start = Math.max(1, lastNumber - 9);

  for (let i = lastNumber; i >= start; i--) {
    try {
      const consultaSoap = buildSoapEnvelope(
        "FECompConsultar",
        `<FeCompConsReq>
          <CbteTipo>${tipoComprobante}</CbteTipo>
          <CbteNro>${i}</CbteNro>
          <PtoVta>${puntoVenta}</PtoVta>
        </FeCompConsReq>`,
        token
      );
      const response = await callSoap(consultaSoap);

      comprobantes.push({
        tipo: tipoComprobante,
        puntoVenta,
        numero: i,
        fecha: extractValue(response, "CbteFch"),
        importeTotal: parseFloat(extractValue(response, "ImpTotal") || "0"),
        cae: extractValue(response, "CodAutorizacion"),
        caeFchVto: extractValue(response, "FchVto"),
      });
    } catch {
      // Skip if individual query fails
    }
  }

  return { comprobantes };
}

async function ultimoComprobante(token: string, params: Record<string, unknown>) {
  const { puntoVenta, tipoComprobante } = params;

  const soapBody = buildSoapEnvelope(
    "FECompUltimoAutorizado",
    `<PtoVta>${puntoVenta}</PtoVta><CbteTipo>${tipoComprobante}</CbteTipo>`,
    token
  );
  const response = await callSoap(soapBody);
  const numero = parseInt(extractValue(response, "CbteNro") || "0");

  return { numero };
}
