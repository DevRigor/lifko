declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options: MapOptions)
      addListener(eventName: string, handler: (event: MapMouseEvent) => void): void
    }

    interface MapOptions {
      center: LatLngLiteral
      zoom: number
      mapId?: string
      disableDefaultUI?: boolean
      zoomControl?: boolean
      mapTypeControl?: boolean
      streetViewControl?: boolean
      fullscreenControl?: boolean
    }

    interface LatLngLiteral {
      lat: number
      lng: number
    }

    class LatLng {
      constructor(lat: number, lng: number)
      lat(): number
      lng(): number
    }

    interface MapMouseEvent {
      latLng: LatLng | null
    }

    namespace marker {
      class AdvancedMarkerElement {
        constructor(options: AdvancedMarkerElementOptions)
        map: Map | null
        position: LatLng | LatLngLiteral | null
      }

      interface AdvancedMarkerElementOptions {
        map: Map
        position: LatLng | LatLngLiteral
        title?: string
      }
    }
  }
}

interface Window {
  google: typeof google
}
