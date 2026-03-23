# Navigation and Scroll

## Problema resuelto
Los links con hash simples eran inconsistentes cuando el hash ya estaba activo o cuando habia cabecera fija.

## Solucion actual
- `components/scroll-link.tsx`
- `scroll-margin-top` en `app/globals.css`
- offset por defecto alineado con la altura visual de la cabecera
- `components/footer.tsx` decide entre `ScrollLink` y `Link` segun el pathname actual

## Regla de mantenimiento
Todo nuevo CTA que navegue a una seccion interna debe usar `ScrollLink` o el mismo patron de scroll programatico.

## Nota de rutas
Cuando un enlace a seccion se muestra fuera de la landing, debe navegar a `/#seccion` en vez de intentar resolver el hash sobre la ruta actual.
