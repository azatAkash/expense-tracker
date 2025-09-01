// src/components/AddressText.jsx
import React, { useEffect, useState } from "react";
import { cleanAddress } from "../../../utils/format";
import GoogleMapsManager from "../../../utils/GoogleMapsManager";

export default function AddressText({ lat, lng }) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const info = await GoogleMapsManager.getAddressAndPlace(lat, lng);
        if (alive) setAddress(info.address || info.name || "");
      } catch {
        if (alive) setAddress("");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [lat, lng]);

  if (loading) return <span className="address-skeleton">Resolving…</span>;
  return (
    <div className="expense-place-container">
      <img
        src="../../imgs/location.png"
        alt="location"
        className="expense-place-img"
      />
      <div className="expense-place">
        <p className="address-info">
          {cleanAddress(address) || "Unknown place"}
        </p>
      </div>
    </div>
  );
}
