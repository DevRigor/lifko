import type { Metadata } from "next"
import { ShieldCheck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { AdminLoginForm } from "@/components/admin/resources/admin-login-form"

export const metadata: Metadata = {
  title: "Login Admin",
  description: "Acceso privado al panel de recursos de LIFKO.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const params = await searchParams
  const nextPath = params.next?.startsWith("/") ? params.next : "/admin/recursos"

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader ctaHref="/recursos" ctaLabel="Ver biblioteca" />

      <section className="mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top_left,oklch(0.74_0.14_210/0.18),transparent_44%),linear-gradient(180deg,color-mix(in_oklab,var(--card)_92%,transparent),color-mix(in_oklab,var(--background)_88%,transparent))] p-10 shadow-sm shadow-black/5">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Acceso privado</p>
            <h1 className="mt-6 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
              Gestiona la biblioteca documental sin exponer la operacion al frontend publico.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              El panel admin queda aislado del sitio publico. El acceso ahora usa Google como proveedor de identidad y la autorizacion final depende de la whitelist interna de administradores.
            </p>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-card/95 p-8 shadow-sm shadow-black/5">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-secondary p-3 text-secondary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Ingresar al panel</h2>
                <p className="text-sm text-muted-foreground">Autenticacion con Google OAuth.</p>
              </div>
            </div>

            <AdminLoginForm nextPath={nextPath} />
          </div>
        </div>
      </section>
    </main>
  )
}
