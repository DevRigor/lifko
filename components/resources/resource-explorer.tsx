"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, Download, ExternalLink, FileText, Folder, FolderOpen, PanelLeftOpen } from "lucide-react"
import type { ResourceExplorerView, ResourceFolder, ResourceFolderNode, ResourceView } from "@/types/resources"
import { MediaLightbox } from "@/components/ui/media-lightbox"

function buildTree(folders: ResourceFolder[]) {
  const nodes = folders.map((folder) => ({ ...folder, children: [] as ResourceFolderNode[] }))
  const nodeMap = new Map(nodes.map((node) => [node.id, node]))
  const roots: ResourceFolderNode[] = []

  nodes.forEach((node) => {
    if (node.parent_id) {
      const parent = nodeMap.get(node.parent_id)
      if (parent) {
        parent.children.push(node)
        return
      }
    }

    roots.push(node)
  })

  nodeMap.forEach((node) => {
    node.children.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
  })

  return roots.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
}

function buildOpenFolderSet(folders: ResourceFolder[], currentFolder: ResourceFolder | null) {
  const foldersById = new Map(folders.map((folder) => [folder.id, folder]))
  const openIds = new Set<string>()

  let cursor = currentFolder
  while (cursor) {
    openIds.add(cursor.id)
    cursor = cursor.parent_id ? (foldersById.get(cursor.parent_id) ?? null) : null
  }

  return openIds
}

function buildExplorerView(allFolders: ResourceFolder[], resources: ResourceView[], activeFolderSlug?: string | null): ResourceExplorerView {
  const rootFolders = allFolders.filter((folder) => !folder.parent_id)

  if (!activeFolderSlug) {
    return {
      currentFolder: null,
      breadcrumbs: [],
      childFolders: rootFolders,
      resources: resources.filter((resource) => !resource.folder_id),
      rootFolders,
    }
  }

  const currentFolder = allFolders.find((folder) => folder.slug === activeFolderSlug) ?? null

  if (!currentFolder) {
    return {
      currentFolder: null,
      breadcrumbs: [],
      childFolders: rootFolders,
      resources: resources.filter((resource) => !resource.folder_id),
      rootFolders,
    }
  }

  const foldersById = new Map(allFolders.map((folder) => [folder.id, folder]))
  const breadcrumbs: ResourceFolder[] = []

  let cursor: ResourceFolder | null = currentFolder
  while (cursor) {
    breadcrumbs.unshift(cursor)
    cursor = cursor.parent_id ? (foldersById.get(cursor.parent_id) ?? null) : null
  }

  return {
    currentFolder,
    breadcrumbs,
    childFolders: allFolders.filter((folder) => folder.parent_id === currentFolder.id),
    resources: resources.filter((resource) => resource.folder_id === currentFolder.id),
    rootFolders,
  }
}

function updateFolderUrl(folderSlug?: string | null) {
  const url = folderSlug
    ? `/recursos?folder=${encodeURIComponent(folderSlug)}`
    : "/recursos"

  window.history.pushState(null, "", url)
}

function ResourceBreadcrumbs({
  breadcrumbs,
  onNavigate,
}: {
  breadcrumbs: ResourceFolder[]
  onNavigate: (folderSlug?: string | null) => void
}) {
  const currentFolder = breadcrumbs[breadcrumbs.length - 1] ?? null

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
    >
      <button
        type="button"
        onClick={() => onNavigate(null)}
        className="rounded-full border border-border/70 px-3 py-1 transition-colors hover:bg-secondary/70 hover:text-foreground"
      >
        Recursos
      </button>
      {breadcrumbs.map((folder) => {
        const isLast = currentFolder?.id === folder.id

        return (
          <span key={folder.id} className="inline-flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="rounded-full bg-primary/12 px-3 py-1 text-foreground">{folder.name}</span>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate(folder.slug)}
                className="rounded-full border border-border/70 px-3 py-1 transition-colors hover:bg-secondary/70 hover:text-foreground"
              >
                {folder.name}
              </button>
            )}
          </span>
        )
      })}
    </nav>
  )
}

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

