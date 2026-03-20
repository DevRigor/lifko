import type { Metadata } from 'next'
import type { Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { assetUrl } from '@/lib/assets'
import './globals.css'

const siteUrl = 'https://www.lifkospa.cl'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'LIFKO SPA | Analisis de Calidad de Agua en Chile',
    template: '%s | LIFKO SPA',
  },
  description:
    'Analisis de calidad de agua, monitoreo biofisicoquimico, cartografia hidro-geo-sociologica y asesoria ambiental para proyectos, empresas y organizaciones en Chile.',
  keywords: [
    'calidad de agua',
    'analisis de calidad de agua',
    'monitoreo ambiental',
    'asesoria ambiental',
    'cartografia hidrogeologica',
    'cartografia hidro-geo-sociologica',
    'mitigacion ambiental',
    'consultoria ambiental',
    'Chile',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: siteUrl,
    siteName: 'LIFKO SPA',
    title: 'LIFKO SPA | Analisis de Calidad de Agua en Chile',
    description:
      'Consultoria ambiental especializada en calidad de agua, monitoreo biofisicoquimico y cartografia para proyectos en Chile.',
    images: [
      {
        url: assetUrl('/images/FONDO.PNG'),
        width: 1200,
        height: 630,
        alt: 'LIFKO SPA consultoria ambiental y analisis de calidad de agua',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LIFKO SPA | Analisis de Calidad de Agua en Chile',
    description:
      'Consultoria ambiental especializada en calidad de agua, monitoreo biofisicoquimico y cartografia para proyectos en Chile.',
    images: [assetUrl('/images/FONDO.PNG')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'environmental consulting',
  icons: {
    icon: [
      {
        url: assetUrl('/Logo.svg'),
        type: 'image/svg+xml',
      },
    ],
    apple: assetUrl('/Logo.svg'),
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2f8fcc',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
