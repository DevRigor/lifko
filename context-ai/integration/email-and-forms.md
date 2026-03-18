# Email and Forms Integration

## Integracion principal
Resend se usa para enviar correos desde el formulario de asesoria en terreno.

## Endpoints
- `app/api/field-advisory/route.ts`

## Campos importantes
- `from`: sale de `RESEND_FROM_EMAIL`
- `to`: sale de `CONTACT_EMAIL`
- `replyTo`: correo ingresado por el usuario

## Restriccion de prueba
Si se usa `onboarding@resend.dev`, solo se puede enviar al correo propietario de la cuenta Resend.

## Consideracion futura
Para produccion conviene:
- verificar dominio propio
- usar remitente del dominio verificado
