"use client"

import Link from "next/link"
import { ExternalLink, X } from "lucide-react"

type MediaLightboxProps = {
  title: string
  src: string
  alt?: string
  kind: "image" | "pdf"
  fileName?: string | null
  externalHref?: string | null
  externalLabel?: string
  onClose: () => void
}

export function MediaLightbox({
  title,
  src,
  alt,
  kind,
  fileName,
  externalHref = null,
  externalLabel = "Ver aparte",
  onClose,
}: MediaLightboxProps) {
  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Cerrar visor"
      />
      <div className="fixed inset-x-4 top-4 bottom-4 z-50 mx-auto flex max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-background shadow-2xl shadow-black/30">
        <div className="flex items-start justify-between gap-4 border-b border-border/70 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Vista previa</p>
            <h3 className="mt-1 truncate text-lg font-semibold text-foreground">{title}</h3>
            {fileName ? <p className="mt-1 text-sm text-muted-foreground">{fileName}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Cerrar visor"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 bg-secondary/20 p-4">
          {kind === "image" ? (
            <div className="flex h-full items-center justify-center overflow-auto rounded-2xl bg-background/80 p-4">
              <img src={src} alt={alt ?? title} className="max-h-full w-auto max-w-full rounded-2xl object-contain" />
            </div>
          ) : (
            <iframe title={title} src={src} className="h-full w-full rounded-2xl border border-border/60 bg-white" />
          )}
        </div>

        {externalHref ? (
          <div className="flex justify-end border-t border-border/70 px-5 py-4">
            <Link
              href={externalHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <ExternalLink className="h-4 w-4" />
              {externalLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </>
  )
}
