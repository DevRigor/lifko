import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseEnv } from "@/lib/supabase/shared"

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseEnv()

  return createBrowserClient(supabaseUrl, supabasePublishableKey)
}
