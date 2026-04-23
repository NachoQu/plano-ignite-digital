import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const FALLBACK_SUPABASE_URL = "https://dnznkefuqjezhiijbbox.supabase.co";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuem5rZWZ1cWplemhpaWpiYm94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NDI3MTMsImV4cCI6MjA4NjUxODcxM30.h7fLYRSIicNLt_wtz_UD1STD6G_LRXzEPsQWIELkuzs";

const publicUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const publishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_SUPABASE_PUBLISHABLE_KEY;

export const backendUrl = publicUrl;
export const backendPublishableKey = publishableKey;
export const backendConfigError =
  !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    ? "La configuración pública del backend no llegó al bundle; se usó el fallback seguro del proyecto."
    : null;
export const isBackendConfigured = Boolean(publicUrl && publishableKey);

export const supabase = createClient<Database>(publicUrl, publishableKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});