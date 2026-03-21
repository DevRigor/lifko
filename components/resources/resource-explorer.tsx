"use client"

import Link from "next/link"
import { ChevronDown, ChevronRight, Download, ExternalLink, FileText, Folder, FolderOpen } from "lucide-react"
import type { ResourceExplorerView, ResourceFolder, ResourceFolderNode, ResourceView } from "@/types/resources"

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

function folderHref(folder: ResourceFolder) {
  return `/recursos?folder=${encodeURIComponent(folder.slug)}`
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

function ResourceTreeBranch({
  node,
  currentFolderId,
  openFolderIds,
}: {
  node: ResourceFolderNode
  currentFolderId: string | null
  openFolderIds: Set<string>
}) {
  const isSelected = currentFolderId === node.id
  const hasChildren = node.children.length > 0
  const isExpanded = openFolderIds.has(node.id)

  return (
    <li className="space-y-1">
      <Link
        href={folderHref(node)}
        scroll={false}
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
      </Link>

      {hasChildren && isExpanded ? (
        <ul className="ml-5 space-y-1 border-l border-border/60 pl-3">
          {node.children.map((child) => (
            <ResourceTreeBranch
              key={child.id}
              node={child}
              currentFolderId={currentFolderId}
              openFolderIds={openFolderIds}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function ResourceDocuments({ resources }: { resources: ResourceView[] }) {
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
                    <Link
                      href={resource.access_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Ver
                    </Link>
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

export function ResourceExplorer({ explorer, allFolders }: { explorer: ResourceExplorerView; allFolders: ResourceFolder[] }) {
  const tree = buildTree(allFolders)
  const openFolderIds = buildOpenFolderSet(allFolders, explorer.currentFolder)
  const currentTitle = explorer.currentFolder ? explorer.currentFolder.name : "Raiz"
  const currentDescription = explorer.currentFolder
    ? explorer.currentFolder.description ?? "Carpeta seleccionada."
    : "Explora las carpetas disponibles y abre los documentos que quieras revisar o descargar."

  return (
    <section className="overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-sm shadow-black/5">
      <div className="border-b border-border/70 px-6 py-4">
        <h2 className="text-xl font-semibold text-foreground">Explorador de recursos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Navega por carpetas y accede al contenido disponible.
        </p>
      </div>

      <div className="grid min-h-[38rem] lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="border-r border-border/70 bg-background/70 p-4">
          <div className="mb-4 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Folder className="h-4 w-4" />
            Jerarquia de carpetas
          </div>
          <Link
            href="/recursos"
            scroll={false}
            className={`mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              explorer.currentFolder === null ? "bg-primary/12 text-foreground" : "text-foreground hover:bg-secondary/60"
            }`}
          >
            <FolderOpen className="h-4 w-4 text-primary" />
            Raiz
          </Link>
          {tree.length > 0 ? (
            <ul className="space-y-1">
              {tree.map((node) => (
                <ResourceTreeBranch
                  key={node.id}
                  node={node}
                  currentFolderId={explorer.currentFolder?.id ?? null}
                  openFolderIds={openFolderIds}
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
                    <Link
                      key={folder.id}
                      href={folderHref(folder)}
                      scroll={false}
                      className="rounded-2xl border border-border/60 bg-card/80 p-5 text-left transition-colors hover:bg-secondary/45"
                    >
                      <Folder className="h-6 w-6 text-primary" />
                      <p className="mt-4 text-sm font-semibold text-foreground">{folder.name}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {folder.description ?? "Carpeta sin descripcion aun."}
                      </p>
                    </Link>
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
              <ResourceDocuments resources={explorer.resources} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
