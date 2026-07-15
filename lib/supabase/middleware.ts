import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv } from "@/lib/supabase/env";

const PUBLIC_PATHS = ["/auth/login", "/auth/signup", "/auth/callback"];

export async function updateSession(request: NextRequest) {
  const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabaseEnv();

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublic =
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/api");

  if (!user && !isPublic) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname.startsWith("/auth/login")) {
    const redirect = request.nextUrl.searchParams.get("redirect") ?? "/generate";
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  if (user && pathname.startsWith("/auth/signup")) {
    return NextResponse.redirect(new URL("/generate", request.url));
  }

  return response;
}
