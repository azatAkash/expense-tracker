import { useEffect, useRef } from "react";
import GoogleMapsManager from "../utils/GoogleMapsManager";
import { centerOnUser } from "../utils/geolocation";

export default function GMAP({ mapId }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      GoogleMapsManager.init(mapRef.current, {
        mapId,
      });

      centerOnUser();
    };

    init();
  }, []);

  return (
    <div className="map-container">
      <div id="map" ref={mapRef} />
    </div>
  );
}
