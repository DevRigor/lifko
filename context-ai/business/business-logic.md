# Business Logic

## Modelo comercial
La web no es un sistema transaccional. Es una plataforma de presentacion y captacion de leads.

## Conversion principal
Las acciones mas importantes son:
- enviar formulario de contacto
- enviar formulario de asesoria en terreno

## Regla funcional de formularios
- si faltan campos requeridos, la API responde 400
- si falta configuracion de correo, la API responde 500
- si Resend envia correctamente, la API responde 200

## Regla de navegacion
Los CTA internos deben aterrizar exactamente en la seccion objetivo, considerando cabecera fija.
