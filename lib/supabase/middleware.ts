import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { getSupabaseEnv } from "@/lib/supabase/shared"

export async function updateSession(request: NextRequest) {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseEnv()
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin/recursos")
  const isLoginRoute = request.nextUrl.pathname === "/admin/login"

  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("next", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (isAdminRoute && user) {
    const { data: isAdmin } = await supabase.rpc("is_resource_admin")

    if (!isAdmin) {
      await supabase.auth.signOut()
      const url = request.nextUrl.clone()
      url.pathname = "/"
      url.search = ""
      return NextResponse.redirect(url)
    }
  }

  if (isLoginRoute && user) {
    const { data: isAdmin } = await supabase.rpc("is_resource_admin")

    if (isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/recursos"
      url.searchParams.delete("next")
      return NextResponse.redirect(url)
    }

    await supabase.auth.signOut()
    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return response
}
