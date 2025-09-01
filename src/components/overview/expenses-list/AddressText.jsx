// src/components/AddressText.jsx
import React, { useEffect, useState } from "react";
import { cleanAddress } from "../../../utils/format";
import { findLocation } from "../../../models/coordinates"; // ← adjust path if needed

export default function AddressText({ lat, lng, placeName, decimals = 5 }) {
  // Synchronous lookup from your coordinates store
  const entry =
    Number.isFinite(lat) && Number.isFinite(lng)
      ? findLocation(lat, lng, decimals)
      : null;

  const info = entry?.info;

  // Priority: explicit placeName prop -> saved name -> assembled address -> unknown
  const label =
    (placeName && placeName.trim()) ||
    (info?.name && info.name.trim()) ||
    [info?.street, info?.home, info?.city, info?.country]
      .filter(Boolean)
      .join(", ");

  const text = label ? cleanAddress(label) : "Unknown place";

  return (
    <div className="expense-place-container">
      <img
        src="../../imgs/location.png" // or import and use <img src={locPng} .../>
        alt="location"
        className="expense-place-img"
      />
      <div className="expense-place">
        <p className="address-info">{text}</p>
      </div>
    </div>
  );
}
