import { Leaf, Droplets, FileCheck, TreePine, ClipboardList, Map, ArrowRight } from "lucide-react"
import { ScrollLink } from "@/components/scroll-link"

const services = [
  {
    icon: Leaf,
    title: "Uso de Suelo",
    description:
      "Asesoria en cambios de uso de suelo, estudios de capacidad de uso y planificacion territorial acorde a la normativa vigente.",
    href: "#visitas-tecnicas" as const,
  },
  {
    icon: Droplets,
    title: "Calidad de Agua",
    description:
      "Gestion de derechos de aprovechamiento de aguas, estudios hidrogeologicos y cumplimiento de normativa hidrica.",
    href: "#visitas-tecnicas" as const,
  },
  {
    icon: FileCheck,
    title: "Gestion DIA-EIA",
    description:
      "Elaboracion y tramitacion de Declaraciones de Impacto Ambiental (DIA) y Estudios de Impacto Ambiental (EIA).",
    href: "#visitas-tecnicas" as const,
  },
  {
    icon: TreePine,
    title: "Proyectos de Restauracion",
    description:
      "Diseno e implementacion de planes de restauracion ecologica, recuperacion de ecosistemas y biodiversidad.",
    href: "#visitas-tecnicas" as const,
  },
  {
    icon: ClipboardList,
    title: "Planes de Mitigacion",
    description:
      "Elaboracion de planes integrales de mitigacion ambiental, monitoreo y seguimiento de compromisos ambientales.",
    href: "#visitas-tecnicas" as const,
  },
  {
    icon: Map,
    title: "Cartografia",
    description:
      "Elaboracion de mapas tematicos, analisis espacial con SIG, cartografia digital y levantamientos topograficos para proyectos ambientales.",
    href: "#visitas-tecnicas" as const,
  },
]

export function ServicesSection() {
  return (
    <section id="servicios" className="py-24 lg:py-32 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">
            Nuestros Servicios
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6 text-balance">
            Soluciones integrales para su proyecto ambiental
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Ofrecemos un portafolio completo de servicios de consultoria ambiental,
            adaptados a las necesidades especificas de cada proyecto y cliente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-lg p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {service.description}
              </p>
              <ScrollLink
                href={service.href}
                className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
              >
                Solicitar servicio
                <ArrowRight className="w-4 h-4" />
              </ScrollLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
