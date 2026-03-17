"use client"

import { useState } from "react"
import { Send, Loader2, Mail, Linkedin, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const inquiryTypes = [
  { value: "uso-suelo", label: "Uso de Suelo" },
  { value: "calidad-agua", label: "Calidad de Agua" },
  { value: "gestion-dia-eia", label: "Gestion DIA-EIA" },
  { value: "restauracion", label: "Proyecto de Restauracion" },
  { value: "mitigacion", label: "Plan de Mitigacion" },
  { value: "cartografia", label: "Cartografia" },
  { value: "asesoria-online", label: "Asesoria Online" },
  { value: "otro", label: "Otra Consulta" },
]

export function ContactSection() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    asunto: "",
    mensaje: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleInquiryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, asunto: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          nombre: "",
          correo: "",
          asunto: "",
          mensaje: "",
        })
      } else {
        setSubmitStatus("error")
      }
    } catch {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contacto" className="py-24 lg:py-32 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">
            Contacto
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6 text-balance">
            Conversemos sobre su proyecto
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Estamos aqui para ayudarle. Complete el formulario y nos pondremos en contacto
            con usted a la brevedad para discutir como podemos apoyar su proyecto ambiental.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Ingeniero en Recursos Naturales</h3>
                  <p className="text-muted-foreground">Consultor Ambiental</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Correo Electronico</h3>
                  <p className="text-muted-foreground">ingrrnn.correaj@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Linkedin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">LinkedIn</h3>
                  <a
                    href="https://linkedin.com/in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Ver perfil profesional
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 lg:p-8">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-nombre">Nombre Completo</Label>
                  <Input
                    id="contact-nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Su nombre completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-correo">Correo Electronico</Label>
                  <Input
                    id="contact-correo"
                    name="correo"
                    type="email"
                    value={formData.correo}
                    onChange={handleInputChange}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="contact-asunto">Tipo de Consulta</Label>
                <Select value={formData.asunto} onValueChange={handleInquiryChange}>
                  <SelectTrigger id="contact-asunto" className="w-full">
                    <SelectValue placeholder="Seleccione el tipo de consulta" />
                  </SelectTrigger>
                  <SelectContent>
                    {inquiryTypes.map((type) => (
                      <SelectItem key={type.value} value={type.label}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="contact-mensaje">Mensaje</Label>
                <Textarea
                  id="contact-mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleInputChange}
                  placeholder="Describa su consulta o proyecto..."
                  rows={6}
                  required
                  className="resize-none"
                />
              </div>

              {submitStatus === "success" && (
                <div className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm">
                  Su mensaje ha sido enviado correctamente. Nos pondremos en contacto pronto.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  Hubo un error al enviar su mensaje. Por favor, intente nuevamente.
                </div>
              )}

              <Button
                type="submit"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensaje
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
