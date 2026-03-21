import Link from "next/link"
import { ChevronRight, FolderTree } from "lucide-react"
import type { ResourceFolder } from "@/types/resources"

function folderHref(folder: ResourceFolder) {
  return `/recursos?folder=${encodeURIComponent(folder.slug)}`
}

export function ResourceBreadcrumbs({ breadcrumbs }: { breadcrumbs: ResourceFolder[] }) {
  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Link href="/recursos" className="transition-colors hover:text-foreground">
        Recursos
      </Link>
      {breadcrumbs.map((folder) => (
        <span key={folder.id} className="inline-flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          <Link href={folderHref(folder)} className="transition-colors hover:text-foreground">
            {folder.name}
          </Link>
        </span>
      ))}
    </nav>
  )
}

export function ResourceFolders({
  folders,
  title,
  description,
}: {
  folders: ResourceFolder[]
  title: string
  description: string
}) {
  if (folders.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card/60 p-6 text-sm text-muted-foreground">
        Todavia no hay carpetas disponibles en este nivel.
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm shadow-black/5">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-secondary p-3 text-secondary-foreground">
          <FolderTree className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {folders.map((folder) => (
          <Link
            key={folder.id}
            href={folderHref(folder)}
            className="rounded-2xl border border-border/60 bg-background/80 p-4 transition-colors hover:bg-secondary/50"
          >
            <p className="text-sm font-semibold text-foreground">{folder.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">/{folder.slug}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {folder.description ?? "Carpeta sin descripcion editorial aun."}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
