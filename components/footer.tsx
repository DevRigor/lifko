import Link from "next/link"
import { SpiralLogo } from "@/components/spiral-logo"

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#visitas-tecnicas", label: "Visitas Técnicas" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#contacto", label: "Contacto" },
]

const services = [
  "Uso de Suelo",
  "Calidad de Agua",
  "Gestión DIA-EIA",
  "Restauración Ambiental",
  "Planes de Mitigación",
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="#inicio" className="flex items-center gap-2 mb-4">
              <SpiralLogo className="w-10 h-10" />
              <span className="font-serif text-xl font-semibold tracking-tight">
                LIFKO SPA
              </span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Consultoría ambiental profesional comprometida con el desarrollo sustentable 
              y la protección del medio ambiente en Chile.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-background mb-4">Navegación</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-background text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-background mb-4">Servicios</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-background/70 text-sm">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-background/70">
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

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-background/50 text-sm">
              © {new Date().getFullYear()} LIFKO SPA. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-background/50">
              <Link href="#" className="hover:text-background transition-colors">
                Política de Privacidad
              </Link>
              <Link href="#" className="hover:text-background transition-colors">
                Términos de Servicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
