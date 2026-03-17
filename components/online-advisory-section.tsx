import { Video, BookOpen, Clock, MessageCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Video,
    title: "Orientación Técnica Remota",
    description: "Sesiones de asesoría online para resolver dudas técnicas y orientar su proyecto ambiental.",
  },
  {
    icon: MessageCircle,
    title: "Acompañamiento Profesional",
    description: "Apoyo continuo durante todo el proceso de evaluación y tramitación ambiental.",
  },
  {
    icon: Clock,
    title: "Flexibilidad Horaria",
    description: "Adaptamos nuestros horarios a su disponibilidad para facilitar la comunicación.",
  },
  {
    icon: BookOpen,
    title: "Contenidos Especializados",
    description: "Acceso a material técnico y guías para entender mejor la normativa ambiental.",
  },
]

export function OnlineAdvisorySection() {
  return (
    <section id="asesorias-online" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Side */}
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">
              Asesorías Online
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6 text-balance">
              Orientación profesional desde cualquier lugar
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Ofrecemos asesorías remotas para acompañar su proyecto ambiental sin importar 
              su ubicación geográfica. Nuestro equipo de expertos está disponible para brindarle 
              orientación técnica, resolver consultas y guiarlo en cada etapa del proceso.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Próximamente estaremos incorporando cursos y contenidos grabados para que pueda 
              capacitarse en temas de normativa ambiental a su propio ritmo.
            </p>

            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="#visitas-tecnicas" className="flex items-center gap-2">
                Agendar Asesoría Online
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-secondary border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
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
