"use client"

import { Video, BookOpen, Clock, MessageCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Video,
    title: "Orientacion Tecnica Remota",
    description: "Sesiones de asesoria online para resolver dudas tecnicas y orientar su proyecto ambiental.",
  },
  {
    icon: MessageCircle,
    title: "Acompanamiento Profesional",
    description: "Apoyo continuo durante todo el proceso de evaluacion y tramitacion ambiental.",
  },
  {
    icon: Clock,
    title: "Flexibilidad Horaria",
    description: "Adaptamos nuestros horarios a su disponibilidad para facilitar la comunicacion.",
  },
  {
    icon: BookOpen,
    title: "Contenidos Especializados",
    description: "Acceso a material tecnico y guias para entender mejor la normativa ambiental.",
  },
]

export function OnlineAdvisorySection() {
  const scrollToVisits = () => {
    const section = document.querySelector("#visitas-tecnicas")
    if (!(section instanceof HTMLElement)) return

    const headerOffset = 96
    const sectionTop = section.getBoundingClientRect().top + window.scrollY - headerOffset

    window.history.replaceState(null, "", "#visitas-tecnicas")
    window.scrollTo({
      top: sectionTop,
      behavior: "smooth",
    })
  }

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
              Ofrecemos asesorias remotas para acompanar su proyecto ambiental sin importar
              su ubicacion geografica. Nuestro equipo de expertos esta disponible para brindarle
              orientacion tecnica, resolver consultas y guiarlo en cada etapa del proceso.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Proximamente estaremos incorporando cursos y contenidos grabados para que pueda
              capacitarse en temas de normativa ambiental a su propio ritmo.
            </p>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={scrollToVisits}
            >
              Agendar Asesoria Online
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

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
