# Field Advisory Module

## Archivo principal
- `components/field-advisory-section.tsx`

## Rol
Captura solicitudes de visitas tecnicas en terreno.

## Datos capturados
- nombre
- apellido
- correo
- telefono
- tipo de solicitud
- latitud
- longitud

## Tipo de solicitud actual
- Uso de Suelo
- Calidad de Agua
- Gestion DIA-EIA
- Proyecto de Restauracion
- Plan de Mitigacion
- Otro

## Mapa
- usa Leaflet
- usa tiles de OpenStreetMap
- el usuario hace clic y se guardan coordenadas

## Salida de negocio
La API envia correo con:
- datos del solicitante
- tipo de solicitud
- coordenadas
- link a Google Maps
- link a OpenStreetMap
