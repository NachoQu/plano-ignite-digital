import { supabase } from "@/integrations/supabase/client";

export type Lead = {
  name: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  whatsapp_link: string;
  source_url: string;
};

type ScrapeResponse = {
  success: boolean;
  error?: string;
  leads?: Lead[];
  message?: string;
};

export const firecrawlApi = {
  async scrapeUrl(url: string): Promise<ScrapeResponse> {
    const { data, error } = await supabase.functions.invoke("firecrawl-scrape", {
      body: { url },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  async searchLeads(query: string, niche?: string): Promise<ScrapeResponse> {
    const { data, error } = await supabase.functions.invoke("firecrawl-scrape", {
      body: { query, niche },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },
};
