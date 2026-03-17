import { NextResponse } from "next/server"
import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const contactEmail = process.env.CONTACT_EMAIL || "ingrrnn.correaj@gmail.com"
const resendFromEmail = process.env.RESEND_FROM_EMAIL || "LIFKO SPA <onboarding@resend.dev>"

const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, correo, asunto, mensaje } = body

    if (!nombre || !correo || !asunto || !mensaje) {
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

    const emailContent = `
Nuevo mensaje de contacto desde LIFKO SPA

Nombre: ${nombre}
Correo: ${correo}
Asunto: ${asunto}

Mensaje:
${mensaje}

---
Enviado desde el formulario de contacto de www.lifkospa.cl
    `.trim()

    await resend.emails.send({
      from: resendFromEmail,
      to: contactEmail,
      replyTo: correo,
      subject: `Contacto Web: ${asunto}`,
      text: emailContent,
    })

    return NextResponse.json(
      { success: true, message: "Mensaje enviado correctamente" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { error: "Error al procesar el formulario" },
      { status: 500 }
    )
  }
}
