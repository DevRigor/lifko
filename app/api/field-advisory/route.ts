import { NextResponse } from "next/server"
import { Resend } from "resend"

const requestTypeLabels: Record<string, string> = {
  "uso-suelo": "Uso de Suelo",
  "calidad-agua": "Calidad de Agua",
  "dia-eia": "Gestion DIA-EIA",
  "restauracion": "Proyecto de Restauracion",
  "mitigacion": "Plan de Mitigacion",
  "otro": "Otro",
}

const resendApiKey = process.env.RESEND_API_KEY
const contactEmail = process.env.CONTACT_EMAIL || "ingrrnn.correaj@gmail.com"
const resendFromEmail = process.env.RESEND_FROM_EMAIL || "LIFKO SPA <onboarding@resend.dev>"

const resend = resendApiKey ? new Resend(resendApiKey) : null

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

    if (!resend) {
      console.error("RESEND_API_KEY no configurada")
      return NextResponse.json(
        { error: "El servicio de correo no esta configurado" },
        { status: 500 }
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

    await resend.emails.send({
      from: resendFromEmail,
      to: contactEmail,
      replyTo: correo,
      subject: `Solicitud de Asesoria en Terreno: ${tipoLabel}`,
      text: emailContent,
    })

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
