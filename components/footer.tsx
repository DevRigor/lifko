import Link from "next/link"
import { SpiralLogo } from "@/components/spiral-logo"
import { ScrollLink } from "@/components/scroll-link"

const sectionLinks = [
  { href: "#inicio" as const, label: "Inicio" },
  { href: "#nosotros" as const, label: "ODS" },
  { href: "#servicios" as const, label: "Servicios" },
  { href: "#visitas-tecnicas" as const, label: "Visitas Tecnicas" },
  { href: "#contacto" as const, label: "Informacion Personal" },
]

const routeLinks = [{ href: "/recursos", label: "Recursos" }]

const services = [
  "Informes tecnicos",
  "Gestion de proyectos",
  "Cartografia hidro-geo-sociologica",
  "Monitoreo biofisicoquimico",
  "Planes de Mitigacion",
  "Capacitaciones y educacion",
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <ScrollLink href="#inicio" className="flex items-center gap-2 mb-4">
              <SpiralLogo className="w-10 h-10" />
              <span className="font-serif text-xl font-semibold tracking-tight">
                LIFKO SPA
              </span>
            </ScrollLink>
            <p className="text-background/85 text-sm leading-relaxed">
              SERVICIOS PROFESIONALES DE INGENIERIA Y ACTIVIDADES CONEXAS DE
              CONSULTORIA TECNICA 711003-SSI.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Navegacion</h4>
            <ul className="space-y-2">
              {sectionLinks.map((link) => (
                <li key={link.href}>
                  <ScrollLink
                    href={link.href}
                    className="text-background/85 hover:text-background text-sm transition-colors"
                  >
                    {link.label}
                  </ScrollLink>
                </li>
              ))}
              {routeLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/85 hover:text-background text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Servicios</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-background/85 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Informacion</h4>
            <ul className="space-y-2 text-sm text-background/85">
              <li>
                <a
                  href="mailto:ingrrnn.correaj@gmail.com"
                  className="hover:text-background transition-colors"
                >
                  ingrrnn.correaj@gmail.com
                </a>
              </li>
              <li>Chile</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-background/75 text-sm">
              {new Date().getFullYear()} LIFKO SPA. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-background/75">
              <span>Politica de Privacidad</span>
              <span>Terminos de Servicio</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
