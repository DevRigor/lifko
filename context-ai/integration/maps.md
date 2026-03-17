# Maps Integration

## Implementacion actual
- biblioteca: Leaflet
- proveedor de tiles: OpenStreetMap

## Uso funcional
Solo se requiere seleccionar una ubicacion y guardar coordenadas. No se usa geocodificacion ni servicios premium.

## Beneficios de esta eleccion
- no requiere API key
- simplifica despliegue local
- reduce dependencia de servicios pagos

## Consideraciones
- depende de la disponibilidad del tile server
- el mapa en el formulario es una ayuda para seleccionar lat/lng, no un modulo GIS completo
