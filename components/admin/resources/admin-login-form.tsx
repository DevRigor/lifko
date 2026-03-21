"use client"

import { useMemo, useState } from "react"
import { Chrome, Shield } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)

  async function handleGoogleLogin() {
    setStatus("loading")
    setMessage(null)

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    })

    if (error) {
      setStatus("error")
      setMessage(error.message)
      return
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
        El acceso admin usa Google como proveedor de identidad. Aunque el login funcione, solo podran entrar al panel los correos autorizados en `admin_users`.
      </div>

      <Button type="button" className="w-full gap-2" onClick={handleGoogleLogin} disabled={status === "loading"}>
        <Chrome className="h-4 w-4" />
        {status === "loading" ? "Redirigiendo a Google..." : "Entrar con Google"}
      </Button>

      <div className="rounded-2xl border border-border/60 bg-secondary/35 p-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-4 w-4 text-primary" />
          <p>
            La seguridad no depende de ocultar la URL del panel. Depende de `Google OAuth`, sesion valida y verificacion contra la whitelist de administradores.
          </p>
        </div>
      </div>

      {message ? <p className="text-sm text-destructive">{message}</p> : null}
    </div>
  )
}
