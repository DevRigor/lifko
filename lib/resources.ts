import { cache } from "react"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  isStoragePath,
  RESOURCE_BUCKET,
  RESOURCE_SIGNED_URL_TTL_SECONDS,
} from "@/lib/resource-storage"
import type {
  ResourceExplorerView,
  ResourceFolder,
  ResourceItem,
  ResourcesLibrary,
  ResourceView,
} from "@/types/resources"

const folderSelect =
  "id, name, slug, description, parent_id, sort_order, is_published, created_at, updated_at"
const resourceSelect =
  "id, folder_id, title, slug, summary, file_path, file_name, mime_type, file_size, cover_image_path, is_published, published_at, sort_order, created_at, updated_at"

function isMissingRelationError(message: string) {
  return (
    message.includes("relation") ||
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("Could not find")
  )
}

async function withAccessUrls(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  resources: ResourceItem[]
) {
  const resolved = await Promise.all(
    resources.map(async (resource): Promise<ResourceView> => {
      if (!resource.file_path) {
        return {
          ...resource,
          access_url: null,
        }
      }

      if (!isStoragePath(resource.file_path)) {
        return {
          ...resource,
          access_url: resource.file_path,
        }
      }

      const { data, error } = await supabase.storage
        .from(RESOURCE_BUCKET)
        .createSignedUrl(resource.file_path, RESOURCE_SIGNED_URL_TTL_SECONDS)

      return {
        ...resource,
        access_url: error ? null : data.signedUrl,
      }
    })
  )

  return resolved
}

export function buildResourceExplorerView(
  library: ResourcesLibrary,
  activeFolderSlug?: string | null
): ResourceExplorerView {
  const rootFolders = library.folders.filter((folder) => !folder.parent_id)

  if (!activeFolderSlug) {
    return {
      currentFolder: null,
      breadcrumbs: [],
      childFolders: rootFolders,
      resources: library.resources.filter((resource) => !resource.folder_id),
      rootFolders,
    }
  }

  const currentFolder = library.folders.find((folder) => folder.slug === activeFolderSlug) ?? null

  if (!currentFolder) {
    return {
      currentFolder: null,
      breadcrumbs: [],
      childFolders: rootFolders,
      resources: library.resources.filter((resource) => !resource.folder_id),
      rootFolders,
    }
  }

  const foldersById = new Map(library.folders.map((folder) => [folder.id, folder]))
  const breadcrumbs: ResourceFolder[] = []

  let cursor: ResourceFolder | null = currentFolder
  while (cursor) {
    breadcrumbs.unshift(cursor)
    cursor = cursor.parent_id ? (foldersById.get(cursor.parent_id) ?? null) : null
  }

  return {
    currentFolder,
    breadcrumbs,
    childFolders: library.folders.filter((folder) => folder.parent_id === currentFolder.id),
    resources: library.resources.filter((resource) => resource.folder_id === currentFolder.id),
    rootFolders,
  }
}

export const getPublishedResourcesLibrary = cache(async (): Promise<ResourcesLibrary> => {
  const supabase = await createSupabaseServerClient()

  const [foldersResult, resourcesResult] = await Promise.all([
    supabase
      .from("resource_folders")
      .select(folderSelect)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("resources")
      .select(resourceSelect)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true }),
  ])

  const firstError = foldersResult.error ?? resourcesResult.error

  if (firstError) {
    if (isMissingRelationError(firstError.message)) {
      return {
        folders: [],
        resources: [],
        schemaReady: false,
        errorMessage: "Falta crear las tablas base de recursos en Supabase.",
      }
    }

    return {
      folders: [],
      resources: [],
      schemaReady: true,
      errorMessage: firstError.message,
    }
  }

  return {
    folders: (foldersResult.data ?? []) as ResourceFolder[],
    resources: await withAccessUrls(supabase, (resourcesResult.data ?? []) as ResourceItem[]),
    schemaReady: true,
    errorMessage: null,
  }
})

export const getAdminResourcesLibrary = cache(async (): Promise<ResourcesLibrary> => {
  const supabase = await createSupabaseServerClient()

  const [foldersResult, resourcesResult] = await Promise.all([
    supabase
      .from("resource_folders")
      .select(folderSelect)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("resources")
      .select(resourceSelect)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true }),
  ])

  const firstError = foldersResult.error ?? resourcesResult.error

  if (firstError) {
    if (isMissingRelationError(firstError.message)) {
      return {
        folders: [],
        resources: [],
        schemaReady: false,
        errorMessage: "Falta crear las tablas base de recursos en Supabase.",
      }
    }

    return {
      folders: [],
      resources: [],
      schemaReady: true,
      errorMessage: firstError.message,
    }
  }

  return {
    folders: (foldersResult.data ?? []) as ResourceFolder[],
    resources: await withAccessUrls(supabase, (resourcesResult.data ?? []) as ResourceItem[]),
    schemaReady: true,
    errorMessage: null,
  }
})
