import Image from "next/image"
import { ArrowRight, Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollLink } from "@/components/scroll-link"
import { assetUrl } from "@/lib/assets"

export function HeroSection() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={assetUrl("/images/FONDO.PNG")}
          alt="Rio chileno en naturaleza pristina"
          fill
          sizes="100vw"
          quality={70}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/80 mb-8 font-semibold">
            Analisis de Calidad de Agua · Chile
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-white leading-[1.05] mb-8">
            Compromiso con el medio ambiente y su proyecto
          </h1>

          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-12 leading-relaxed">
            En LIFKO SpA buscamos mejorar la calidad de vida de los ecosistemas dulceacuicolas.
            Asesoramos a empresas y organizaciones que necesitan conocer el estado de la calidad
            del agua para su uso o consumo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-base font-semibold shadow-[0_8px_32px_rgba(0,94,162,0.35)] hover:shadow-[0_12px_40px_rgba(0,94,162,0.45)] transition-all duration-300"
            >
              <ScrollLink href="#visitas-tecnicas" className="flex items-center gap-2">
                Solicitar Asesoria
                <ArrowRight className="w-4 h-4" />
              </ScrollLink>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white px-10 py-6 text-base font-semibold backdrop-blur-sm"
            >
              <ScrollLink href="#servicios" className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Conocer Servicios
              </ScrollLink>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-semibold">Descubrir</span>
          <div className="w-5 h-8 border border-white/40 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-0.5 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
