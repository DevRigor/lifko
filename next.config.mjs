const cdnBaseUrl = process.env.NEXT_PUBLIC_CDN_BASE_URL

const remotePatterns = []

if (cdnBaseUrl) {
  const url = new URL(cdnBaseUrl)
  remotePatterns.push({
    protocol: url.protocol.replace(":", ""),
    hostname: url.hostname,
    port: url.port,
    pathname: `${url.pathname.replace(/\/$/, "") || ""}/**`,
  })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [68, 70, 72, 75],
    remotePatterns,
  },
}

export default nextConfig
