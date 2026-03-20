import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://www.lifkospa.cl/sitemap.xml',
    host: 'https://www.lifkospa.cl',
  }
}