function canPreviewResource(resource: ResourceView) {
  if (!resource.access_url || !resource.mime_type) return false
  return resource.mime_type.startsWith("image/") || resource.mime_type.includes("pdf")
}

function ResourceTreeBranch({
  node,
  currentFolderId,
  openFolderIds,
  onNavigate,
}: {
  node: ResourceFolderNode
  currentFolderId: string | null
  openFolderIds: Set<string>
  onNavigate: (folderSlug?: string | null) => void
}) {
  const isSelected = currentFolderId === node.id
  const hasChildren = node.children.length > 0
  const isExpanded = openFolderIds.has(node.id)

  return (
    <li className="space-y-1">
      <button
        type="button"
        onClick={() => onNavigate(node.slug)}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
          isSelected ? "bg-primary/12 text-foreground" : "text-foreground hover:bg-secondary/60"
        }`}
      >
        {hasChildren ? (
          isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />
        ) : (
          <span className="h-4 w-4" />
        )}
        {isExpanded ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-primary" />}
        <span className="truncate">{node.name}</span>
      </button>

      {hasChildren && isExpanded ? (
        <ul className="ml-5 space-y-1 border-l border-border/60 pl-3">
          {node.children.map((child) => (
            <ResourceTreeBranch
              key={child.id}
              node={child}
              currentFolderId={currentFolderId}
              openFolderIds={openFolderIds}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function ResourceDocuments({
  resources,
  onPreview,
}: {
  resources: ResourceView[]
  onPreview: (resource: ResourceView) => void
}) {
  if (resources.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
        No hay documentos disponibles en esta ubicacion.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80">
      <table className="w-full text-left text-sm">
        <thead className="bg-secondary/60 text-secondary-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Titulo</th>
            <th className="px-4 py-3 font-medium">Archivo</th>
            <th className="px-4 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id} className="border-t border-border/60">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{resource.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {resource.summary ?? "Documento disponible en la biblioteca de LIFKO."}
                </p>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                <div>{resource.file_name ?? "Sin archivo"}</div>
                <div className="mt-1 text-xs">
                  {formatFileSize(resource.file_size) ?? "Tamano no disponible"}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {resource.access_url ? (
                    canPreviewResource(resource) ? (
                      <button
                        type="button"
                        onClick={() => onPreview(resource)}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Ver
                      </button>
                    ) : (
                      <Link
                        href={resource.access_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Ver
                      </Link>
                    )
                  ) : null}
                  {resource.access_url ? (
                    <Link
                      href={resource.access_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar
                    </Link>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ResourceExplorer({
  allFolders,
  allResources,
  initialFolderSlug,
}: {
  allFolders: ResourceFolder[]
  allResources: ResourceView[]
  initialFolderSlug?: string | null
}) {
  const [previewResource, setPreviewResource] = useState<ResourceView | null>(null)
  const [activeFolderSlug, setActiveFolderSlug] = useState(initialFolderSlug ?? null)
  const explorer = useMemo(
    () => buildExplorerView(allFolders, allResources, activeFolderSlug),
    [activeFolderSlug, allFolders, allResources]
  )
  const tree = buildTree(allFolders)
  const openFolderIds = buildOpenFolderSet(allFolders, explorer.currentFolder)
  const currentTitle = explorer.currentFolder ? explorer.currentFolder.name : "Raiz"
  const currentDescription = explorer.currentFolder
    ? explorer.currentFolder.description ?? "Carpeta seleccionada."
    : "Explora las carpetas disponibles y abre los documentos que quieras revisar o descargar."

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      setActiveFolderSlug(params.get("folder"))
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const navigateToFolder = (folderSlug?: string | null) => {
    setActiveFolderSlug(folderSlug ?? null)
    updateFolderUrl(folderSlug ?? null)
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-sm shadow-black/5">
      <div className="border-b border-border/70 px-6 py-4">
        <h2 className="text-xl font-semibold text-foreground">Explorador de recursos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Navega por carpetas y accede al contenido disponible.
        </p>
      </div>

      <div className="grid min-h-[38rem] lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-border/70 bg-background/70 p-4 lg:block">
          <div className="mb-4 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Folder className="h-4 w-4" />
            Jerarquia de carpetas
          </div>
          <button
            type="button"
            onClick={() => navigateToFolder(null)}
            className={`mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              explorer.currentFolder === null ? "bg-primary/12 text-foreground" : "text-foreground hover:bg-secondary/60"
            }`}
          >
            <FolderOpen className="h-4 w-4 text-primary" />
            Raiz
          </button>
          {tree.length > 0 ? (
            <ul className="space-y-1">
              {tree.map((node) => (
                <ResourceTreeBranch
                  key={node.id}
                  node={node}
                  currentFolderId={explorer.currentFolder?.id ?? null}
                  openFolderIds={openFolderIds}
                  onNavigate={navigateToFolder}
                />
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card/60 p-4 text-sm text-muted-foreground">
              Todavia no hay carpetas disponibles.
            </div>
          )}
        </aside>

        <div className="bg-background/50">
          <div className="border-b border-border/70 px-6 py-4">
            <div className="flex flex-col gap-4">
              <div className="lg:hidden">
                <details className="overflow-hidden rounded-2xl border border-border/70 bg-background/80">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    <span className="inline-flex items-center gap-2">
                      <PanelLeftOpen className="h-4 w-4 text-primary" />
                      Navegar carpetas
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </summary>

                  <div className="space-y-2 border-t border-border/70 px-3 py-3">
                    <button
                      type="button"
                      onClick={() => navigateToFolder(null)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        explorer.currentFolder === null ? "bg-primary/12 text-foreground" : "text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      <FolderOpen className="h-4 w-4 text-primary" />
                      Raiz
                    </button>
                    {tree.length > 0 ? (
                      <ul className="space-y-1">
                        {tree.map((node) => (
                          <ResourceTreeBranch
                            key={node.id}
                            node={node}
                            currentFolderId={explorer.currentFolder?.id ?? null}
                            openFolderIds={openFolderIds}
                            onNavigate={navigateToFolder}
                          />
                        ))}
                      </ul>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-4 text-sm text-muted-foreground">
                        Todavia no hay carpetas disponibles.
                      </div>
                    )}
                  </div>
                </details>
              </div>

              <ResourceBreadcrumbs breadcrumbs={explorer.breadcrumbs} onNavigate={navigateToFolder} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Contenido de carpeta</p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">{currentTitle}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{currentDescription}</p>
            </div>
          </div>

          <div className="space-y-8 p-6">
            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Subcarpetas</h4>
                <span className="text-xs text-muted-foreground">{explorer.childFolders.length}</span>
              </div>
              {explorer.childFolders.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {explorer.childFolders.map((folder) => (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => navigateToFolder(folder.slug)}
                      className="rounded-2xl border border-border/60 bg-card/80 p-5 text-left transition-colors hover:bg-secondary/45"
                    >
                      <Folder className="h-6 w-6 text-primary" />
                      <p className="mt-4 text-sm font-semibold text-foreground">{folder.name}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {folder.description ?? "Carpeta sin descripcion aun."}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
                  No hay subcarpetas en esta ubicacion.
                </div>
              )}
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Documentos
                </h4>
                <span className="text-xs text-muted-foreground">{explorer.resources.length}</span>
              </div>
              <ResourceDocuments resources={explorer.resources} onPreview={setPreviewResource} />
            </div>
          </div>
        </div>
      </div>

      {previewResource ? (
        <MediaLightbox
          title={previewResource.title}
          src={previewResource.access_url ?? ""}
          alt={previewResource.title}
          kind={previewResource.mime_type?.startsWith("image/") ? "image" : "pdf"}
          fileName={previewResource.file_name}
          externalHref={previewResource.access_url}
          externalLabel="Ver aparte"
          onClose={() => setPreviewResource(null)}
        />
      ) : null}
    </section>
  )
}
