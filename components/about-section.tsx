import Image from "next/image"

const odsLogos = [
  { src: "/images/ODS_3.png", alt: "ODS 3" },
  { src: "/images/ODS_4.png", alt: "ODS 4" },
  { src: "/images/ODS_6.png", alt: "ODS 6" },
  { src: "/images/ods_13.png", alt: "ODS 13" },
  { src: "/images/ods_14.png", alt: "ODS 14" },
  { src: "/images/ods_15.png", alt: "ODS 15" },
]

export function AboutSection() {
  return (
    <section id="nosotros" className="py-20 lg:py-24 bg-background border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">
            Objetivos de Desarrollo Sostenible
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4 text-balance">
            Compromiso alineado con metas ambientales y educativas
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Integramos una mirada tecnica y territorial conectada con salud, educacion,
            agua limpia, accion climatica y conservacion de ecosistemas.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {odsLogos.map((logo) => (
            <div
              key={logo.src}
              className="bg-card border border-border rounded-2xl p-4 flex items-center justify-center shadow-sm"
            >
              <div className="relative h-24 w-full">
                <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
