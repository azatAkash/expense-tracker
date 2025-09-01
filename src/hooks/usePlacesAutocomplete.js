// src/hooks/usePlacesAutocomplete.js
import { useEffect, useRef, useState } from "react";
import GoogleMapsManager from "../utils/GoogleMapsManager";

export function usePlacesAutocomplete({
  query,
  biasLat,
  biasLng,
  minLength = 2,
}) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useRef(0);

  useEffect(() => {
    if (
      !query ||
      query.trim().length < minLength ||
      !Number.isFinite(biasLat) ||
      !Number.isFinite(biasLng)
    ) {
      setResults([]);
      return;
    }
    const id = ++token.current;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const places = await GoogleMapsManager.textSearchNear(
          query.trim(),
          biasLat,
          biasLng,
          {
            maxResultCount: 6,
            ensureName: true,
          }
        );
        if (id === token.current) setResults(places);
      } catch {
        if (id === token.current) setResults([]);
      } finally {
        if (id === token.current) setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query, biasLat, biasLng, minLength]);

  return { results, loading };
}
