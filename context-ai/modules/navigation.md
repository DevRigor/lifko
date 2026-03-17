# Navigation Module

## Archivo principal
- `components/navigation.tsx`

## Responsabilidad
- mostrar identidad LIFKO
- permitir navegacion entre secciones
- mantener accesible el CTA principal
- exponer el cambio de tema

## Comportamiento importante
- la cabecera es fija
- cambia visualmente al hacer scroll
- usa `ScrollLink` para que cada seccion alinee bajo la cabecera

## Riesgos al modificar
- si se rompe el offset, la navegacion deja las secciones cortadas
- si se altera la cabecera fija, hay que revisar `scroll-margin-top` y `ScrollLink`
