import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { SpiralLogo } from "@/components/spiral-logo"
import { Button } from "@/components/ui/button"

export function SiteHeader({
  ctaLabel,
  ctaHref,
  showAdminLink = false,
}: {
  ctaLabel?: string
  ctaHref?: string
  showAdminLink?: boolean
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <SpiralLogo className="h-11 w-11 transition-transform group-hover:scale-105" />
          <div>
            <p className="font-serif text-lg font-semibold tracking-tight text-foreground">LIFKO SPA</p>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Consultoria ambiental</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Inicio
          </Link>
          <Link href="/recursos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Recursos
          </Link>
          {showAdminLink ? (
            <Link href="/admin/recursos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle className="hover:bg-secondary" iconClassName="text-foreground" />
          {ctaLabel && ctaHref ? (
            <Button asChild className="hidden sm:inline-flex">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
