import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@/lib/supabase/env";

export { getSupabaseEnv } from "@/lib/supabase/env";

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart npm run dev.",
    );
  }

  return createBrowserClient(url, anonKey);
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseEnv();
  return Boolean(url && anonKey);
}

export function formatAuthError(error: unknown): string {
  if (error instanceof TypeError && String(error.message).includes("fetch")) {
    return (
      "Cannot reach Supabase. Open your Supabase dashboard → Settings → API, " +
      "copy the Project URL (https://xxxx.supabase.co — no /rest/v1) into " +
      "NEXT_PUBLIC_SUPABASE_URL, then redeploy."
    );
  }

  if (error instanceof Error) {
    if (/invalid path/i.test(error.message)) {
      return (
        "Supabase URL looks wrong. Use the Project URL only " +
        "(https://xxxx.supabase.co), not the REST URL ending in /rest/v1."
      );
    }
    return error.message;
  }

  return "Unexpected authentication error.";
}
