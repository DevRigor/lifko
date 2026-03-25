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
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const params = await searchParams
  const nextPath = params.next?.startsWith("/") ? params.next : "/admin/recursos"
  const errorMessage = params.error ?? null

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader ctaHref="/recursos" ctaLabel="Ver biblioteca" />

      <section className="mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-xl rounded-[2rem] bg-[radial-gradient(circle_at_top_left,oklch(0.74_0.14_210/0.22),transparent_50%),linear-gradient(180deg,color-mix(in_oklab,var(--card)_92%,transparent),color-mix(in_oklab,var(--background)_88%,transparent))] p-8 shadow-[0_16px_60px_rgba(21,28,34,0.10)] sm:p-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-secondary p-3 text-secondary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Acceso privado</p>
              <h1 className="mt-2 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
                Bienvenida
              </h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                Desde aqui podras organizar y actualizar la biblioteca del sitio.
              </p>
            </div>
          </div>

          <AdminLoginForm nextPath={nextPath} initialMessage={errorMessage} />
        </div>
      </section>
    </main>
  )
}
