import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Droplets } from "lucide-react"

export function HeroSection() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-river.jpg"
          alt="Río chileno en naturaleza prístina"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm sm:text-base uppercase tracking-[0.2em] text-white/80 mb-6 font-medium">
            Consultoría Ambiental Profesional
          </p>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-8 text-balance">
            Compromiso con el medio ambiente y su proyecto
          </h1>
          
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed text-pretty">
            En LIFKO SPA acompañamos a empresas y organizaciones en el desarrollo de proyectos 
            sustentables, ofreciendo asesoría técnica especializada en normativa ambiental, 
            uso de suelo, gestión de aguas y evaluación de impacto ambiental.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-medium"
            >
              <Link href="#visitas-tecnicas" className="flex items-center gap-2">
                Solicitar Asesoría
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white px-8 py-6 text-base font-medium backdrop-blur-sm"
            >
              <Link href="#servicios" className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Conocer Servicios
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/70 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
