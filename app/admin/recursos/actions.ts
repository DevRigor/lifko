"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { slugifyResourceValue } from "@/lib/resource-storage"

async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    throw new Error("Debes iniciar sesion para gestionar recursos.")
  }

  const { data: isAdmin, error } = await supabase.rpc("is_resource_admin")

  if (error || !isAdmin) {
    throw new Error("Tu usuario no tiene permisos administrativos.")
  }

  return supabase
}

function fail(message: string) {
  redirect(`/admin/recursos?error=${encodeURIComponent(message)}`)
}

function ok(message: string) {
  redirect(`/admin/recursos?success=${encodeURIComponent(message)}`)
}

function refreshAdminPaths() {
  revalidatePath("/recursos")
  revalidatePath("/admin/recursos")
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}

export async function createFolderAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const parentId = String(formData.get("parent_id") ?? "").trim() || null
  const sortOrder = Number(String(formData.get("sort_order") ?? "0").trim() || 0)

  if (!name) {
    fail("La carpeta necesita un nombre.")
  }

  const slug = slugifyResourceValue(name)

  if (!slug) {
    fail("No se pudo generar un identificador valido para la carpeta.")
  }

  const supabase = await requireAdmin()
  const { error } = await supabase.from("resource_folders").insert({
    name,
    slug,
    description: description || null,
    parent_id: parentId,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    is_published: true,
  })

  if (error) {
    fail("No se pudo crear la carpeta.")
  }

  refreshAdminPaths()
  ok("Carpeta creada correctamente.")
}

export async function renameFolderAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()

  if (!id || !name) {
    fail("Faltan datos para renombrar la carpeta.")
  }

  const slug = slugifyResourceValue(name)
  if (!slug) {
    fail("No se pudo generar un identificador valido para la carpeta.")
  }

  const supabase = await requireAdmin()
  const { error } = await supabase
    .from("resource_folders")
    .update({ name, slug, description: description || null })
    .eq("id", id)

  if (error) {
    fail("No se pudo actualizar la carpeta.")
  }

  refreshAdminPaths()
  ok("Carpeta actualizada correctamente.")
}

export async function deleteFolderAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim()

  if (!id) {
    fail("Falta identificar la carpeta a eliminar.")
  }

  const supabase = await requireAdmin()

  const [{ count: childrenCount, error: childError }, { count: resourceCount, error: resourceError }] =
    await Promise.all([
      supabase.from("resource_folders").select("id", { count: "exact", head: true }).eq("parent_id", id),
      supabase.from("resources").select("id", { count: "exact", head: true }).eq("folder_id", id),
    ])

  if (childError || resourceError) {
    fail("No se pudo validar si la carpeta esta vacia.")
  }

  if ((childrenCount ?? 0) > 0 || (resourceCount ?? 0) > 0) {
    fail("Solo puedes eliminar carpetas vacias, sin subcarpetas ni documentos.")
  }

  const { error } = await supabase.from("resource_folders").delete().eq("id", id)

  if (error) {
    fail("No se pudo eliminar la carpeta.")
  }

  refreshAdminPaths()
  ok("Carpeta eliminada correctamente.")
}

export async function createResourceAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim()
  const summary = String(formData.get("summary") ?? "").trim()
  const folderId = String(formData.get("folder_id") ?? "").trim() || null
  const filePath = String(formData.get("file_path") ?? "").trim()
  const fileName = String(formData.get("file_name") ?? "").trim()
  const mimeType = String(formData.get("mime_type") ?? "").trim()
  const fileSizeRaw = String(formData.get("file_size") ?? "").trim()
  const sortOrder = Number(String(formData.get("sort_order") ?? "0").trim() || 0)
  const isPublished = formData.get("is_published") === "on"

  if (!title) {
    fail("El recurso necesita un titulo.")
  }

  if (!filePath) {
    fail("El recurso necesita un archivo cargado.")
  }

  const slugInput = String(formData.get("slug") ?? "").trim()
  const slug = slugifyResourceValue(slugInput || title)

  if (!slug) {
    fail("No se pudo generar un identificador valido para el recurso.")
  }

  const fileSize = fileSizeRaw ? Number(fileSizeRaw) : null
  if (fileSizeRaw && !Number.isFinite(fileSize)) {
    fail("El tamano del archivo debe ser numerico.")
  }

  const supabase = await requireAdmin()
  const { error } = await supabase.from("resources").insert({
    folder_id: folderId,
    title,
    slug,
    summary: summary || null,
    file_path: filePath,
    file_name: fileName || null,
    mime_type: mimeType || null,
    file_size: fileSize,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  })

  if (error) {
    fail("No se pudo crear el recurso.")
  }

  refreshAdminPaths()
  ok("Recurso creado correctamente.")
}

export async function toggleResourcePublishedAction(formData: FormData) {
  const resourceId = String(formData.get("resource_id") ?? "").trim()
  const isPublished = formData.get("is_published") === "on"

  if (!resourceId) {
    fail("Falta identificar el recurso.")
  }

  const supabase = await requireAdmin()
  const { error } = await supabase
    .from("resources")
    .update({
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })
    .eq("id", resourceId)

  if (error) {
    fail("No se pudo actualizar el estado del recurso.")
  }

  refreshAdminPaths()
  ok(isPublished ? "Recurso publicado correctamente." : "Recurso ocultado correctamente.")
}
