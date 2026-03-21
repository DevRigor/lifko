export type ResourceFolder = {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type ResourceItem = {
  id: string
  folder_id: string | null
  title: string
  slug: string
  summary: string | null
  file_path: string | null
  file_name: string | null
  mime_type: string | null
  file_size: number | null
  cover_image_path: string | null
  is_published: boolean
  published_at: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type ResourceView = ResourceItem & {
  access_url: string | null
}

export type ResourceFolderNode = ResourceFolder & {
  children: ResourceFolderNode[]
}

export type ResourceExplorerView = {
  currentFolder: ResourceFolder | null
  breadcrumbs: ResourceFolder[]
  childFolders: ResourceFolder[]
  resources: ResourceView[]
  rootFolders: ResourceFolder[]
}

export type ResourcesLibrary = {
  folders: ResourceFolder[]
  resources: ResourceView[]
  schemaReady: boolean
  errorMessage: string | null
}
