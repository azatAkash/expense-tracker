// src/components/LocationField.jsx
import React, { useMemo, useRef, useState } from "react";
import { usePlacesAutocomplete } from "../../hooks/usePlacesAutocomplete";

export default function LocationField({
  name,
  lat,
  lng,
  required = true,
  onNameChange,
  onSelectPlace,
  allowUseCurrentWithName = true,
}) {
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);

  const { results, loading } = usePlacesAutocomplete({
    query: name || "",
    biasLat: Number(lat),
    biasLng: Number(lng),
    minLength: 2,
  });

  const canUseCurrent = useMemo(() => {
    return (
      allowUseCurrentWithName &&
      (name || "").trim().length > 0 &&
      Number.isFinite(Number(lat)) &&
      Number.isFinite(Number(lng))
    );
  }, [allowUseCurrentWithName, name, lat, lng]);

  const pick = (p) => {
    onSelectPlace?.({
      name: p.name || p.address || "",
      lat: p.location?.lat ?? null,
      lng: p.location?.lng ?? null,
      placeId: p.id ?? null,
      address: p.address ?? p.formattedAddress ?? "",
    });
    setOpen(false);
  };

  const useCurrent = () => {
    onSelectPlace?.({
      name: (name || "").trim(),
      lat: Number(lat),
      lng: Number(lng),
      placeId: null,
      address: "",
    });
    setOpen(false);
  };

  return (
    <div className="loc-field">
      <label className="lbl">
        Location name
        <input
          ref={inputRef}
          type="text"
          value={name || ""}
          onChange={(e) => onNameChange?.(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Type a place name"
          autoComplete="off"
          required={required}
        />
      </label>

      {open && (loading || results.length > 0 || canUseCurrent) && (
        <div className="loc-menu">
          {loading && <div className="loc-item muted">Searching…</div>}
          {canUseCurrent && (
            <button
              type="button"
              className="loc-item strong"
              onMouseDown={(e) => e.preventDefault()}
              onClick={useCurrent}
            >
              Use “{(name || "").trim()}” at my current location (
              {Number(lat).toFixed(5)}, {Number(lng).toFixed(5)})
            </button>
          )}
          {results.map((r) => (
            <button
              key={r.id || `${r.name}-${r.address}`}
              type="button"
              className="loc-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(r)}
              title={r.address || ""}
            >
              <div className="loc-name">{r.name || "Unnamed place"}</div>
              {r.address && <div className="loc-addr">{r.address}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
