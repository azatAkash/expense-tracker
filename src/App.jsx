import { useEffect, useRef } from "react";

export default function App({ mapId }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      // ждём, пока загрузится google
      if (!window.google?.maps?.importLibrary)
        return requestAnimationFrame(init);

      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement, PinElement } =
        await google.maps.importLibrary("marker");

      const fallback = { lat: 42.3736, lng: -71.1097 };

      const map = new Map(mapRef.current, {
        center: fallback,
        zoom: 17,
        tilt: 67.5,
        heading: 0,
        mapId, // обязательно для AdvancedMarkerElement
      });

      // Вариант 2: кастомный векторный пин
      const pin = new PinElement({
        // background: "#1a73e8", borderColor: "#0b57d0", glyphColor: "#fff", glyph: "A"
      });

      // Центр по геолокации
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const you = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            map.setCenter(you);
            new AdvancedMarkerElement({
              map,
              position: you,
              title: "Вы здесь",
            });
          },
          () => {},
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
        );
      }
    };

    init();
  }, []);

  return <div id="map" ref={mapRef} />;
}
