import Image from "next/image"
import { CheckCircle2, Users, Target, Shield } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Equipo Especializado",
    description: "Profesionales con amplia experiencia en gestión ambiental y normativa vigente.",
  },
  {
    icon: Target,
    title: "Enfoque Técnico",
    description: "Soluciones basadas en análisis riguroso y metodologías probadas.",
  },
  {
    icon: Shield,
    title: "Compromiso Ambiental",
    description: "Promovemos el desarrollo sustentable y la protección del medio ambiente.",
  },
]

const highlights = [
  "Más de 10 años de experiencia en consultoría ambiental",
  "Proyectos ejecutados en todo Chile",
  "Acompañamiento integral en todo el proceso",
  "Cumplimiento normativo garantizado",
]

export function AboutSection() {
  return (
    <section id="nosotros" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/about-nature.jpg"
                alt="Equipo LIFKO en terreno"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-lg -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-primary/20 rounded-lg -z-10" />
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">
              Sobre Nosotros
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6 text-balance">
              Expertos en soluciones ambientales sustentables
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              LIFKO SPA es una consultora ambiental comprometida con el desarrollo sustentable 
              de proyectos en Chile. Nuestro equipo multidisciplinario de profesionales ofrece 
              asesoría técnica integral, acompañando a nuestros clientes desde la planificación 
              hasta la implementación de sus proyectos.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Trabajamos con un enfoque colaborativo, combinando rigor técnico con una 
              comunicación cercana, asegurando que cada proyecto cumpla con la normativa 
              ambiental vigente y contribuya positivamente al entorno.
            </p>

            {/* Highlights */}
            <ul className="space-y-3 mb-10">
              {highlights.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
