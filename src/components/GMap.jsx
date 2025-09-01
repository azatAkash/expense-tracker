// src/components/GMAP.jsx
import { useEffect, useRef } from "react";
import GoogleMapsManager from "../utils/GoogleMapsManager";
import { getCurrentLocation } from "../utils/geolocation";

export default function GMAP({ mapId, searchResult }) {
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;

    GoogleMapsManager.init(mapRef.current, { mapId });
  }, [mapId]);

  useEffect(() => {
    if (searchResult) {
      GoogleMapsManager.setCenter(searchResult.lat, searchResult.lng);
    }
  }, [searchResult]);

  return (
    <div className="map-container">
      <div id="map" ref={mapRef} />
    </div>
  );
}
