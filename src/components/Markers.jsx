// src/components/Markers.jsx
import { useEffect } from "react";
import GoogleMapsManager from "../utils/GoogleMapsManager";
import { getCategoryByName } from "../models/categories";

export default function Markers({ items = [] }) {
  useEffect(() => {
    let disposed = false;

    (async () => {
      await GoogleMapsManager.waitForMap();
      if (disposed) return;

      // clear previous markers/popups
      GoogleMapsManager.clearMarkers();

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

        // open styled info on click
        marker.addListener("click", () =>
          GoogleMapsManager.openExpenseInfo(marker, {
            amountUSDCents: exp.amountUSDCents,
            category: exp.category,
            time: exp.time,
            note: exp.note,
            placeName: exp.placeName,
            accentColor: bg,
          })
        );
      }
    })();

    return () => {
      disposed = true;
      GoogleMapsManager.clearMarkers();
    };
  }, [items]);

  return null;
}
