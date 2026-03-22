"use client"

import { useMemo, useState } from "react"
import { Chrome } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function AdminLoginForm({
  nextPath,
  initialMessage = null,
}: {
  nextPath: string
  initialMessage?: string | null
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [message, setMessage] = useState<string | null>(initialMessage)

  async function handleGoogleLogin() {
    setStatus("loading")
    setMessage(null)

    const redirectTo = `${window.location.origin}/auth/callback`
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    })

    if (error) {
      setStatus("error")
      setMessage("No fue posible iniciar el acceso en este momento.")
      return
    }

    if (!data.url) {
      setStatus("error")
      setMessage("No fue posible continuar con el acceso.")
      return
    }

    window.location.assign(data.url)
  }

  return (
    <div className="space-y-5">
      <Button type="button" className="w-full gap-2" onClick={handleGoogleLogin} disabled={status === "loading"}>
        <Chrome className="h-4 w-4" />
        {status === "loading" ? "Redirigiendo..." : "Continuar"}
      </Button>

      {message ? <p className="text-sm text-destructive">{message}</p> : null}
    </div>
  )
}
