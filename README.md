# LIFKO Project Context

## Resumen
LIFKO es una landing/app web para una consultora ambiental en Chile. El sitio presenta servicios, explica la propuesta de valor de la empresa y permite captar leads por dos flujos principales:

- formulario de asesoria en terreno con seleccion de coordenadas en mapa
- navegacion hacia informacion personal y respaldo visual de credenciales

## Objetivo del proyecto
El proyecto busca convertir visitas en consultas comerciales, mostrando servicios ambientales especializados y derivando al usuario hacia la solicitud de asesoria en terreno.

## Stack principal
- Next.js 16 con App Router
- React 19
- TypeScript
- Tailwind CSS 4
- next-themes para modo claro/oscuro
- Leaflet + OpenStreetMap para el mapa
- Resend para envio de correos desde formularios

## Estructura funcional
- `app/`: layout, pagina principal y endpoint API
- `components/`: secciones de la landing y componentes reutilizables
- `components/ui/`: primitives UI usadas activamente por el formulario de terreno
- `lib/`: utilidades compartidas
- `public/`: imagenes e identidad de marca
- `context-ai/`: contexto documental del proyecto para referencia de producto, UI y negocio

## Flujos principales
### Asesoria en terreno
El usuario completa un formulario, selecciona coordenadas en el mapa y la API envia un correo con links a Google Maps y OpenStreetMap.

### Informacion personal
La landing incluye una seccion de perfil profesional con fotografia editorial, datos de contacto directos, licencia clase B y un carrusel de certificados e investigaciones.

## Consideraciones actuales
- El sitio usa una sola pagina con secciones navegables por scroll interno.
- La navegacion interna usa offset para respetar la cabecera fija.
- La marca visual usa una paleta agua/bosque y `public/Logo.svg` como identidad principal.
- El correo depende de variables locales como `RESEND_API_KEY`, `CONTACT_EMAIL` y `RESEND_FROM_EMAIL`.
