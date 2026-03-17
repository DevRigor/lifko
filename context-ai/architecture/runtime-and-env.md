# Runtime and Environment

## Variables importantes
- `RESEND_API_KEY`: credencial para enviar correos
- `CONTACT_EMAIL`: correo destino de formularios
- `RESEND_FROM_EMAIL`: remitente permitido por Resend

## Entorno local
El proyecto corre con:
- `yarn dev`
- `yarn build`

## Restricciones practicas
- Si `RESEND_FROM_EMAIL` usa `onboarding@resend.dev`, Resend solo permite enviar al correo propietario de la cuenta.
- Para produccion real, conviene verificar dominio y cambiar el remitente.

## Build
El build ya no depende de Google Fonts remotas. El sitio usa fuentes del sistema para evitar fallos offline.
