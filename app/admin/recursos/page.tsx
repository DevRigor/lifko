import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { DatabaseZap, FolderCog, LockKeyhole, LogOut, Upload } from "lucide-react"
import { signOutAction } from "@/app/admin/recursos/actions"
import { SiteHeader } from "@/components/site-header"
import { ResourceState } from "@/components/resources/resource-state"
import { AdminResourceForms } from "@/components/admin/resources/admin-resource-forms"
import { Button } from "@/components/ui/button"
import { getAdminResourcesLibrary } from "@/lib/resources"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Admin Recursos",
  description: "Panel privado para gestionar la biblioteca documental de LIFKO.",
  robots: {
    index: false,
    follow: false,
  },
}

function Notice({ message, tone }: { message: string; tone: "success" | "error" }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        tone === "success"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-destructive/30 bg-destructive/10 text-destructive"
      }`}
    >
      {message}
    </div>
  )
}

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const params = await searchParams
  const supabase = await createSupabaseServerClient()

  const [
    { data: authData },
    { data: isAdmin, error: adminError },
    library,
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc("is_resource_admin"),
    getAdminResourcesLibrary(),
  ])

  const user = authData.user
  const hasAdminAccess = Boolean(user && !adminError && isAdmin)

  if (user && !hasAdminAccess) {
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader ctaHref="/recursos" ctaLabel="Ver biblioteca" showAdminLink={hasAdminAccess} />

      <section className="border-b border-border/70 bg-secondary/35">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Admin Recursos</p>
              <h1 className="mt-6 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
                Biblioteca administrable con explorador de carpetas y documentos.
              </h1>
              <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg">
                La gestion de carpetas ahora vive en una interfaz tipo explorador. Los documentos se cargan desde tu PC y se guardan en Supabase Storage sin exponer el bucket al publico.
              </p>
            </div>

            {user ? (
              <form action={signOutAction}>
                <Button type="submit" variant="outline" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Cerrar sesion
                </Button>
              </form>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-6">
        {params.success ? <Notice tone="success" message={params.success} /> : null}
        {params.error ? <Notice tone="error" message={params.error} /> : null}

        {!hasAdminAccess ? (
          <ResourceState
            title="Acceso autenticado pero sin privilegios admin"
            description="Tu usuario debe existir en la tabla `admin_users` y la funcion `is_resource_admin()` debe estar actualizada para validar el email del JWT. Ejecuta el fix SQL si acabas de implementar Auth y el panel todavia no te reconoce como admin."
          />
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-3xl border border-border/70 bg-card/95 p-8 shadow-sm shadow-black/5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-secondary p-3 text-secondary-foreground">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Estado de acceso</h2>
                    <p className="text-sm text-muted-foreground">Sesion administrativa activa en Supabase Auth.</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-background/80 p-5">
                  <div className="space-y-2 text-sm text-foreground">
                    <p className="font-medium">Sesion administrativa detectada</p>
                    <p>{user?.email ?? user?.id}</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <Upload className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-sm font-semibold text-foreground">Uploads</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Carga directa desde tu PC al bucket privado.</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <FolderCog className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-sm font-semibold text-foreground">Explorador</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Gestion de carpetas desde una interfaz tipo sistema de archivos.</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <DatabaseZap className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-sm font-semibold text-foreground">Publicacion</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Los documentos pueden quedar en borrador o visibles al publico.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border/70 bg-card/95 p-8 shadow-sm shadow-black/5">
                <h2 className="text-xl font-semibold text-foreground">Estado de datos</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Esta vista ya consume el inventario completo de la biblioteca desde Supabase.
                </p>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="rounded-2xl bg-background/80 p-4">
                    <p className="font-medium text-foreground">Carpetas registradas</p>
                    <p className="mt-1 text-muted-foreground">{library.folders.length}</p>
                  </div>
                  <div className="rounded-2xl bg-background/80 p-4">
                    <p className="font-medium text-foreground">Recursos registrados</p>
                    <p className="mt-1 text-muted-foreground">{library.resources.length}</p>
                  </div>
                </div>

                <div className="mt-6">
                  {!library.schemaReady ? (
                    <ResourceState
                      title="Esquema pendiente"
                      description="Ejecuta el archivo SQL inicial en Supabase para crear tablas, bucket y politicas antes de avanzar con el panel admin real."
                    />
                  ) : null}

                  {library.schemaReady && library.errorMessage ? (
                    <ResourceState
                      title="Error de lectura"
                      description={`Supabase respondio con: ${library.errorMessage}`}
                    />
                  ) : null}

                  {library.schemaReady && !library.errorMessage ? (
                    <div className="rounded-2xl border border-border/60 bg-background/80 p-5 text-sm text-muted-foreground">
                      La conexion con Supabase responde. Ya puedes organizar carpetas y cargar documentos desde el explorador admin.
                    </div>
                  ) : null}
                </div>

                <div className="mt-6">
                  <Link href="/recursos" className="text-sm font-medium text-primary hover:underline">
                    Abrir biblioteca publica
                  </Link>
                </div>
              </div>
            </div>

            {library.schemaReady && !library.errorMessage ? (
              <AdminResourceForms folders={library.folders} resources={library.resources} />
            ) : null}
          </>
        )}
      </section>
    </main>
  )
}
