import GoogleMapsManager from "./GoogleMapsManager";

export function getCurrentLocation(options = {}) {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported"));
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        });
      },
      (err) => reject(err),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
        ...options, // allow override
      }
    );
  });
}

export async function centerOnUser() {
  try {
    const coords = await getCurrentLocation();
    GoogleMapsManager.setCenter(coords.lat, coords.lng);
  } catch (e) {
    console.error("Failed to get location:", e);
  }
}

export async function useMyLocation() {
  try {
    const { lat, lng } = await getCurrentLocation();
    setForm((p) => ({ ...p, lat: String(lat), lng: String(lng) }));
  } catch (e) {
    console.error("Failed to get location:", e);
  }
}
