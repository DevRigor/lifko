import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { getSupabaseEnv } from "@/lib/supabase/shared"

export async function GET(request: NextRequest) {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseEnv()
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next")
  const nextPath = next?.startsWith("/") ? next : "/admin/recursos"

  if (code) {
    const response = NextResponse.redirect(new URL(nextPath, request.url))
    const supabase = createServerClient(
      supabaseUrl,
      supabasePublishableKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("next", nextPath)
      loginUrl.searchParams.set("error", "No fue posible completar el acceso.")
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  const loginUrl = new URL("/admin/login", request.url)
  loginUrl.searchParams.set("next", nextPath)
  loginUrl.searchParams.set("error", "La solicitud de acceso no pudo validarse.")
  return NextResponse.redirect(loginUrl)
}
