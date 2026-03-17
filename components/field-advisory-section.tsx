"use client"

import { useState, useCallback, useRef, useEffect } from "react"
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
import { setOptions, importLibrary } from "@googlemaps/js-api-loader"

const requestTypes = [
  { value: "uso-suelo", label: "Uso de Suelo" },
  { value: "uso-agua", label: "Uso de Agua" },
  { value: "dia-eia", label: "Gestión DIA-EIA" },
  { value: "restauracion", label: "Proyecto de Restauración" },
  { value: "mitigacion", label: "Plan de Mitigación" },
  { value: "otro", label: "Otro" },
]

// Configure the Google Maps loader options
let mapsConfigured = false
const configureMaps = () => {
  if (mapsConfigured) return
  setOptions({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    version: "weekly",
  })
  mapsConfigured = true
}

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
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)

  // Initialize the map using the official @googlemaps/js-api-loader
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return

      try {
        // Configure and load the Maps JavaScript API using the new functional API
        configureMaps()
        await importLibrary("maps")
        await importLibrary("marker")

        if (!mapRef.current) return

        // Default center: Chile
        const defaultCenter = { lat: -33.4489, lng: -70.6693 }

        const map = new google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 6,
          mapId: "lifko-field-advisory-map",
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        })

        mapInstanceRef.current = map
        setMapLoaded(true)

        // Add click listener to place marker
        map.addListener("click", (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            placeMarker(event.latLng)
          }
        })
      } catch (error) {
        console.error("Error loading Google Maps:", error)
        setMapError(true)
      }
    }

    initMap()
  }, [])

  const placeMarker = useCallback((location: google.maps.LatLng) => {
    if (!mapInstanceRef.current) return

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.map = null
    }

    // Create new advanced marker
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: mapInstanceRef.current,
      position: location,
      title: "Ubicación seleccionada",
    })

    markerRef.current = marker

    // Update form data with coordinates
    setFormData((prev) => ({
      ...prev,
      latitud: location.lat().toFixed(6),
      longitud: location.lng().toFixed(6),
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
          markerRef.current.map = null
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
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-4">
            Asesorías en Terreno
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6 text-balance">
            Visitas técnicas especializadas
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Solicite una visita de nuestro equipo técnico a su terreno. Indique la ubicación 
            en el mapa y complete el formulario para coordinar la asesoría presencial.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Map */}
          <div className="order-2 lg:order-1">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/50">
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium">Seleccione la ubicación en el mapa</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Haga clic en el mapa para marcar el punto exacto de su terreno
                </p>
              </div>
              <div className="relative w-full h-[400px] bg-muted">
                {/* Map container - Google Maps will take over this div */}
                <div
                  ref={mapRef}
                  className="absolute inset-0"
                  style={{ display: mapLoaded ? 'block' : 'none' }}
                />
                {/* Loading state - separate from map container to avoid DOM conflicts */}
                {!mapLoaded && !mapError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Loader2 className="w-12 h-12 mx-auto mb-2 opacity-50 animate-spin" />
                      <p>Cargando mapa...</p>
                    </div>
                  </div>
                )}
                {/* Error state */}
                {mapError && (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="font-medium">Mapa no disponible</p>
                      <p className="text-sm mt-2">
                        Configure la variable de entorno NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para habilitar el mapa.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {(formData.latitud && formData.longitud) && (
                <div className="p-4 bg-primary/5 border-t border-border">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Coordenadas seleccionadas:</span>{" "}
                    {formData.latitud}, {formData.longitud}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
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
                <Label htmlFor="correo">Correo Electrónico</Label>
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
                <Label htmlFor="telefono">Teléfono</Label>
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
                    <SelectValue placeholder="Seleccione el tipo de asesoría" />
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
