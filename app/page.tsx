import dynamic from "next/dynamic"
import { redirect } from "next/navigation"
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

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const code = typeof params.code === "string" ? params.code : undefined

  if (code) {
    const callbackParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === "string") {
        callbackParams.set(key, value)
        return
      }

      value?.forEach((item) => callbackParams.append(key, item))
    })

    redirect(`/auth/callback?${callbackParams.toString()}`)
  }

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
