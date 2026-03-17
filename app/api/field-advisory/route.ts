import { NextResponse } from "next/server"

const requestTypeLabels: Record<string, string> = {
  "uso-suelo": "Uso de Suelo",
  "calidad-agua": "Calidad de Agua",
  "dia-eia": "Gestion DIA-EIA",
  "restauracion": "Proyecto de Restauracion",
  "mitigacion": "Plan de Mitigacion",
  "otro": "Otro",
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, apellido, correo, telefono, tipoSolicitud, latitud, longitud } = body

    if (!nombre || !apellido || !correo || !telefono || !tipoSolicitud) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    const tipoLabel = requestTypeLabels[tipoSolicitud] || tipoSolicitud
    const hasCoordinates = Boolean(latitud && longitud)
    const googleMapsUrl = hasCoordinates
      ? `https://www.google.com/maps?q=${latitud},${longitud}`
      : null
    const openStreetMapUrl = hasCoordinates
      ? `https://www.openstreetmap.org/?mlat=${latitud}&mlon=${longitud}#map=16/${latitud}/${longitud}`
      : null

    const emailContent = `
Nueva solicitud de asesoria en terreno - LIFKO SPA

DATOS DEL SOLICITANTE:
Nombre: ${nombre} ${apellido}
Correo: ${correo}
Telefono: ${telefono}

TIPO DE SOLICITUD:
${tipoLabel}

UBICACION DEL TERRENO:
${hasCoordinates
  ? `Coordenadas: ${latitud}, ${longitud}
Ver en Google Maps: ${googleMapsUrl}
Ver en OpenStreetMap: ${openStreetMapUrl}`
  : "No se especificaron coordenadas"}

---
Enviado desde el formulario de asesoria en terreno de www.lifkospa.cl
    `.trim()

    console.log("=== New Field Advisory Request ===")
    console.log("To: ingrrnn.correaj@gmail.com")
    console.log("Subject:", `Solicitud de Asesoria en Terreno: ${tipoLabel}`)
    console.log("Content:", emailContent)
    console.log("==================================")

    return NextResponse.json(
      { success: true, message: "Solicitud enviada correctamente" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing field advisory form:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
