// src/utils/GoogleMapsManager.js
export default class GoogleMapsManager {
  static map = null;
  static cache = new Map();
  static Place = null;

  static async ensurePlaceClass() {
    if (GoogleMapsManager.Place) return GoogleMapsManager.Place;
    if (!window.google || !google.maps) {
      throw new Error("Google Maps script not loaded");
    }
    const { Place } = await google.maps.importLibrary("places");
    GoogleMapsManager.Place = Place;
    return Place;
  }

  static init(container, options) {
    if (!window.google || !google.maps) {
      throw new Error("Google Maps script not loaded");
    }
    if (!GoogleMapsManager.map) {
      GoogleMapsManager.map = new google.maps.Map(container, {
        center: options.center,
        zoom: options.zoom ?? 17,
        tilt: options.tilt ?? 60,
        mapId: options.mapId,
      });
    }
    return GoogleMapsManager.map;
  }

  static setCenter(lat, lng) {
    if (GoogleMapsManager.map) GoogleMapsManager.map.setCenter({ lat, lng });
  }

  // Reverse geocode: prefer POI if available
  static geocodeLatLng(lat, lng) {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results?.length) {
          const poi = results.find(
            (r) =>
              r.types?.includes("point_of_interest") ||
              r.types?.includes("establishment")
          );
          const best = poi || results[0];
          resolve({
            address: best.formatted_address,
            placeId: best.place_id,
            types: best.types,
          });
        } else {
          reject(new Error(`Geocoder failed: ${status}`));
        }
      });
    });
  }

  // Place details (new API)
  static async getPlaceDetails(placeId) {
    try {
      const Place = await GoogleMapsManager.ensurePlaceClass();
      const place = new Place({ id: placeId });
      const data = await place.fetchFields({
        fields: [
          "id",
          "displayName",
          "types",
          "websiteUri",
          "nationalPhoneNumber",
          "businessStatus",
        ],
      });
      return {
        name: data.displayName?.text ?? null,
        types: data.types ?? [],
        phone: data.nationalPhoneNumber ?? null,
        website: data.websiteUri ?? null,
        businessStatus: data.businessStatus ?? null,
      };
    } catch {
      return null;
    }
  }

  static async findNearestPlace(lat, lng, radius = 250) {
    try {
      const Place = await GoogleMapsManager.ensurePlaceClass();
      const resp = await Place.searchNearby({
        locationRestriction: { center: { lat, lng }, radiusMeters: radius },
        fields: ["id", "displayName", "types", "shortFormattedAddress"],
        maxResultCount: 5,
        rankPreference: "DISTANCE", // <- key to prefer closest
      });
      const item =
        resp?.places?.find((p) => p.displayName?.text) || resp?.places?.[0];
      if (!item) return null;
      return {
        name: item.displayName?.text ?? null,
        placeId: item.id ?? null,
        types: item.types ?? [],
        shortAddress: item.shortFormattedAddress ?? null,
      };
    } catch {
      return null;
    }
  }

  static async getAddressAndPlace(lat, lng) {
    const key = `${lat},${lng}`;
    if (GoogleMapsManager.cache.has(key))
      return GoogleMapsManager.cache.get(key);

    try {
      const g = await GoogleMapsManager.geocodeLatLng(lat, lng);

      // try details for the geocoded placeId
      let details = null;
      if (g.placeId) {
        details = await GoogleMapsManager.getPlaceDetails(g.placeId);
      }

      // FORCE nearby search if (a) we got a plus-code address OR (b) no name yet
      if (g.isPlusCode || !details?.name) {
        const near = await GoogleMapsManager.findNearestPlace(lat, lng, 250);
        if (near) {
          details = { ...details, ...near };
        }
      }

      const out = {
        address: g.address ?? details?.shortAddress ?? null,
        name: details?.name ?? null,
        placeId: g.placeId ?? details?.placeId ?? null,
        types: details?.types ?? [],
      };

      GoogleMapsManager.cache.set(key, out);
      return out;
    } catch (e) {
      const out = { address: null, name: null, error: e?.message ?? String(e) };
      GoogleMapsManager.cache.set(key, out);
      return out;
    }
  }
}
