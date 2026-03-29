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
- Supabase (auth, base de datos, storage)
- next-themes para modo claro/oscuro
- Leaflet + OpenStreetMap para el mapa
- Resend para envio de correos desde formularios

## Estructura funcional
- `app/`: layout, pagina principal y endpoint API
- `app/recursos/`: pagina publica de la biblioteca de recursos
- `app/admin/recursos/`: panel admin con server actions para gestionar recursos
- `components/`: secciones de la landing y componentes reutilizables
- `components/resources/`: componentes de la vista publica de recursos (cards, explorador, estados)
- `components/admin/resources/`: componentes del panel admin (explorador de carpetas, formularios, modales)
- `components/ui/`: primitives UI usadas activamente por el formulario de terreno
- `lib/`: utilidades compartidas
- `lib/resources.ts`: queries de lectura para recursos publicados y admin
- `lib/resource-storage.ts`: constantes y helpers de almacenamiento en Supabase Storage
- `public/`: imagenes e identidad de marca
- `types/resources.ts`: tipos TypeScript del modulo de recursos
- `context-ai/`: contexto documental del proyecto para referencia de producto, UI y negocio

## Flujos principales
### Asesoria en terreno
El usuario completa un formulario, selecciona coordenadas en el mapa y la API envia un correo con links a Google Maps y OpenStreetMap.

### Informacion personal
La landing incluye una seccion de perfil profesional con fotografia editorial, datos de contacto directos, licencia clase B y un carrusel de certificados e investigaciones.

### Biblioteca de recursos
Seccion publica (`/recursos`) donde los visitantes pueden explorar carpetas tematicas y descargar documentos publicados por LIFKO (PDFs, imagenes, etc.).

- **Panel admin** (`/admin/recursos`): interfaz protegida para gestionar la biblioteca. Permite crear carpetas, subir archivos, renombrar y eliminar carpetas vacias.
- **Publicacion**: al subir un archivo el admin decide si queda visible al publico o en borrador. Tambien puede cambiar el estado de publicacion haciendo clic derecho sobre cualquier archivo en la tabla de documentos.
- **Almacenamiento**: los archivos se guardan en Supabase Storage y se sirven con URLs firmadas temporales.
- **Estructura**: carpetas anidadas con explorador tipo sistema de archivos en el admin y navegacion por carpetas en la vista publica.

## Consideraciones actuales
- El sitio usa una sola pagina con secciones navegables por scroll interno.
- La navegacion interna usa offset para respetar la cabecera fija.
- La marca visual usa una paleta agua/bosque y `public/Logo.svg` como identidad principal.
- El correo depende de variables locales como `RESEND_API_KEY`, `CONTACT_EMAIL` y `RESEND_FROM_EMAIL`.
- Si se quiere servir assets desde un CDN externo, definir `NEXT_PUBLIC_CDN_BASE_URL` con la base donde viven las imagenes y el logo.
