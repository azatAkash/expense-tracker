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

export function findLocation(lat, lng) {
  return coordinates.find(
    (c) => c.coordinates.lat === lat && c.coordinates.lng === lng
  );
}
