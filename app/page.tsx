import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { OnlineAdvisorySection } from "@/components/online-advisory-section"
import { FieldAdvisorySection } from "@/components/field-advisory-section"
import { ProjectManagementSection } from "@/components/project-management-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <OnlineAdvisorySection />
      <FieldAdvisorySection />
      <ProjectManagementSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
