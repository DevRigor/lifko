# Navigation Module

## Archivo principal
- `components/navigation.tsx`
- `components/footer.tsx`
- `app/layout.tsx`

## Responsabilidad
- mostrar identidad LIFKO
- permitir navegacion entre secciones
- enlazar rutas reales como `/recursos`
- mantener accesible el CTA principal
- exponer el cambio de tema
- mantener el footer disponible en toda la app

## Comportamiento importante
- la cabecera es fija
- cambia visualmente al hacer scroll
- usa `ScrollLink` para que cada seccion alinee bajo la cabecera
- convive con enlaces de ruta cuando el destino no pertenece a la landing
- el footer se monta globalmente desde `app/layout.tsx`
- el footer usa scroll interno solo en `/`; fuera de la landing enlaza a `/#seccion`

## Riesgos al modificar
- si se rompe el offset, la navegacion deja las secciones cortadas
- si se altera la cabecera fija, hay que revisar `scroll-margin-top` y `ScrollLink`
- si se quita la logica por pathname del footer, los links con hash dejan de funcionar bien desde rutas como `/recursos`
