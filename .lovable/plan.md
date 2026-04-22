

## Fix: "supabaseUrl is required" error

### Problem
The `.env` file that provides `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` is not being loaded during the build. The code configuration is correct — this is an environment/infrastructure issue, not a code bug.

### Solution

1. **Refresh the Lovable Cloud connection** — Go to **Connectors** (in the sidebar) and click on **Lovable Cloud**, then disconnect and reconnect (or refresh) the integration. This regenerates the managed `.env` file with the correct values.

2. **Restart the preview** — After refreshing the connection, reload the preview with a hard refresh (Ctrl+Shift+R).

No code changes are needed. The `vite.config.ts` and `client.ts` files are already configured correctly.

