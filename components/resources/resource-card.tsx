import Link from "next/link"
import { Download, ExternalLink, FileText, FolderOpen, ImageIcon } from "lucide-react"
import type { ResourceView } from "@/types/resources"

function formatFileSize(fileSize: number | null) {
  if (!fileSize) return null

  const units = ["B", "KB", "MB", "GB"]
  let size = fileSize
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

function getResourceIcon(mimeType: string | null) {
  if (!mimeType) return FileText
  if (mimeType.startsWith("image/")) return ImageIcon
  if (mimeType.includes("pdf")) return FolderOpen
  return FileText
}

export function ResourceCard({ resource }: { resource: ResourceView }) {
  const Icon = getResourceIcon(resource.mime_type)
  const sizeLabel = formatFileSize(resource.file_size)

  return (
    <article className="flex h-full flex-col rounded-3xl bg-card/95 p-6 shadow-[0_4px_20px_rgba(21,28,34,0.06)] hover:shadow-[0_12px_36px_rgba(21,28,34,0.10)] hover:-translate-y-0.5 transition-all duration-300 border border-transparent hover:border-accent/20">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Recurso</p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">{resource.title}</h3>
          </div>
        </div>
        {resource.mime_type ? (
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {resource.mime_type.split("/").at(-1)?.toUpperCase()}
          </span>
        ) : null}
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        {resource.summary ?? "Documento disponible en la biblioteca publica de LIFKO."}
      </p>

      <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
        {sizeLabel ? <span>{sizeLabel}</span> : null}
        {resource.updated_at ? <span>Actualizado {new Date(resource.updated_at).toLocaleDateString("es-CL")}</span> : null}
      </div>

      <div className="mt-6 flex gap-3">
        {resource.access_url ? (
          <Link
            href={resource.access_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ExternalLink className="h-4 w-4" />
            Ver
          </Link>
        ) : null}
        {resource.access_url ? (
          <Link
            href={resource.access_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Download className="h-4 w-4" />
            Descargar
          </Link>
        ) : null}
      </div>
    </article>
  )
}
