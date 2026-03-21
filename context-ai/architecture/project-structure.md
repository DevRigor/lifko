# Project Structure

## Arquitectura general
La aplicacion combina una landing principal con modulos adicionales montados en App Router, incluyendo una biblioteca documental publica y un panel admin privado.

## Entrada principal
- `app/page.tsx`: compone toda la landing
- `app/layout.tsx`: metadata, tema y analytics
- `app/recursos/page.tsx`: biblioteca publica de carpetas y documentos
- `app/admin/login/page.tsx`: acceso admin con Google
- `app/admin/recursos/page.tsx`: panel privado de recursos
- `app/auth/callback/route.ts`: callback de autenticacion

## Secciones principales
- `components/navigation.tsx`
- `components/site-header.tsx`
- `components/hero-section.tsx`
- `components/about-section.tsx`
- `components/services-section.tsx`
- `components/online-advisory-section.tsx`
- `components/field-advisory-section.tsx`
- `components/contact-section.tsx`
- `components/footer.tsx`

## Modulo recursos
- `components/resources/*`: explorador publico, estados y vistas documentales
- `components/admin/resources/*`: explorador admin, login y formularios
- `lib/resources.ts`: lectura de biblioteca y armado de vista explorador
- `lib/resource-storage.ts`: reglas y helpers de uploads
- `lib/supabase/*`: clientes y middleware de sesion
- `types/resources.ts`: tipos del dominio
- `supabase/*.sql`: esquema y fixes operativos del modulo

## Utilidades clave
- `components/scroll-link.tsx`: resuelve navegacion interna con offset por cabecera fija
- `components/theme-provider.tsx`: integra `next-themes`
- `components/theme-toggle.tsx`: alterna tema
- `lib/utils.ts`: helper `cn`

## Endpoints
- `app/api/field-advisory/route.ts`
- `app/auth/callback/route.ts`

## Dependencias funcionales
- Resend: envio de correos
- Leaflet: mapa interactivo
- OpenStreetMap: capa base del mapa
- Supabase: auth, database y storage del modulo recursos
