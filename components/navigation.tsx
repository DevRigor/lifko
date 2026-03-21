"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SpiralLogo } from "@/components/spiral-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScrollLink } from "@/components/scroll-link"

const sectionLinks = [
  { href: "#inicio" as const, label: "Inicio" },
  { href: "#nosotros" as const, label: "ODS" },
  { href: "#servicios" as const, label: "Servicios" },
  { href: "#visitas-tecnicas" as const, label: "Visitas Tecnicas" },
  { href: "#contacto" as const, label: "Informacion Personal" },
]

const routeLinks = [{ href: "/recursos", label: "Recursos" }]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const textClass = isScrolled ? "text-foreground" : "text-white"
  const linkClass = isScrolled ? "text-foreground" : "text-white"
  const toggleClass = isScrolled ? "hover:bg-secondary" : "hover:bg-white/10"
  const toggleIconClass = isScrolled ? "text-foreground" : "text-white"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <ScrollLink href="#inicio" className="flex items-center gap-2 group">
            <SpiralLogo className="w-10 h-10 transition-transform group-hover:scale-105" />
            <span className={`font-serif text-xl font-semibold tracking-tight ${textClass}`}>
              LIFKO SPA
            </span>
          </ScrollLink>

          <div className="hidden lg:flex items-center gap-6">
            {sectionLinks.map((link) => (
              <ScrollLink
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${linkClass}`}
              >
                {link.label}
              </ScrollLink>
            ))}
            {routeLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${linkClass}`}
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle className={toggleClass} iconClassName={toggleIconClass} />
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <ScrollLink href="#visitas-tecnicas">Solicitar Asesoria</ScrollLink>
            </Button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle className={toggleClass} iconClassName={toggleIconClass} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md transition-colors ${toggleClass}`}
              aria-label={isOpen ? "Cerrar menu de navegacion" : "Abrir menu de navegacion"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? (
                <X className={`w-6 h-6 ${textClass}`} />
              ) : (
                <Menu className={`w-6 h-6 ${textClass}`} />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div
            id="mobile-navigation"
            className="lg:hidden absolute top-20 left-0 right-0 bg-background border-b border-border shadow-lg"
          >
            <div className="flex flex-col py-4 px-4 gap-2">
              {sectionLinks.map((link) => (
                <ScrollLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-foreground hover:text-primary hover:bg-secondary px-4 py-3 rounded-md transition-colors"
                >
                  {link.label}
                </ScrollLink>
              ))}
              {routeLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-foreground hover:text-primary hover:bg-secondary px-4 py-3 rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <ScrollLink href="#visitas-tecnicas" onClick={() => setIsOpen(false)}>
                  Solicitar Asesoria
                </ScrollLink>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
