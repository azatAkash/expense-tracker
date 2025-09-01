// src/components/Markers.jsx
import { useEffect, useRef } from "react";
import GoogleMapsManager from "../utils/GoogleMapsManager";
import { getCategoryByName } from "../models/categories";
import { getCurrentLocation } from "../utils/geolocation";

export default function Markers({
  items = [],
  selectedId,
  onSelect,
  date,
  showUserMarker = true, // optional toggle
}) {
  // we manage expense markers ourselves so we don’t nuke the user marker
  const markersRef = useRef(new Map());
  const userMarkerRef = useRef(null);

  // ----- EXPENSE MARKERS -----
  useEffect(() => {
    let disposed = false;

    (async () => {
      await GoogleMapsManager.waitForMap();
      if (disposed) return;

      // clear ONLY expense markers we created previously
      markersRef.current.forEach(({ marker }) =>
        GoogleMapsManager.removeMarker(marker)
      );
      markersRef.current.clear();

      // add markers for current items
      for (const exp of items) {
        const lat = Number(exp?.coordinates?.lat);
        const lng = Number(exp?.coordinates?.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

        const cat = getCategoryByName(exp.category);
        const bg = cat?.color || "#1a73e8";

        const marker = await GoogleMapsManager.addMoneyMarker(lat, lng, {
          size: 50,
          label: "$",
          bg,
          ring: "#fff",
          zIndex: 10,
        });

        markersRef.current.set(exp.id, { marker, exp, accent: bg });

        marker.addListener("click", () => {
          onSelect?.(exp.id);
          GoogleMapsManager.openExpenseInfo(
            marker,
            {
              amountUSDCents: exp.amountUSDCents,
              category: exp.category,
              time: exp.time,
              note: exp.note,
              placeName: exp.placeName,
              accentColor: bg,
            },
            { onClose: () => onSelect?.(null) }
          );
        });
      }
    })();

    return () => {
      disposed = true;
      markersRef.current.forEach(({ marker }) =>
        GoogleMapsManager.removeMarker(marker)
      );
      markersRef.current.clear();
    };
  }, [items, onSelect]);

  // Open/close info when a card selects a marker
  useEffect(() => {
    if (!selectedId) {
      GoogleMapsManager._closeActiveInfo?.(true);
      return;
    }
    const entry = markersRef.current.get(selectedId);
    if (!entry) return;
    const { marker, exp, accent } = entry;
    GoogleMapsManager.openExpenseInfo(
      marker,
      {
        amountUSDCents: exp.amountUSDCents,
        category: exp.category,
        time: exp.time,
        note: exp.note,
        placeName: exp.placeName,
        accentColor: accent,
      },
      { onClose: () => onSelect?.(null) }
    );
  }, [selectedId, onSelect]);

  // ----- USER (CURRENT LOCATION) MARKER -----
  // runs on mount and whenever the selected day (dateKey) changes
  useEffect(() => {
    if (!showUserMarker) return;

    let disposed = false;

    (async () => {
      try {
        await GoogleMapsManager.waitForMap();

        const { lat, lng } = await getCurrentLocation();

        if (disposed) return;

        // (optional) recenter each day on the user
        GoogleMapsManager.setCenter(lat, lng);

        // remove previous user marker if any
        if (userMarkerRef.current) {
          GoogleMapsManager.removeMarker(userMarkerRef.current);
        }

        userMarkerRef.current = await GoogleMapsManager.addUserMarker(
          lat,
          lng,
          {
            text: "Your location",
          }
        );
      } catch (e) {
        // ignore if denied/no gps
        // console.warn("Geolocation unavailable:", e?.message || e);
      }
    })();

    return () => {
      disposed = true;
      if (userMarkerRef.current) {
        GoogleMapsManager.removeMarker(userMarkerRef.current);
        userMarkerRef.current = null;
      }
    };
  }, [date, showUserMarker]);

  return null;
}
