"use client"

import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { Car, ChevronLeft, ChevronRight, Linkedin, Mail, UserRound } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

const courseImages = [
  {
    src: "/images/Cursos, Certificaciones e Investigaciones. Mapuzuguletuai\u00F1A1.2..png",
    alt: "Certificacion Mapuzuguletuain",
    label: "Mapudugun A.2",
  },
  {
    src: "/images/Cursos, Certificaciones e Investigaciones_XLI-Congreso..png",
    alt: "XLI Congreso Nacional de Entomologia",
    label: "XLI Congreso Nacional de Entomologia",
  },
  {
    src: "/images/Cursos, Certificaciones e Investigaciones_XLII-Congreso.png",
    alt: "XLII Congreso Nacional de Entomologia",
    label: "XLII Congreso Nacional de Entomologia",
  },
]

export function ContactSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    containScroll: false,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi])

  return (
    <section id="contacto" className="py-24 lg:py-32 bg-secondary overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">
            Informacion Personal
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6 text-balance">
            Trayectoria, credenciales y respaldo profesional
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Presentacion profesional, antecedentes tecnicos y material de respaldo para evaluar
            colaboraciones, asesorias y proyectos ambientales.
          </p>
        </div>

        <div className="grid xl:grid-cols-[minmax(0,0.98fr)_minmax(0,1.22fr)] gap-8 xl:gap-12 items-stretch">
          <aside className="h-full rounded-[2rem] border border-border bg-card p-6 sm:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="pb-6 border-b border-border/70">
              <div className="relative overflow-hidden rounded-[1.9rem] border border-border bg-background shadow-sm mb-5">
                <div className="relative aspect-[5/4] w-full">
                  <Image
                    src="/images/Foto_arbol.jpeg"
                    alt="Entorno natural asociado al enfoque ambiental de LIFKO"
                    fill
                    sizes="(max-width: 1280px) 100vw, 32vw"
                    className="object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/75 font-semibold mb-2">
                    Perfil
                  </p>
                  <h3 className="font-serif text-2xl font-semibold text-white mb-2">LIFKO SpA</h3>
                  <p className="max-w-md text-sm leading-relaxed text-white/90">
                    Analisis de calidad de agua, asesoria ambiental y acompanamiento tecnico
                    para proyectos con enfoque territorial.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="h-full rounded-2xl border border-border/60 bg-secondary/70 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12">
                      <UserRound className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-1">
                        Especialidad
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Monitoreo, analisis y asesoria ambiental aplicada.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-full rounded-2xl border border-border/60 bg-secondary/70 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-1">
                        Correo
                      </p>
                      <a
                        href="mailto:ingrrnn.correaj@gmail.com"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                      >
                        ingrrnn.correaj@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="h-full rounded-2xl border border-border/60 bg-secondary/70 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12">
                      <Linkedin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-1">
                        LinkedIn
                      </p>
                      <a
                        href="https://www.linkedin.com/in/javiera-c-correa-a-65a231349/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        Ver perfil profesional
                      </a>
                    </div>
                  </div>
                </div>

                <div className="h-full rounded-2xl border border-border/60 bg-secondary/70 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-primary font-semibold mb-1">
                        Licencia Clase B
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Esconsur Temuco
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="h-full rounded-[2rem] border border-border bg-card px-4 py-6 sm:px-6 sm:py-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-primary font-semibold mb-2">
                  Respaldo Visual
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
                  Certificados e investigaciones
                </h3>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  Carrusel de documentos con foco en la lamina principal para mejorar lectura y jerarquia visual.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={scrollPrev}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:border-primary hover:text-primary"
                  aria-label="Ver certificado anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:border-primary hover:text-primary"
                  aria-label="Ver siguiente certificado"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border/70 bg-secondary/35 px-2 py-4 sm:px-3 sm:py-5">
              <div className="mx-auto w-full max-w-[48rem] overflow-hidden" ref={emblaRef}>
                <div className="flex items-center -mx-1 sm:-mx-2">
                {courseImages.map((image, index) => {
                  const isActive = index === selectedIndex

                  return (
                    <div
                      key={image.src}
                      className="min-w-0 flex-[0_0_88%] sm:flex-[0_0_78%] lg:flex-[0_0_68%] xl:flex-[0_0_64%] px-1 sm:px-2"
                    >
                      <article
                        className={`transition-all duration-500 ${
                          isActive
                            ? "scale-100 opacity-100 blur-0"
                            : "scale-[0.88] opacity-45 blur-[1.5px]"
                        }`}
                      >
                        <div className="overflow-hidden rounded-[1.75rem] border border-border bg-background shadow-[0_22px_60px_rgba(15,23,42,0.10)]">
                          <div className="relative aspect-[4/5] w-full bg-muted/40">
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 55vw, 36vw"
                              className="object-contain p-4"
                            />
                          </div>
                          <div className="border-t border-border bg-card px-5 py-4">
                            <p className="text-sm uppercase tracking-[0.18em] text-primary font-semibold mb-1">
                              Documento {index + 1}
                            </p>
                            <p className="font-medium text-foreground">{image.label}</p>
                          </div>
                        </div>
                      </article>
                    </div>
                  )
                })}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2">
              {courseImages.map((image, index) => (
                <button
                  key={image.label}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Ir al documento ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    index === selectedIndex ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
