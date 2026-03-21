# Resources Module

## Estado
Propuesta de investigacion para un nuevo modulo. No esta implementado aun.

## Objetivo
Agregar una seccion `recursos` dentro de la app para mostrar una biblioteca publica de documentos y carpetas, administrada completamente desde LIFKO mediante una capa de datos propia y sin depender de Google Drive como fuente principal.

## Resultado esperado
- subir documentos desde un panel privado de LIFKO
- organizar carpetas o categorias desde la misma app
- publicar y despublicar recursos sin tocar codigo
- mostrar en la web publica solo los recursos habilitados
- mantener una UX limpia sin exponer logica de administracion al frontend publico

## Decision recomendada
Para este proyecto conviene usar Supabase como backend administrado.

La recomendacion concreta es:
- `Supabase Postgres` para metadata y estructura
- `Supabase Storage` para archivos
- `Supabase Auth` para acceso al panel admin
- Next.js como capa de UI publica y privada

## Por que Supabase encaja mejor que Google Drive
- evita depender de permisos y enlaces compartidos de Drive
- permite administrar todo desde LIFKO
- separa claramente contenido publico de panel privado
- da control real sobre publicacion, orden, categorias y visibilidad
- simplifica escalar a buscador, destacados, filtros y metricas
- reduce friccion editorial porque la estructura depende de tu producto, no de un filesystem externo

## Alcance funcional recomendado
- crear una ruta publica `/recursos`
- crear una ruta privada `/admin/recursos`
- subir PDF, imagenes y adjuntos desde el panel admin
- crear carpetas o categorias visibles en el frontend
- listar recursos con nombre, descripcion, tipo, fecha y enlace
- definir si un recurso es publico, privado o borrador
- permitir ordenar manualmente carpetas y documentos

## Modelo operativo recomendado
### Frontend publico
La seccion `recursos` solo debe consumir datos ya publicados y renderizar UX.

No deberia:
- decidir reglas de negocio
- conocer archivos ocultos o borradores
- manejar credenciales sensibles

### Admin privado
El panel de LIFKO debe permitir:
- subir archivos
- editar metadata
- mover recursos entre carpetas
- definir orden visual
- publicar o despublicar
- eliminar o archivar contenido

## Arquitectura sugerida
### Capas
- `lib/supabase/`: clientes server y browser
- `app/recursos/page.tsx`: biblioteca publica
- `app/admin/recursos/page.tsx`: gestion privada
- `components/resources/*`: componentes visuales publicos
- `components/admin/resources/*`: tabla, formulario, uploader, selector de carpeta

### Flujo publico
1. El usuario entra a `/recursos`.
2. La app consulta solo carpetas y recursos publicados.
3. El frontend renderiza la interfaz de exploracion.
4. Los archivos se abren desde URLs resueltas por Storage o por una capa server-side.

### Flujo admin
1. El usuario autenticado entra a `/admin/recursos`.
2. Sube un archivo a Supabase Storage.
3. Guarda metadata en Postgres.
4. Define carpeta, orden y estado de publicacion.
5. El frontend publico refleja el cambio cuando corresponda.

## Modelo de datos sugerido
### `resource_folders`
- `id`
- `name`
- `slug`
- `parent_id`
- `description`
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

### Opcional: `resource_tags`
- `id`
- `name`
- `slug`

### Opcional: `resource_tag_relations`
- `resource_id`
- `tag_id`

## Storage recomendado
### Bucket sugerido
- `resources`

### Convencion de rutas
- `resources/folders/{folder-slug}/{filename}`
- `resources/covers/{resource-slug}.jpg`

### Reglas
- el archivo real vive en Storage
- la metadata vive en Postgres
- el frontend nunca debe depender solo del nombre fisico del archivo para renderizar contenido

## Seguridad y permisos
### Auth
Usar `Supabase Auth` para proteger `/admin/recursos`.

### Politicas recomendadas
- lectura publica solo para recursos publicados
- lectura privada total solo para administradores autenticados
- escritura en Storage solo para usuarios admin
- escritura en tablas solo para usuarios admin

