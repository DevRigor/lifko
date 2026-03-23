# Resources Module

## Estado
Implementado como modulo funcional con vista publica y panel admin.

## Objetivo
Ofrecer una biblioteca navegable de carpetas y documentos desde `/recursos`, gestionada desde LIFKO y respaldada por Supabase.

## Rutas
- `/recursos`: explorador publico de carpetas y documentos publicados
- `/admin/login`: acceso admin con Google OAuth
- `/admin/recursos`: panel privado para gestionar carpetas y subir archivos
- `/auth/callback`: callback de autenticacion con Supabase

## Stack usado
- `Supabase Postgres`: metadata de carpetas y recursos
- `Supabase Storage`: archivos reales
- `Supabase Auth`: autenticacion admin con Google
- `Next.js App Router`: UI publica y privada

## Arquitectura aplicada
### Vista publica
- usa un explorador de carpetas en dos paneles
- muestra solo carpetas publicadas
- muestra solo documentos publicados
- permite navegar entre carpetas, abrir archivos y descargarlos
- no expone acciones administrativas
- hace una carga inicial de biblioteca desde servidor
- resuelve el cambio de carpeta en cliente para evitar roundtrips a Supabase en cada click
- mantiene la URL `?folder=` sincronizada para soportar compartir enlaces y usar back/forward

### Panel admin
- usa un explorador tipo sistema de archivos
- permite crear carpeta raiz desde un boton dedicado
- expone acciones por clic secundario sobre carpetas
- permite crear subcarpetas, renombrar, eliminar carpetas vacias y subir archivos
- usa Google OAuth mas whitelist interna de administradores

## Modelo de datos real
### `resource_folders`
- `id`
- `name`
- `slug`
- `description`
- `parent_id`
- `sort_order`
- `is_published`
- `created_at`
- `updated_at`

### `resources`
- `id`
- `folder_id`
- `title`
- `slug`
- `summary`
- `file_path`
- `file_name`
- `mime_type`
- `file_size`
- `cover_image_path`
- `is_published`
- `published_at`
- `sort_order`
- `created_at`
- `updated_at`

### `admin_users`
- `email`

## Reglas importantes
- las carpetas se leen desde `resource_folders`, no desde la estructura del bucket
- los documentos se leen desde `resources`, no desde el listado fisico de Storage
- borrar archivos en Storage no elimina automaticamente su metadata en Postgres
- para que un recurso desaparezca de la UI, debe eliminarse o despublicarse en tabla
- la vista publica se sirve sin cache persistente para reflejar cambios reales de Supabase
- la navegacion interna entre carpetas no debe volver a pedir toda la pagina; se filtra sobre la biblioteca ya cargada

## Seguridad
- login con Google configurado en Supabase Auth
- acceso admin validado contra `admin_users` con `is_resource_admin()`
- usuarios no autorizados son deslogueados y redirigidos a `/`
- el bucket `resources` es privado
- la vista publica consume signed URLs

## Uploads
- subida directa desde navegador al bucket `resources`
- limite actual orientado a plan Free
- tipos permitidos: `pdf`, `jpg`, `jpeg`, `png`, `webp`
- la metadata se guarda despues de subir el archivo

## UX publica
- copy orientado al usuario final, no a operacion interna
- arbol de carpetas persistente en la izquierda
- contenido de la carpeta seleccionada en el panel derecho
- acciones visibles para el usuario: `Ver` y `Descargar`
- breadcrumbs, arbol lateral y tarjetas de subcarpetas actualizan la carpeta activa en cliente

## UX admin
- boton fijo: `Nueva carpeta raiz`
- acciones restantes por clic secundario
- `Subir documento aqui` solo aparece dentro de una carpeta
- el panel derecho muestra solo el contenido de la carpeta seleccionada

## Variables de entorno
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE`
- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_CDN_BASE_URL`

## Archivos clave
- `app/recursos/page.tsx`
- `app/admin/login/page.tsx`
- `app/admin/recursos/page.tsx`
- `app/admin/recursos/actions.ts`
- `app/auth/callback/route.ts`
- `components/resources/resource-explorer.tsx`
- `components/admin/resources/admin-folder-manager.tsx`
- `lib/resources.ts`
- `lib/resource-storage.ts`
- `lib/supabase/*`
- `supabase/resources-schema.sql`
- `supabase/resources-admin-auth-fix.sql`
- `supabase/resources-storage-upload-fix.sql`

## Riesgos operativos
- si se borra solo Storage y no las tablas, quedaran registros huerfanos
- si se cambia de proyecto Supabase sin actualizar env vars, la app apuntara a otra base
- si las policies se relajan demasiado, se puede exponer contenido privado
- si la biblioteca crece mucho, la carga inicial puede volverse pesada porque trae toda la estructura publicada y signed URLs

## Siguiente mejora recomendada
- eliminar recursos desde admin borrando tanto metadata como archivo en Storage
- agregar edicion y borrado de documentos
- agregar mover documentos entre carpetas
