import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Supabase client for Client Components (browser).
 * Returns null if env vars are not configured.
 */
export function supabaseBrowser() {
    if (!url || !key) return null;
    return createBrowserClient(url, key);
}
