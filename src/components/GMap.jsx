import { useEffect, useRef, useState } from "react";
import GoogleMapsManager from "../utils/GoogleMapsManager";
import { centerOnUser } from "../utils/geolocation";
export default function GMAP({ mapId, searchResult }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!window.google?.maps) return;

    GoogleMapsManager.init(mapRef.current, { mapId });
    centerOnUser();
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
