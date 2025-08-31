// src/utils/GoogleMapsManager.js
export default class GoogleMapsManager {
  static map = null;
  static places = null;
  static cache = new Map(); // key: "lat,lng" -> info

  static init(container, options) {
    if (!window.google || !google.maps) {
      throw new Error("Google Maps script not loaded");
    }

    if (!GoogleMapsManager.map) {
      GoogleMapsManager.map = new google.maps.Map(container, {
        center: options.center,
        zoom: options.zoom || 17,
        tilt: options.tilt || 60,
        mapId: options.mapId,
      });
      // init Places on the map
      GoogleMapsManager.places = new google.maps.places.PlacesService(
        GoogleMapsManager.map
      );
    }
    return GoogleMapsManager.map;
  }

  static setCenter(lat, lng) {
    if (GoogleMapsManager.map) GoogleMapsManager.map.setCenter({ lat, lng });
  }

  static geocodeLatLng(lat, lng) {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results?.length) {
          const best = results[0];
          resolve({ address: best.formatted_address, placeId: best.place_id });
        } else {
          reject(new Error(`Geocoder failed: ${status}`));
        }
      });
    });
  }

  static getPlaceDetails(placeId) {
    return new Promise((resolve) => {
      if (!GoogleMapsManager.places) return resolve(null);
      GoogleMapsManager.places.getDetails(
        {
          placeId,
          fields: [
            "name",
            "types",
            "website",
            "formatted_phone_number",
            "business_status",
          ],
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            resolve({
              name: place.name ?? null,
              types: place.types ?? [],
              phone: place.formatted_phone_number ?? null,
              website: place.website ?? null,
              businessStatus: place.business_status ?? null,
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  static findNearestPlace(lat, lng, radius = 50) {
    return new Promise((resolve) => {
      if (!GoogleMapsManager.places) return resolve(null);
      GoogleMapsManager.places.nearbySearch(
        { location: { lat, lng }, radius },
        (results, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            results?.length
          ) {
            const p = results[0];
            resolve({
              name: p.name ?? null,
              placeId: p.place_id ?? null,
              types: p.types ?? [],
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  /**
   * Main helper: returns { address, name?, placeId?, types?, phone?, website?, businessStatus? }
   */
  static async getAddressAndPlace(lat, lng) {
    const key = `${lat},${lng}`;
    if (GoogleMapsManager.cache.has(key))
      return GoogleMapsManager.cache.get(key);

    try {
      const g = await GoogleMapsManager.geocodeLatLng(lat, lng);
      let details = null;
      if (g.placeId) {
        details = await GoogleMapsManager.getPlaceDetails(g.placeId);
      }
      if (!details) {
        const near = await GoogleMapsManager.findNearestPlace(lat, lng, 50);
        const out = {
          address: g.address ?? null,
          name: near?.name ?? null,
          placeId: near?.placeId ?? null,
          types: near?.types ?? [],
        };
        GoogleMapsManager.cache.set(key, out);
        return out;
      }
      const out = {
        address: g.address ?? null,
        name: details?.name ?? null,
        placeId: g.placeId ?? null,
        types: details?.types ?? [],
        phone: details?.phone ?? null,
        website: details?.website ?? null,
        businessStatus: details?.businessStatus ?? null,
      };
      GoogleMapsManager.cache.set(key, out);
      return out;
    } catch (e) {
      const out = { address: null, error: e?.message ?? String(e) };
      GoogleMapsManager.cache.set(key, out);
      return out;
    }
  }
}
