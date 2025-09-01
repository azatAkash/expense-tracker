import { generateId } from "../utils/generate";

export const coordinates = [
  {
    id: generateId("cor"),
    coordinates: {
      lat: 51.1605,
      lng: 71.4704,
    },
    info: {
      street: "",
      home: "",
      city: "",
      country: "",
      name: "",
    },
  },
];

export function normalizeCoordinates({ lat, lng }, decimals = 5) {
  return {
    lat: normalizeCoord(lat.toFixed(decimals)),
    lng: normalizeCoord(lng.toFixed(decimals)),
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

  // check if already exists
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
  return newCoord;
}

export function updateCoordinates(id, newInfo = {}) {
  const entry = coordinates.find((c) => c.id === id);
  if (!entry) return null;

  entry.info = {
    ...entry.info,
    ...newInfo,
  };

  return entry;
}