### Nota practica
Aunque Supabase permite mucho desde cliente, conviene que las operaciones sensibles del admin pasen por Server Actions o rutas internas de Next.js para mantener mejor control del dominio y la validacion.

## Variables de entorno futuras
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## UX recomendada para la seccion `recursos`
### Ubicacion
La mejor opcion para este proyecto es una ruta dedicada `/recursos`.

Motivos:
- la interfaz necesita mas espacio que una seccion de landing
- puede crecer a filtros, breadcrumbs y buscador
- separa mejor la capa comercial de la biblioteca documental

### Navegacion
- agregar enlace `Recursos` en `components/navigation.tsx`
- ese enlace debe navegar a `/recursos`
- mantener desde la landing algun CTA secundario a la biblioteca si hace sentido comercial

### Componentes visuales sugeridos
- breadcrumb
- arbol o sidebar de carpetas
- lista o grid de recursos
- iconos por tipo de archivo
- preview de portada cuando exista
- estados de carga, vacio y error
- acciones `Ver` y `Descargar`

## Reglas de negocio sugeridas
- solo mostrar carpetas publicadas
- solo mostrar recursos publicados
- ocultar archivos huerfanos o sin metadata valida
- priorizar carpetas antes que archivos en la UI
- permitir orden manual por `sort_order`
- mapear mime types a iconos y acciones legibles

## Comparacion resumida
### Google Drive
Ventajas:
- rapido para una prueba inicial

Desventajas:
- administracion fuera de LIFKO
- permisos poco controlables desde producto
- mala base para panel admin real
- UX limitada por estructura externa

### Supabase
Ventajas:
- admin completo dentro del producto
- DB, storage y auth en el mismo stack
- mejor control de permisos y publicacion
- mejor base para escalar funciones futuras

Desventajas:
- requiere modelar tablas y politicas
- hay una configuracion inicial mayor que con Drive

## Riesgos
- si las politicas quedan mal definidas, se puede exponer contenido privado
- si se mezcla demasiada logica en cliente, el admin puede quedar fragil
- si la estructura de carpetas se diseña mal, luego cuesta ordenar la biblioteca
- previews y descargas pueden requerir reglas distintas segun el bucket y el tipo de archivo

## Mitigaciones
- definir esquema de datos antes de implementar UI compleja
- separar claramente vista publica y panel admin
- usar policies conservadoras desde el inicio
- centralizar uploads y mutaciones sensibles en server actions o endpoints propios
- establecer convenciones editoriales para carpetas, slugs y orden

## Cache y rendimiento
Recomendado:
- usar render server-side para `/recursos`
- cachear consultas publicas si la frecuencia de cambio no es alta
- paginar o lazy-load si la biblioteca crece mucho
- optimizar previews para imagenes y PDFs pesados

## Fases sugeridas
### Fase 1
- integrar Supabase
- crear tablas `resource_folders` y `resources`
- crear bucket `resources`
- construir `/recursos` publico simple
- construir `/admin/recursos` con carga basica

### Fase 2
- breadcrumbs
- filtros por tipo
- portadas
- orden manual
- publicacion y borrador

### Fase 3
- buscador
- tags
- destacados
- analitica de descargas
- auditoria basica de cambios

## Impacto en la arquitectura actual
- la app deja de ser solo una landing y suma al menos una ruta publica y una privada
- la navegacion principal debera mezclar scroll interno con rutas reales
- la documentacion de arquitectura e integraciones deberia actualizarse cuando el modulo se implemente
- el proyecto pasa a depender de un backend administrado externo, pero no de un backend propio mantenido por ustedes

## Siguiente paso recomendado
Si se decide avanzar, el siguiente entregable deberia ser un spike tecnico con:
- integracion base de Supabase en Next.js
- esquema SQL inicial para carpetas y recursos
- pagina publica `app/recursos/page.tsx`
- panel privado `app/admin/recursos/page.tsx`
- upload inicial a Storage y listado de recursos publicados
