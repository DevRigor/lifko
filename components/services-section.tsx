import { FileText, BriefcaseBusiness, Map, Waves, ShieldCheck, GraduationCap, ArrowRight } from "lucide-react"
import { ScrollLink } from "@/components/scroll-link"

const services = [
  {
    icon: FileText,
    title: "Informes tecnicos",
    description:
      "Normativa ambiental vigente que regula estandares de los parametros bajo estudio.",
    href: "#visitas-tecnicas" as const,
  },
  {
    icon: BriefcaseBusiness,
    title: "Gestion de proyectos",
    description:
      "Diseno y ejecucion de estaciones de monitoreo o intervencion de mitigacion.",
    href: "#visitas-tecnicas" as const,
  },
  {
    icon: Map,
    title: "Cartografia hidro-geo-sociologica",
    description:
      "Uso de SIG con herramientas como QGIS, QSWAT, Redatam y Python para analisis territorial.",
    href: "#visitas-tecnicas" as const,
  },
  {
    icon: Waves,
    title: "Monitoreo de parametros biofisicoquimicos",
    description:
      "Seguimiento segun intereses del cliente o proyecto, con comparaciones en el tiempo.",
    href: "#visitas-tecnicas" as const,
  },
  {
    icon: ShieldCheck,
    title: "Planes de Mitigacion",
    description:
      "Rehabilitacion de riberas degradadas, humedales contaminados y zonas con especies exoticas invasoras.",
    href: "#visitas-tecnicas" as const,
  },
  {
    icon: GraduationCap,
    title: "Capacitaciones y educacion",
    description:
      "Jornadas teorico-practicas para fortalecer conocimientos sobre normativa legal y metodologias cientificas.",
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
              className="group bg-card rounded-xl p-8 shadow-[0_4px_20px_rgba(21,28,34,0.05)] hover:shadow-[0_12px_40px_rgba(21,28,34,0.10)] hover:border-l-4 hover:border-l-accent hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-accent/20"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/15 transition-colors duration-300">
                <service.icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors duration-300" />
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
