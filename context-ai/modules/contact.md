# Contact Module

## Archivos principales
- `components/contact-section.tsx`
- `app/api/contact/route.ts`

## Rol
Captura consultas generales del usuario.

## Datos capturados
- nombre
- correo
- asunto
- mensaje

## UX actual
El campo `asunto` ya no es libre: se selecciona desde un dropdown de tipos de consulta.

## Tipos de consulta
- Uso de Suelo
- Calidad de Agua
- Gestion DIA-EIA
- Proyecto de Restauracion
- Plan de Mitigacion
- Cartografia
- Asesoria Online
- Otra Consulta

## Salida
La API envia un correo por Resend al correo configurado en `CONTACT_EMAIL`.
