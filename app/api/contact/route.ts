import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, correo, asunto, mensaje } = body

    // Validate required fields
    if (!nombre || !correo || !asunto || !mensaje) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    // Email content
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

    // In production, you would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - Nodemailer with SMTP
    // For now, we'll log the email and return success
    console.log("=== New Contact Form Submission ===")
    console.log("To: ingrrnn.correaj@gmail.com")
    console.log("Subject:", `Contacto Web: ${asunto}`)
    console.log("Content:", emailContent)
    console.log("===================================")

    // TODO: Integrate with email service
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'LIFKO SPA <noreply@lifkospa.cl>',
    //   to: 'ingrrnn.correaj@gmail.com',
    //   subject: `Contacto Web: ${asunto}`,
    //   text: emailContent,
    // })

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
