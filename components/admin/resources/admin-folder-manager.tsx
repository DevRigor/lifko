"use client"

import { useMemo, useState, useTransition } from "react"
import {
  ChevronDown,
  ChevronRight,
  FilePenLine,
  Folder,
  FolderOpen,
  FolderPlus,
  Loader,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import {
  createFolderAction,
  createResourceAction,
  deleteFolderAction,
  renameFolderAction,
  toggleResourcePublishedAction,
} from "@/app/admin/recursos/actions"
import {
  buildResourceStoragePath,
  RESOURCE_ALLOWED_MIME_TYPES,
  RESOURCE_BUCKET,
  RESOURCE_MAX_UPLOAD_BYTES,
  slugifyResourceValue,
} from "@/lib/resource-storage"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ResourceFolder, ResourceView } from "@/types/resources"

type FolderTreeNode = ResourceFolder & {
  children: FolderTreeNode[]
}

type ContextTarget = {
  folder: ResourceFolder | null
  x: number
  y: number
}

type ResourceContextTarget = {
  resource: ResourceView
  x: number
  y: number
}

function buildTree(folders: ResourceFolder[]) {
  const nodes = folders.map((folder) => ({ ...folder, children: [] as FolderTreeNode[] }))
  const nodeMap = new Map(nodes.map((node) => [node.id, node]))
  const roots: FolderTreeNode[] = []

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

function formatBytes(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`
}

function getFolderStats(folderId: string | null, folders: ResourceFolder[], resources: ResourceView[]) {
  const childFolders = folders.filter((folder) => folder.parent_id === folderId)
  const currentResources = resources.filter((resource) => resource.folder_id === folderId)

  return {
    childFolders,
    currentResources,
  }
}

function TreeBranch({
  node,
  selectedId,
  onSelect,
  onOpen,
  onContextAction,
}: {
  node: FolderTreeNode
  selectedId: string | null
  onSelect: (folder: ResourceFolder) => void
  onOpen: (folder: ResourceFolder) => void
  onContextAction: (event: React.MouseEvent<HTMLElement>, folder: ResourceFolder) => void
}) {
  const [isOpen, setIsOpen] = useState(true)
  const isSelected = selectedId === node.id
  const hasChildren = node.children.length > 0

  return (
    <li className="space-y-1">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className={`flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors ${
            hasChildren ? "hover:bg-secondary hover:text-foreground" : "opacity-30"
          }`}
          aria-label={isOpen ? `Contraer ${node.name}` : `Expandir ${node.name}`}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-border" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelect(node)}
          onDoubleClick={() => onOpen(node)}
          onContextMenu={(event) => onContextAction(event, node)}
          className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            isSelected ? "bg-primary/12 text-foreground" : "hover:bg-secondary/60 text-foreground"
          }`}
        >
          {isOpen && hasChildren ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-primary" />}
          <span className="truncate">{node.name}</span>
        </button>
      </div>

      {hasChildren && isOpen ? (
        <ul className="ml-5 space-y-1 border-l border-border/60 pl-3">
          {node.children.map((child) => (
            <TreeBranch
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              onOpen={onOpen}
              onContextAction={onContextAction}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function ModalShell({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <button type="button" className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]" onClick={onClose} aria-label="Cerrar ventana" />
      <div className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,38rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border/70 bg-background/95 p-6 shadow-2xl shadow-black/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </>
  )
}

function CreateFolderModal({ parentFolder, onClose }: { parentFolder: ResourceFolder | null; onClose: () => void }) {
  return (
    <ModalShell title={parentFolder ? `Nueva carpeta en ${parentFolder.name}` : "Nueva carpeta raiz"} subtitle="La carpeta se publicara automaticamente para que aparezca en la navegacion publica." onClose={onClose}>
      <form action={createFolderAction} className="space-y-5">
        <input type="hidden" name="parent_id" value={parentFolder?.id ?? ""} />
        <input type="hidden" name="sort_order" value="0" />
        <div className="space-y-2">
          <Label htmlFor="folder-name">Nombre</Label>
          <Input id="folder-name" name="name" placeholder={parentFolder ? "Monitoreo" : "Agua"} required autoFocus />
        </div>
        <div className="space-y-2">
          <Label htmlFor="folder-description">Descripcion opcional</Label>
          <textarea id="folder-description" name="description" rows={4} className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" placeholder="Breve ayuda visual para quienes naveguen esta carpeta" />
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" className="gap-2"><FolderPlus className="h-4 w-4" />Crear carpeta</Button>
        </div>
      </form>
    </ModalShell>
  )
}

function RenameFolderModal({ folder, onClose }: { folder: ResourceFolder; onClose: () => void }) {
  return (
    <ModalShell title={`Renombrar ${folder.name}`} subtitle="Actualiza el nombre visible y la descripcion de esta carpeta." onClose={onClose}>
      <form action={renameFolderAction} className="space-y-5">
        <input type="hidden" name="id" value={folder.id} />
        <div className="space-y-2">
          <Label htmlFor="rename-folder-name">Nombre</Label>
          <Input id="rename-folder-name" name="name" defaultValue={folder.name} required autoFocus />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rename-folder-description">Descripcion opcional</Label>
          <textarea id="rename-folder-description" name="description" rows={4} defaultValue={folder.description ?? ""} className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" />
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" className="gap-2"><FilePenLine className="h-4 w-4" />Guardar cambios</Button>
        </div>
      </form>
    </ModalShell>
  )
}

function DeleteFolderModal({ folder, onClose }: { folder: ResourceFolder; onClose: () => void }) {
  return (
    <ModalShell title={`Eliminar ${folder.name}`} subtitle="Solo se pueden eliminar carpetas vacias, sin subcarpetas ni documentos." onClose={onClose}>
      <form action={deleteFolderAction} className="space-y-5">
        <input type="hidden" name="id" value={folder.id} />
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">Esta accion intenta borrar la carpeta. Si contiene subcarpetas o documentos, el sistema la bloqueara.</p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="destructive" className="gap-2"><Trash2 className="h-4 w-4" />Eliminar carpeta</Button>
        </div>
      </form>
    </ModalShell>
  )
}

function UploadModal({ folders, targetFolder, onClose }: { folders: ResourceFolder[]; targetFolder: ResourceFolder | null; onClose: () => void }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [isPending, startTransition] = useTransition()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusTone, setStatusTone] = useState<"error" | "neutral">("neutral")
  const [selectedFolderId, setSelectedFolderId] = useState(targetFolder?.id ?? "")
  const [attachedFile, setAttachedFile] = useState<File | null>(null)

  async function processSubmit(formData: FormData) {
    const title = String(formData.get("title") ?? "").trim()
    const file = attachedFile ?? (formData.get("file") instanceof File ? (formData.get("file") as File) : null)

    if (!file || file.size === 0) {
      setStatusTone("error")
      setStatusMessage("Debes seleccionar o arrastrar un archivo desde tu PC.")
      return
    }

    if (!title) {
      setStatusTone("error")
      setStatusMessage("El documento necesita un titulo.")
      return
    }

    if (!RESOURCE_ALLOWED_MIME_TYPES.includes(file.type as (typeof RESOURCE_ALLOWED_MIME_TYPES)[number])) {
      setStatusTone("error")
      setStatusMessage("Tipo de archivo no permitido. Usa PDF, JPG, PNG o WEBP.")
      return
    }

    if (file.size > RESOURCE_MAX_UPLOAD_BYTES) {
      setStatusTone("error")
      setStatusMessage(`El archivo supera el limite de ${formatBytes(RESOURCE_MAX_UPLOAD_BYTES)} para esta version.`)
      return
    }

    const folder = folders.find((item) => item.id === selectedFolderId)
    const folderSlug = folder?.slug ?? slugifyResourceValue(title)
    const storagePath = buildResourceStoragePath(folderSlug || null, file.name)

    setStatusMessage("Subiendo archivo...")

    const { error: uploadError } = await supabase.storage.from(RESOURCE_BUCKET).upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    })

    if (uploadError) {
      setStatusTone("error")
      setStatusMessage("No se pudo subir el archivo. Intenta nuevamente.")
      return
    }

    formData.delete("file")
    formData.set("folder_id", selectedFolderId)
    formData.set("file_path", storagePath)
    formData.set("file_name", file.name)
    formData.set("mime_type", file.type)
    formData.set("file_size", String(file.size))

    startTransition(async () => {
      await createResourceAction(formData)
    })
  }

  return (
    <ModalShell title={`Subir en ${targetFolder?.name ?? "esta carpeta"}`} subtitle={`Carga directa desde tu PC. Limite actual: ${formatBytes(RESOURCE_MAX_UPLOAD_BYTES)}.`} onClose={onClose}>
      <form onSubmit={(event) => { event.preventDefault(); setStatusMessage(null); setStatusTone("neutral"); const formData = new FormData(event.currentTarget); void processSubmit(formData) }} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="resource-title-modal">Titulo</Label>
          <Input id="resource-title-modal" name="title" placeholder="Informe de calidad de agua" required autoFocus />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resource-slug-modal">Identificador URL</Label>
          <Input id="resource-slug-modal" name="slug" placeholder="se genera automaticamente si lo dejas vacio" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resource-summary-modal">Resumen</Label>
          <textarea id="resource-summary-modal" name="summary" rows={4} className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" placeholder="Contexto visible para el visitante" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resource-file-modal">Archivo</Label>
          <Input id="resource-file-modal" name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(event) => setAttachedFile(event.target.files?.[0] ?? null)} />
          {attachedFile ? <p className="text-xs text-muted-foreground">Archivo seleccionado: {attachedFile.name}</p> : null}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="resource-sort-order-modal">Orden visual</Label>
            <Input id="resource-sort-order-modal" name="sort_order" type="number" defaultValue="0" />
          </div>
          <label htmlFor="resource-published-modal" className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-foreground md:self-end">
            <input id="resource-published-modal" name="is_published" type="checkbox" className="h-4 w-4 rounded border-border" defaultChecked />
            <span>Mostrar al publico</span>
          </label>
        </div>
        {statusMessage ? <div className={`rounded-2xl border px-4 py-3 text-sm ${statusTone === "error" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-border/60 bg-background/70 text-muted-foreground"}`}>{statusMessage}</div> : null}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={isPending} className="gap-2"><Upload className="h-4 w-4" />{isPending ? "Subiendo..." : "Subir documento"}</Button>
        </div>
      </form>
    </ModalShell>
  )
}

export function AdminFolderManager({ folders, resources }: { folders: ResourceFolder[]; resources: ResourceView[] }) {
  const tree = useMemo(() => buildTree(folders), [folders])
  const [isTogglingPublished, startToggleTransition] = useTransition()
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(folders[0]?.id ?? null)
  const [contextTarget, setContextTarget] = useState<ContextTarget | null>(null)
  const [resourceContextTarget, setResourceContextTarget] = useState<ResourceContextTarget | null>(null)
  const [modalParent, setModalParent] = useState<ResourceFolder | null | "root" | null>(null)
  const [uploadTarget, setUploadTarget] = useState<ResourceFolder | null>(null)
  const [renameTarget, setRenameTarget] = useState<ResourceFolder | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ResourceFolder | null>(null)

  const selectedFolder = folders.find((folder) => folder.id === selectedFolderId) ?? null
  const { childFolders, currentResources: folderResources } = getFolderStats(selectedFolder?.id ?? null, folders, resources)
  const rootResources = resources.filter((resource) => !resource.folder_id)

  function openContextMenu(event: React.MouseEvent<HTMLElement>, folder: ResourceFolder | null) {
    event.preventDefault()
    event.stopPropagation()
    setContextTarget({ folder, x: event.clientX, y: event.clientY })
  }

  function closeContextMenu() {
    setContextTarget(null)
  }

  function openResourceContextMenu(event: React.MouseEvent<HTMLElement>, resource: ResourceView) {
    event.preventDefault()
    event.stopPropagation()
    setResourceContextTarget({ resource, x: event.clientX, y: event.clientY })
  }

  function closeResourceContextMenu() {
    setResourceContextTarget(null)
  }

  function openCreateModal(parent: ResourceFolder | null) {
    setModalParent(parent ?? "root")
    closeContextMenu()
  }

  function openUploadModal(folder: ResourceFolder | null) {
    if (!folder) return
    setUploadTarget(folder)
    closeContextMenu()
  }

  const currentTitle = selectedFolder ? selectedFolder.name : "Raiz"
  const currentDescription = selectedFolder
    ? selectedFolder.description ?? "Carpeta seleccionada en el explorador."
    : "Vista principal de la biblioteca. Aqui deberian vivir las carpetas grandes como Agua o Bosques."

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-sm shadow-black/5">
        <div className="border-b border-border/70 px-6 py-4">
          <h2 className="text-xl font-semibold text-foreground">Explorador de carpetas</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Doble clic para entrar. Clic secundario para acciones. Para subir archivos primero entra a una carpeta.
          </p>
        </div>

        <div className="grid min-h-[38rem] lg:grid-cols-[20rem_minmax(0,1fr)]">
          <aside className="border-r border-border/70 bg-background/70 p-4" onContextMenu={(event) => openContextMenu(event, null)}>
            <div className="mb-4 flex items-center justify-between gap-3 px-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <Folder className="h-4 w-4" />Jerarquia de carpetas
              </div>
              <Button type="button" size="sm" onClick={() => openCreateModal(null)} className="gap-2">
                <FolderPlus className="h-4 w-4" />
                Nueva carpeta raiz
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFolderId(null)}
              onDoubleClick={() => setSelectedFolderId(null)}
              onContextMenu={(event) => openContextMenu(event, null)}
              className={`mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${selectedFolderId === null ? "bg-primary/12 text-foreground" : "text-foreground hover:bg-secondary/60"}`}
            >
              <FolderOpen className="h-4 w-4 text-primary" />Raiz
            </button>
            {tree.length > 0 ? (
              <ul className="space-y-1">
                {tree.map((node) => (
                  <TreeBranch
                    key={node.id}
                    node={node}
                    selectedId={selectedFolderId}
                    onSelect={(folder) => setSelectedFolderId(folder.id)}
                    onOpen={(folder) => setSelectedFolderId(folder.id)}
                    onContextAction={openContextMenu}
                  />
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card/60 p-4 text-sm text-muted-foreground">No hay carpetas creadas todavia.</div>
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

            <div
              className="space-y-8 p-6"
              onContextMenu={(event) => openContextMenu(event, selectedFolder)}
            >
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Subcarpetas</h4>
                  <span className="text-xs text-muted-foreground">{childFolders.length}</span>
                </div>
                {childFolders.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {childFolders.map((folder) => (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => setSelectedFolderId(folder.id)}
                        onDoubleClick={() => setSelectedFolderId(folder.id)}
                        onContextMenu={(event) => openContextMenu(event, folder)}
                        className="rounded-2xl border border-border/60 bg-card/80 p-5 text-left transition-colors hover:bg-secondary/45"
                      >
                        <Folder className="h-6 w-6 text-primary" />
                        <p className="mt-4 text-sm font-semibold text-foreground">{folder.name}</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{folder.description ?? "Carpeta sin descripcion aun."}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">No hay subcarpetas en esta ubicacion.</div>
                )}
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Documentos</h4>
                  <span className="text-xs text-muted-foreground">{selectedFolder ? folderResources.length : rootResources.length}</span>
                </div>
                {(selectedFolder ? folderResources : rootResources).length > 0 ? (
                  <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-secondary/60 text-secondary-foreground">
                        <tr>
                          <th className="px-4 py-3 font-medium">Titulo</th>
                          <th className="px-4 py-3 font-medium">Archivo</th>
                          <th className="px-4 py-3 font-medium">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedFolder ? folderResources : rootResources).map((resource) => (
                          <tr key={resource.id} className="border-t border-border/60 hover:bg-secondary/30 cursor-context-menu transition-colors" onContextMenu={(event) => openResourceContextMenu(event, resource)}>
                            <td className="px-4 py-3 text-foreground">{resource.title}</td>
                            <td className="px-4 py-3 text-muted-foreground">{resource.file_name ?? "Sin archivo"}</td>
                            <td className="px-4 py-3 text-muted-foreground">{resource.is_published ? "Visible" : "Borrador"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
                    {selectedFolder ? "No hay documentos en esta ubicacion. Usa clic derecho para subir un archivo aqui." : "No hay documentos en la raiz."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {contextTarget ? (
        <>
          <button type="button" className="fixed inset-0 z-40 cursor-default" onClick={closeContextMenu} aria-label="Cerrar menu contextual" />
          <div className="fixed z-50 min-w-56 rounded-2xl border border-border/70 bg-background/95 p-2 shadow-2xl shadow-black/15 backdrop-blur" style={{ top: contextTarget.y, left: contextTarget.x }}>
            <button type="button" onClick={() => openCreateModal(contextTarget.folder)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"><FolderPlus className="h-4 w-4" />{contextTarget.folder ? `Nueva subcarpeta en ${contextTarget.folder.name}` : "Nueva carpeta raiz"}</button>
            {contextTarget.folder ? (
              <>
                <button type="button" onClick={() => openUploadModal(contextTarget.folder)} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"><Upload className="h-4 w-4" />Subir documento aqui</button>
                <button type="button" onClick={() => { setRenameTarget(contextTarget.folder); closeContextMenu() }} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"><FilePenLine className="h-4 w-4" />Renombrar carpeta</button>
                <button type="button" onClick={() => { setDeleteTarget(contextTarget.folder); closeContextMenu() }} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"><Trash2 className="h-4 w-4" />Eliminar carpeta</button>
              </>
            ) : null}
          </div>
        </>
      ) : null}

      {resourceContextTarget ? (
        <>
          <button type="button" className="fixed inset-0 z-40 cursor-default" onClick={closeResourceContextMenu} aria-label="Cerrar menu contextual de recurso" />
          <div className="fixed z-50 min-w-64 rounded-2xl border border-border/70 bg-background/95 p-2 shadow-2xl shadow-black/15 backdrop-blur" style={{ top: resourceContextTarget.y, left: resourceContextTarget.x }}>
            <button
              type="button"
              disabled={isTogglingPublished}
              onClick={() => {
                const formData = new FormData()
                formData.set("resource_id", resourceContextTarget.resource.id)
                formData.set("is_published", resourceContextTarget.resource.is_published ? "off" : "on")
                startToggleTransition(() => toggleResourcePublishedAction(formData))
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
            >
              {isTogglingPublished ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : resourceContextTarget.resource.is_published ? (
                <>
                  <div className="h-4 w-4 rounded-md border border-primary bg-primary" />
                  Ocultar al publico
                </>
              ) : (
                <>
                  <div className="h-4 w-4 rounded-md border border-border bg-background" />
                  Mostrar al publico
                </>
              )}
            </button>
          </div>
        </>
      ) : null}

      {modalParent !== null ? <CreateFolderModal parentFolder={modalParent === "root" ? null : modalParent} onClose={() => setModalParent(null)} /> : null}
      {uploadTarget ? <UploadModal folders={folders} targetFolder={uploadTarget} onClose={() => setUploadTarget(null)} /> : null}
      {renameTarget ? <RenameFolderModal folder={renameTarget} onClose={() => setRenameTarget(null)} /> : null}
      {deleteTarget ? <DeleteFolderModal folder={deleteTarget} onClose={() => setDeleteTarget(null)} /> : null}
    </>
  )
}
