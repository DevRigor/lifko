import { NextResponse } from "next/server"

const requestTypeLabels: Record<string, string> = {
  "uso-suelo": "Uso de Suelo",
  "uso-agua": "Uso de Agua",
  "dia-eia": "Gestión DIA-EIA",
  "restauracion": "Proyecto de Restauración",
  "mitigacion": "Plan de Mitigación",
  "otro": "Otro",
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, apellido, correo, telefono, tipoSolicitud, latitud, longitud } = body

    // Validate required fields
    if (!nombre || !apellido || !correo || !telefono || !tipoSolicitud) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    const tipoLabel = requestTypeLabels[tipoSolicitud] || tipoSolicitud

    // Email content
    const emailContent = `
Nueva solicitud de asesoría en terreno - LIFKO SPA

DATOS DEL SOLICITANTE:
Nombre: ${nombre} ${apellido}
Correo: ${correo}
Teléfono: ${telefono}

TIPO DE SOLICITUD:
${tipoLabel}

UBICACIÓN DEL TERRENO:
${latitud && longitud 
  ? `Coordenadas: ${latitud}, ${longitud}
Ver en Google Maps: https://www.google.com/maps?q=${latitud},${longitud}`
  : "No se especificaron coordenadas"}

---
Enviado desde el formulario de asesoría en terreno de www.lifkospa.cl
    `.trim()

    // In production, integrate with an email service
    console.log("=== New Field Advisory Request ===")
    console.log("To: ingrrnn.correaj@gmail.com")
    console.log("Subject:", `Solicitud de Asesoría en Terreno: ${tipoLabel}`)
    console.log("Content:", emailContent)
    console.log("==================================")

    // TODO: Integrate with email service
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'LIFKO SPA <noreply@lifkospa.cl>',
    //   to: 'ingrrnn.correaj@gmail.com',
    //   subject: `Solicitud de Asesoría en Terreno: ${tipoLabel}`,
    //   text: emailContent,
    // })

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
