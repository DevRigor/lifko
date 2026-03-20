import dynamic from "next/dynamic"
import Script from "next/script"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { OnlineAdvisorySection } from "@/components/online-advisory-section"
import { Footer } from "@/components/footer"
import { assetUrl } from "@/lib/assets"

const FieldAdvisorySection = dynamic(
  () => import("@/components/field-advisory-section").then((mod) => mod.FieldAdvisorySection)
)

const ContactSection = dynamic(
  () => import("@/components/contact-section").then((mod) => mod.ContactSection)
)

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "LIFKO SPA",
    url: "https://www.lifkospa.cl",
    image: assetUrl("/images/FONDO.PNG"),
    logo: assetUrl("/Logo.svg"),
    description:
      "Consultoria ambiental especializada en analisis de calidad de agua, monitoreo biofisicoquimico, cartografia hidro-geo-sociologica y asesoria tecnica en Chile.",
    areaServed: "Chile",
    serviceType: [
      "Analisis de calidad de agua",
      "Monitoreo ambiental",
      "Cartografia hidro-geo-sociologica",
      "Asesoria ambiental",
    ],
    email: "mailto:ingrrnn.correaj@gmail.com",
  }

  return (
    <main className="min-h-screen">
      <Script
        id="lifko-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <OnlineAdvisorySection />
      <FieldAdvisorySection />
      <ContactSection />
      <Footer />
    </main>
  )
}
