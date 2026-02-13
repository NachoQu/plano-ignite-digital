// Patch: ensure Supabase env vars are available before client.ts runs
if (!import.meta.env.VITE_SUPABASE_URL) {
  (import.meta as any).env.VITE_SUPABASE_URL = 'https://dnznkefuqjezhiijbbox.supabase.co';
}
if (!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuem5rZWZ1cWplemhpaWpiYm94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NDI3MTMsImV4cCI6MjA4NjUxODcxM30.h7fLYRSIicNLt_wtz_UD1STD6G_LRXzEPsQWIELkuzs';
}