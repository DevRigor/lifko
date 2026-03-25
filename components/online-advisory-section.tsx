import { Video, BookOpen, Languages, MessageCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollLink } from "@/components/scroll-link"

const features = [
  {
    icon: Video,
    title: "Orientacion tecnica remota",
    description: "Sesiones online para orientar proyectos medioambientales desde cualquier lugar.",
  },
  {
    icon: MessageCircle,
    title: "Acompanamiento profesional",
    description: "Apoyo remoto para resolver consultas y ordenar decisiones tecnicas del proyecto.",
  },
  {
    icon: Languages,
    title: "Enfoque trilingue",
    description: "Trabajo en espanol e ingles, fortaleciendo tambien el Mapudungun en contextos rurales.",
  },
  {
    icon: BookOpen,
    title: "Cursos e infografias",
    description: "Proximamente se compartiran cursos grabados e infografias trilingues sobre ecologia y economia.",
  },
]

export function OnlineAdvisorySection() {
  return (
    <section id="asesorias-online" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">
              Asesorias Online
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6 text-balance">
              Orientacion profesional desde cualquier lugar
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Ofrecemos asesorias remotas para orientar proyectos medioambientales, sin importar
              su ubicacion geografica. Nuestro equipo contempla el uso de idiomas como espanol
              e ingles, fortaleciendo Mapudungun como lengua nativa del sur de Chile.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Proximamente se compartiran cursos grabados e infografias trilingues que explican
              procesos complejos de ecologia y economia, junto con soluciones frente al dano ambiental.
            </p>

            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <ScrollLink href="#visitas-tecnicas" className="inline-flex items-center gap-2">
                Agendar Asesoria Online
                <ArrowRight className="w-4 h-4" />
              </ScrollLink>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-secondary rounded-xl p-6 shadow-[0_2px_12px_rgba(21,28,34,0.05)] hover:shadow-[0_8px_28px_rgba(21,28,34,0.09)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
