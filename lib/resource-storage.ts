export const RESOURCE_BUCKET = "resources"
export const RESOURCE_MAX_UPLOAD_BYTES = 6 * 1024 * 1024
export const RESOURCE_SIGNED_URL_TTL_SECONDS = 60 * 60
export const RESOURCE_ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const

export function slugifyResourceValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function sanitizeStorageFileName(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf(".")
  const hasExtension = lastDotIndex > 0 && lastDotIndex < fileName.length - 1
  const extension = hasExtension ? fileName.slice(lastDotIndex + 1).toLowerCase() : "bin"
  const baseName = hasExtension ? fileName.slice(0, lastDotIndex) : fileName
  const safeBase = slugifyResourceValue(baseName) || "archivo"
  const safeExtension = extension.replace(/[^a-z0-9]+/g, "") || "bin"

  return `${safeBase}.${safeExtension}`
}

export function buildResourceStoragePath(folderSlug: string | null, fileName: string) {
  const safeFileName = sanitizeStorageFileName(fileName)
  const safeFolder = folderSlug ? slugifyResourceValue(folderSlug) : "sin-carpeta"
  return `folders/${safeFolder}/${crypto.randomUUID()}-${safeFileName}`
}

export function isStoragePath(value: string | null) {
  return Boolean(value && !/^https?:\/\//i.test(value))
}
