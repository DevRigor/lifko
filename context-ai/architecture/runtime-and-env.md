# Runtime and Environment

## Variables importantes
- `RESEND_API_KEY`: credencial para enviar correos
- `CONTACT_EMAIL`: correo destino de formularios
- `RESEND_FROM_EMAIL`: remitente permitido por Resend
- `NEXT_PUBLIC_CDN_BASE_URL`: base de assets publicos servidos desde Vercel Blob
- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE`: credencial publishable usada por cliente y servidor SSR

## Entorno local
El proyecto corre con:
- `yarn dev`
- `yarn build`

## Restricciones practicas
- Si `RESEND_FROM_EMAIL` usa `onboarding@resend.dev`, Resend solo permite enviar al correo propietario de la cuenta.
- Para produccion real, conviene verificar dominio y cambiar el remitente.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE` no es una credencial secreta, pero debe corresponder al proyecto Supabase correcto.
- Google OAuth del admin se configura en Supabase y Google Cloud, no como variable de entorno en Next.js.

## Build
El build ya no depende de Google Fonts remotas. El sitio usa fuentes del sistema para evitar fallos offline.

## Recursos
- `/recursos` usa render dinamico y lectura sin cache persistente para reflejar cambios reales de Supabase.
- si se borra contenido solo en Storage, la UI puede seguir mostrando metadata hasta que se elimine en tablas.
