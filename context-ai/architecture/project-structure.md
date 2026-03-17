# Project Structure

## Arquitectura general
La aplicacion es una landing de una sola pagina construida sobre Next.js App Router. La pagina principal compone secciones independientes y dos endpoints API para formularios.

## Entrada principal
- `app/page.tsx`: compone toda la landing
- `app/layout.tsx`: metadata, tema y analytics

## Secciones principales
- `components/navigation.tsx`
- `components/hero-section.tsx`
- `components/about-section.tsx`
- `components/services-section.tsx`
- `components/online-advisory-section.tsx`
- `components/field-advisory-section.tsx`
- `components/project-management-section.tsx`
- `components/contact-section.tsx`
- `components/footer.tsx`

## Utilidades clave
- `components/scroll-link.tsx`: resuelve navegacion interna con offset por cabecera fija
- `components/theme-provider.tsx`: integra `next-themes`
- `components/theme-toggle.tsx`: alterna tema
- `lib/utils.ts`: helper `cn`

## Endpoints
- `app/api/contact/route.ts`
- `app/api/field-advisory/route.ts`

## Dependencias funcionales
- Resend: envio de correos
- Leaflet: mapa interactivo
- OpenStreetMap: capa base del mapa
