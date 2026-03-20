const cdnBaseUrl = process.env.NEXT_PUBLIC_CDN_BASE_URL?.replace(/\/+$/, "") ?? ""

export function assetUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path
  if (!cdnBaseUrl) return path

  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const blobPath = normalizedPath.startsWith("/images/")
    ? normalizedPath.replace("/images/", "/")
    : normalizedPath
  return `${cdnBaseUrl}${blobPath}`
}

export { cdnBaseUrl }
