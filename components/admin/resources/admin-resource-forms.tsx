import { AdminFolderManager } from "@/components/admin/resources/admin-folder-manager"
import type { ResourceFolder, ResourceView } from "@/types/resources"

export function AdminResourceForms({
  folders,
  resources,
}: {
  folders: ResourceFolder[]
  resources: ResourceView[]
}) {
  return <AdminFolderManager folders={folders} resources={resources} />
}
