import Link from "next/link"
import { Menu } from "lucide-react"
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
  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/recursos", label: "Recursos" },
    ...(showAdminLink ? [{ href: "/admin/recursos", label: "Admin" }] : []),
  ]

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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <details className="group relative md:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground transition-colors hover:bg-secondary [&::-webkit-details-marker]:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </summary>

            <div className="absolute right-0 top-[calc(100%+0.75rem)] w-64 overflow-hidden rounded-2xl border border-border/70 bg-background/95 p-3 shadow-xl shadow-black/10">
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/70"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {ctaLabel && ctaHref ? (
                <div className="mt-3 border-t border-border/70 pt-3">
                  <Button asChild className="w-full">
                    <Link href={ctaHref}>{ctaLabel}</Link>
                  </Button>
                </div>
              ) : null}
            </div>
          </details>
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
