import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'LIFKO SPA | Analisis de Calidad de Agua',
  description:
    'Analisis de calidad de agua, monitoreo biofisicoquimico, cartografia hidro-geo-sociologica y asesoria ambiental para proyectos en Chile.',
  keywords: ['calidad de agua', 'monitoreo ambiental', 'cartografia', 'mitigacion ambiental', 'asesoria ambiental', 'Chile'],
  icons: {
    icon: [
      {
        url: '/Logo.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/Logo.svg',
  },
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
