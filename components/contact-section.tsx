"use client"

import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { Car, Linkedin, Mail, UserRound } from "lucide-react"
import { useEffect, useState } from "react"
import { assetUrl } from "@/lib/assets"
import { MediaLightbox } from "@/components/ui/media-lightbox"

const courseImages = [
  {
    src: assetUrl("/images/Cursos, Certificaciones e Investigaciones. Mapuzuguletuai\u00F1A1.2..png"),
    alt: "Certificacion Mapuzuguletuain",
    label: "Mapudugun A.2",
  },
  {
    src: assetUrl("/images/Cursos, Certificaciones e Investigaciones_XLI-Congreso..png"),
    alt: "XLI Congreso Nacional de Entomologia",
    label: "XLI Congreso Nacional de Entomologia",
  },
  {
    src: assetUrl("/images/Cursos, Certificaciones e Investigaciones_XLII-Congreso.png"),
    alt: "XLII Congreso Nacional de Entomologia",
    label: "XLII Congreso Nacional de Entomologia",
  },
]

export function ContactSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    containScroll: false,
    startIndex: 1,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [previewImage, setPreviewImage] = useState<(typeof courseImages)[number] | null>(null)

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

        <div className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-stretch">
            <aside className="rounded-[2rem] border border-border bg-card p-5 sm:p-7 lg:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <div className="relative overflow-hidden rounded-[1.9rem] border border-border bg-background shadow-sm">
                <div className="relative aspect-[5/4] w-full">
                  <Image
                    src={assetUrl("/images/Foto_arbol.jpeg")}
                    alt="Entorno natural asociado al enfoque ambiental de LIFKO"
                    fill
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    quality={72}
                    className="object-cover object-center"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/90 font-semibold mb-2">
                    Perfil
                  </p>
                  <h3 className="font-serif text-2xl font-semibold text-white mb-2">LIFKO SpA</h3>
                  <p className="max-w-md text-sm leading-relaxed text-white/90">
                    Analisis de calidad de agua, asesoria ambiental y acompanamiento tecnico
                    para proyectos con enfoque territorial.
                  </p>
                </div>
              </div>
            </aside>

            <div className="grid gap-3 sm:gap-4">
              <div className="rounded-[2rem] border border-border bg-card p-4 sm:p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
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

              <div className="rounded-[2rem] border border-border bg-card p-4 sm:p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
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

              <div className="rounded-[2rem] border border-border bg-card p-4 sm:p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
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

              <div className="rounded-[2rem] border border-border bg-card p-4 sm:p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
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

          <div className="rounded-[2rem] border border-border bg-card px-3 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.24em] text-primary font-semibold mb-2">
                Respaldo Visual
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
                Certificados e investigaciones
              </h3>
            </div>

            <div className="mx-auto w-full max-w-[50rem] overflow-hidden" ref={emblaRef}>
              <div className="flex items-center -mx-2">
                {courseImages.map((image, index) => {
                  return (
                    <div
                      key={image.src}
                      className="min-w-0 flex-[0_0_72%] sm:flex-[0_0_48%] lg:flex-[0_0_34%] xl:flex-[0_0_32%] px-2 py-3"
                    >
                      <div
                        className={`group overflow-hidden rounded-[1.9rem] border transition-all duration-300 ${
                          index === selectedIndex
                            ? "border-primary/60 shadow-[0_26px_70px_rgba(14,116,144,0.18)]"
                            : "border-border/60 shadow-[0_18px_50px_rgba(15,23,42,0.08)] hover:border-primary/40"
                        }`}
                        onClick={() => setPreviewImage(image)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            setPreviewImage(image)
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Abrir imagen ${image.label}`}
                      >
                        <div className="relative aspect-[4/5] w-full bg-muted/20">
                          <div className="absolute inset-0 z-10 rounded-[1.9rem] ring-1 ring-white/20" />
                          <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.06]">
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              sizes="(max-width: 640px) 76vw, (max-width: 1024px) 42vw, 26vw"
                              quality={68}
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
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

        {previewImage ? (
          <MediaLightbox
            title={previewImage.label}
            src={previewImage.src}
            alt={previewImage.alt}
            kind="image"
            onClose={() => setPreviewImage(null)}
          />
        ) : null}
      </div>
    </section>
  )
}
