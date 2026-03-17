"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FileText, CheckSquare, ArrowRight, Shield, Clock, Users } from "lucide-react"

const processSteps = [
  {
    number: "01",
    title: "Analisis Inicial",
    description: "Evaluamos su proyecto para determinar si requiere DIA o EIA segun la normativa vigente.",
  },
  {
    number: "02",
    title: "Elaboracion Tecnica",
    description: "Desarrollamos toda la documentacion tecnica requerida por el SEIA.",
  },
  {
    number: "03",
    title: "Tramitacion",
    description: "Gestionamos el proceso de evaluacion ante los organismos competentes.",
  },
  {
    number: "04",
    title: "Seguimiento",
    description: "Acompanamiento en las respuestas a observaciones y hasta la aprobacion final.",
  },
]

const benefits = [
  {
    icon: Shield,
    title: "Cumplimiento Normativo",
    description: "Garantizamos que su proyecto cumpla con todas las exigencias legales.",
  },
  {
    icon: Clock,
    title: "Optimizacion de Tiempos",
    description: "Experiencia que reduce los plazos de tramitacion.",
  },
  {
    icon: Users,
    title: "Equipo Especializado",
    description: "Profesionales con amplia experiencia en el SEIA.",
  },
]

export function ProjectManagementSection() {
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
    <section id="proyectos" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">
              Gestion de Proyectos
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6 text-balance">
              Declaraciones y Estudios de Impacto Ambiental
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              La gestion de proyectos ante el Sistema de Evaluacion de Impacto Ambiental (SEIA)
              es uno de nuestros servicios principales. Contamos con la experiencia y el conocimiento
              tecnico para guiar su proyecto desde la concepcion hasta la aprobacion.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Ya sea que su proyecto requiera una <strong>Declaracion de Impacto Ambiental (DIA)</strong> o
              un <strong>Estudio de Impacto Ambiental (EIA)</strong>, nuestro equipo le acompanara
              en cada etapa del proceso, asegurando el cumplimiento normativo y optimizando los tiempos de tramitacion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={scrollToVisits}
              >
                <FileText className="w-4 h-4" />
                Consultar por DIA
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/10"
                onClick={scrollToVisits}
              >
                <CheckSquare className="w-4 h-4" />
                Consultar por EIA
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/services-landscape.jpg"
                alt="Paisaje natural chileno"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-lg -z-10" />
          </div>
        </div>

        <div className="mb-20">
          <h3 className="font-serif text-2xl font-semibold text-foreground text-center mb-12">
            Nuestro Proceso de Trabajo
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="relative bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <span className="font-serif text-4xl font-bold text-primary/20">
                  {step.number}
                </span>
                <h4 className="font-semibold text-foreground mt-2 mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary/5 rounded-2xl p-8 lg:p-12">
          <h3 className="font-serif text-2xl font-semibold text-foreground text-center mb-8">
            Por que elegirnos para su proyecto
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  {benefit.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
