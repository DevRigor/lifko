"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet"
import { MapPin, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const requestTypes = [
  { value: "uso-suelo", label: "Uso de Suelo" },
  { value: "calidad-agua", label: "Calidad de Agua" },
  { value: "dia-eia", label: "Gestion DIA-EIA" },
  { value: "restauracion", label: "Proyecto de Restauracion" },
  { value: "mitigacion", label: "Plan de Mitigacion" },
  { value: "otro", label: "Otro" },
]

export function FieldAdvisorySection() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    tipoSolicitud: "",
    latitud: "",
    longitud: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<LeafletMap | null>(null)
  const markerRef = useRef<LeafletMarker | null>(null)

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return

      try {
        const container = mapRef.current as HTMLDivElement & { _leaflet_id?: number }

        if (container._leaflet_id) {
          delete container._leaflet_id
        }

        const L = await import("leaflet")
        const defaultCenter = { lat: -33.4489, lng: -70.6693 }

        const map = L.map(container, {
          center: [defaultCenter.lat, defaultCenter.lng],
          zoom: 6,
          zoomControl: true,
        })

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        map.on("click", (event) => {
          void placeMarker({ lat: event.latlng.lat, lng: event.latlng.lng }, L)
        })

        mapInstanceRef.current = map
        setMapLoaded(true)
      } catch (error) {
        console.error("Error loading map:", error)
        setMapError(true)
      }
    }

    void initMap()

    return () => {
      markerRef.current?.remove()
      mapInstanceRef.current?.remove()
      markerRef.current = null
      mapInstanceRef.current = null
    }
  }, [])

  const placeMarker = useCallback(async (location: { lat: number; lng: number }, leafletModule?: typeof import("leaflet")) => {
    if (!mapInstanceRef.current) return

    const L = leafletModule ?? (await import("leaflet"))

    if (markerRef.current) {
      markerRef.current.remove()
    }

    const marker = L.marker([location.lat, location.lng], {
      icon: L.divIcon({
        className: "leaflet-selection-marker",
        html: "<span></span>",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }),
    })

    marker.addTo(mapInstanceRef.current)
    markerRef.current = marker

    setFormData((prev) => ({
      ...prev,
      latitud: location.lat.toFixed(6),
      longitud: location.lng.toFixed(6),
    }))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tipoSolicitud: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/field-advisory", {
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
          apellido: "",
          correo: "",
          telefono: "",
          tipoSolicitud: "",
          latitud: "",
          longitud: "",
        })
        if (markerRef.current) {
          markerRef.current.remove()
          markerRef.current = null
        }
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
    <section id="visitas-tecnicas" className="py-24 lg:py-32 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">
            Asesorias en Terreno
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6 text-balance">
            Visitas tecnicas especializadas
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Solicite una visita de nuestro equipo tecnico a su terreno. Indique la ubicacion
            en el mapa y complete el formulario para coordinar la asesoria presencial.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="order-2 lg:order-1">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/50">
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium">Seleccione la ubicacion en el mapa</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Haga clic en el mapa para marcar el punto exacto de su terreno
                </p>
              </div>
              <div className="relative w-full h-[400px] bg-muted">
                <div
                  ref={mapRef}
                  className="absolute inset-0"
                  style={{ visibility: mapLoaded ? "visible" : "hidden" }}
                />
                {!mapLoaded && !mapError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Loader2 className="w-12 h-12 mx-auto mb-2 opacity-50 animate-spin" />
                      <p>Cargando mapa...</p>
                    </div>
                  </div>
                )}
                {mapError && (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="font-medium">Mapa no disponible</p>
                      <p className="text-sm mt-2">
                        No fue posible cargar el mapa base de OpenStreetMap en este momento.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {formData.latitud && formData.longitud && (
                <div className="p-4 bg-primary/5 border-t border-border">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Coordenadas seleccionadas:</span>{" "}
                    {formData.latitud}, {formData.longitud}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 lg:p-8">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
                Formulario de Solicitud
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Su nombre"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    placeholder="Su apellido"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="correo">Correo Electronico</Label>
                <Input
                  id="correo"
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="telefono">Telefono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+56 9 1234 5678"
                  required
                />
              </div>

              <div className="space-y-2 mb-4">
                <Label htmlFor="tipoSolicitud">Tipo de Solicitud</Label>
                <Select value={formData.tipoSolicitud} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de asesoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {requestTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="latitud">Latitud</Label>
                  <Input
                    id="latitud"
                    name="latitud"
                    value={formData.latitud}
                    onChange={handleInputChange}
                    placeholder="Seleccione en el mapa"
                    readOnly
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitud">Longitud</Label>
                  <Input
                    id="longitud"
                    name="longitud"
                    value={formData.longitud}
                    onChange={handleInputChange}
                    placeholder="Seleccione en el mapa"
                    readOnly
                    className="bg-muted/50"
                  />
                </div>
              </div>

              {submitStatus === "success" && (
                <div className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm">
                  Su solicitud ha sido enviada correctamente. Nos pondremos en contacto pronto.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  Hubo un error al enviar su solicitud. Por favor, intente nuevamente.
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
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
                    Enviar Solicitud
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
