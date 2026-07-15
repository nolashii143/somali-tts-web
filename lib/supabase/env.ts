/**
 * Normalize Project URL. People sometimes paste the REST endpoint
 * (`…/rest/v1`) which breaks Auth with "Invalid path specified in request URL".
 */
export function normalizeSupabaseUrl(raw: string | undefined | null): string {
  if (!raw) return "";

  let url = raw.trim().replace(/\/+$/, "");

  try {
    const parsed = new URL(url);
    // Keep only origin — drop /rest/v1, /auth/v1, etc.
    url = parsed.origin;
  } catch {
    url = url
      .replace(/\/rest\/v1\/?$/i, "")
      .replace(/\/auth\/v1\/?$/i, "")
      .replace(/\/+$/, "");
  }

  return url;
}

export function getSupabaseEnv() {
  return {
    url: normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
  };
}
