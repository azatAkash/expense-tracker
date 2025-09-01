// src/models/coordinates.js
import { generateId } from "../utils/generate";
import { load, save } from "../utils/persist";

const STORAGE_NAME = "coordinates";

export const coordinates = [];
(() => {
  const persisted = load(STORAGE_NAME, null);
  if (Array.isArray(persisted)) coordinates.push(...persisted);
})();

function normalizeCoord(v) {
  return Number(v);
}

export function normalizeCoordinates({ lat, lng }, decimals = 5) {
  return {
    lat: normalizeCoord(Number(lat).toFixed(decimals)),
    lng: normalizeCoord(Number(lng).toFixed(decimals)),
  };
}

export function findLocation(lat, lng, decimals = 5) {
  const target = normalizeCoordinates({ lat, lng }, decimals);
  return coordinates.find((c) => {
    const norm = normalizeCoordinates(c.coordinates, decimals);
    return norm.lat === target.lat && norm.lng === target.lng;
  });
}

export function addCoordinates({ lat, lng, info = {} }, decimals = 5) {
  const norm = normalizeCoordinates({ lat, lng }, decimals);
  const existing = findLocation(norm.lat, norm.lng, decimals);
  if (existing) return existing;

  const newCoord = {
    id: generateId("cor"),
    coordinates: norm,
    info: {
      street: info.street || "",
      home: info.home || "",
      city: info.city || "",
      country: info.country || "",
      name: info.name || "",
    },
  };
  coordinates.push(newCoord);
  save(STORAGE_NAME, coordinates);
  console.log(coordinates);
  return newCoord;
}

export function updateCoordinates(id, newInfo = {}) {
  const entry = coordinates.find((c) => c.id === id);
  if (!entry) return null;
  entry.info = { ...entry.info, ...newInfo };
  save(STORAGE_NAME, coordinates);
  return entry;
}

export function upsertCoordinates({ lat, lng, info = {} }, decimals = 5) {
  const existing = findLocation(lat, lng, decimals);
  if (existing) {
    existing.info = { ...existing.info, ...info };
    save(STORAGE_NAME, coordinates);
    return existing;
  }
  return addCoordinates({ lat, lng, info }, decimals);
}

export function rememberPlace(
  { lat, lng, name, street = "", city = "", country = "", home = "" },
  decimals = 5
) {
  return upsertCoordinates(
    { lat, lng, info: { name: name || "", street, city, country, home } },
    decimals
  );
}
