import { FileStack, FolderOpenDot, ShieldCheck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { ResourceExplorer } from "@/components/resources/resource-explorer"
import { ResourceState } from "@/components/resources/resource-state"
import { getPublishedResourcesLibrary } from "@/lib/resources"

export const metadata = {
  title: "Recursos",
  description: "Biblioteca de recursos, documentos y materiales de consulta de LIFKO.",
}
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string }>
}) {
  const params = await searchParams
  const library = await getPublishedResourcesLibrary()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader ctaHref="/admin/recursos" ctaLabel="Panel admin" />

      <section className="relative overflow-hidden border-b border-border/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.74_0.14_210/0.22),transparent_45%),radial-gradient(circle_at_bottom_right,oklch(0.63_0.1_145/0.18),transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Recursos LIFKO</p>
            <h1 className="mt-6 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
              Espacio de consulta para documentos, materiales y contenidos compartidos por LIFKO.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Recorre carpetas tematicas, abre archivos en linea y descarga el contenido disponible segun tus intereses.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border/70 bg-card/80 p-5 backdrop-blur">
              <FolderOpenDot className="h-6 w-6 text-primary" />
              <p className="mt-4 text-sm font-semibold text-foreground">Carpetas tematicas</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Explora contenidos organizados por temas para encontrar lo que necesitas.</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-card/80 p-5 backdrop-blur">
              <FileStack className="h-6 w-6 text-primary" />
              <p className="mt-4 text-sm font-semibold text-foreground">Documentos disponibles</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Accede a archivos listos para revisar, descargar y consultar cuando lo necesites.</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-card/80 p-5 backdrop-blur">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <p className="mt-4 text-sm font-semibold text-foreground">Acceso claro</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Una navegacion simple para moverte entre carpetas y abrir el contenido publicado.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {!library.schemaReady ? (
          <ResourceState
            title="Biblioteca en preparacion"
            description="Todavia estamos dejando lista esta seccion para mostrar contenido."
          />
        ) : null}

        {library.schemaReady && library.errorMessage ? (
          <ResourceState
            title="No fue posible cargar los recursos"
            description={`Ocurrio un problema al cargar esta seccion: ${library.errorMessage}`}
          />
        ) : null}

        {library.schemaReady && !library.errorMessage ? (
          <ResourceExplorer
            allFolders={library.folders}
            allResources={library.resources}
            initialFolderSlug={params.folder}
          />
        ) : null}
      </section>
    </main>
  )
}
