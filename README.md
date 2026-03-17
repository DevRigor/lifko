# LIFKO Project Context

## Resumen
LIFKO es una landing/app web para una consultora ambiental en Chile. El sitio presenta servicios, explica la propuesta de valor de la empresa y permite captar leads por dos flujos principales:

- formulario general de contacto
- formulario de asesoria en terreno con seleccion de coordenadas en mapa

## Objetivo del proyecto
El proyecto busca convertir visitas en consultas comerciales, mostrando servicios ambientales especializados y habilitando contacto directo por correo.

## Stack principal
- Next.js 16 con App Router
- React 19
- TypeScript
- Tailwind CSS 4
- next-themes para modo claro/oscuro
- Leaflet + OpenStreetMap para el mapa
- Resend para envio de correos desde los formularios

## Estructura funcional
- `app/`: layout, pagina principal y endpoints API
- `components/`: secciones de la landing y componentes reutilizables
- `components/ui/`: primitives UI usadas activamente por los formularios
- `lib/`: utilidades compartidas
- `public/`: imagenes e iconos de marca
- `context-ai/`: contexto documental del proyecto para referencia de producto, UI y negocio

## Flujos principales
### Contacto
El usuario deja nombre, correo, tipo de consulta y mensaje. La API envia un correo usando Resend.

### Asesoria en terreno
El usuario completa un formulario mas detallado, selecciona coordenadas en el mapa y la API envia un correo con links a Google Maps y OpenStreetMap.

## Consideraciones actuales
- El sitio usa una sola pagina con secciones navegables por scroll interno.
- La navegacion interna usa offset para respetar la cabecera fija.
- La marca visual usa una paleta agua/bosque y el logo espiral LIFKO.
- El correo depende de variables locales como `RESEND_API_KEY`, `CONTACT_EMAIL` y `RESEND_FROM_EMAIL`.
