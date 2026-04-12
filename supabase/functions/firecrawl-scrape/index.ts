import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { url, query, niche } = await req.json();

    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Firecrawl no está configurado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "LOVABLE_API_KEY no configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let scrapedContent = "";

    if (url) {
      // Scrape a specific URL
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
        formattedUrl = `https://${formattedUrl}`;
      }

      console.log("Scraping URL:", formattedUrl);
      const scrapeRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: formattedUrl,
          formats: ["markdown"],
          onlyMainContent: true,
        }),
      });

      const scrapeData = await scrapeRes.json();
      if (!scrapeRes.ok) {
        console.error("Firecrawl scrape error:", scrapeData);
        return new Response(
          JSON.stringify({ success: false, error: scrapeData.error || "Error al scrapear" }),
          { status: scrapeRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      scrapedContent = scrapeData.data?.markdown || scrapeData.markdown || "";
    } else if (query) {
      // Search the web
      const searchQuery = niche ? `${query} ${niche} contacto teléfono email` : `${query} contacto teléfono email`;
      console.log("Searching:", searchQuery);

      const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          limit: 5,
          scrapeOptions: { formats: ["markdown"] },
        }),
      });

      const searchData = await searchRes.json();
      if (!searchRes.ok) {
        console.error("Firecrawl search error:", searchData);
        return new Response(
          JSON.stringify({ success: false, error: searchData.error || "Error en la búsqueda" }),
          { status: searchRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const results = searchData.data || [];
      scrapedContent = results
        .map((r: any) => `--- Fuente: ${r.url || "desconocida"} ---\n${r.markdown || r.description || ""}`)
        .join("\n\n");
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Se requiere url o query" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!scrapedContent || scrapedContent.trim().length < 20) {
      return new Response(
        JSON.stringify({ success: true, leads: [], message: "No se encontró contenido suficiente" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use AI to extract structured lead data
    console.log("Extracting leads with AI, content length:", scrapedContent.length);

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Eres un extractor de datos de contacto de negocios. Analiza el contenido web y extrae información de contacto de negocios/empresas/profesionales.
Extrae TODOS los contactos que encuentres. Para cada uno devuelve: name (nombre del negocio o persona), city (ciudad), phone (número de teléfono con código de área/país), email (correo electrónico).
Si no encuentras algún campo, déjalo vacío "".
Responde SOLO con el JSON, sin explicaciones.`,
          },
          {
            role: "user",
            content: `Extrae los datos de contacto del siguiente contenido web:\n\n${scrapedContent.substring(0, 15000)}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_leads",
              description: "Extract business contact leads from web content",
              parameters: {
                type: "object",
                properties: {
                  leads: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Business or person name" },
                        city: { type: "string", description: "City location" },
                        phone: { type: "string", description: "Phone number with area code" },
                        email: { type: "string", description: "Email address" },
                      },
                      required: ["name", "city", "phone", "email"],
                    },
                  },
                },
                required: ["leads"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_leads" } },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, errText);

      if (aiRes.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Límite de solicitudes excedido, intentá de nuevo en unos segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiRes.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "Créditos insuficientes." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: "Error al procesar con IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiRes.json();
    let leads: any[] = [];

    try {
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall) {
        const parsed = JSON.parse(toolCall.function.arguments);
        leads = parsed.leads || [];
      }
    } catch (e) {
      console.error("Error parsing AI response:", e);
    }

    // Generate WhatsApp links
    leads = leads.map((lead: any) => {
      const cleanPhone = (lead.phone || "").replace(/[^0-9+]/g, "");
      return {
        ...lead,
        whatsapp_link: cleanPhone ? `https://wa.me/${cleanPhone.replace("+", "")}` : "",
        source_url: url || query || "",
      };
    });

    console.log(`Extracted ${leads.length} leads`);

    return new Response(
      JSON.stringify({ success: true, leads }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
