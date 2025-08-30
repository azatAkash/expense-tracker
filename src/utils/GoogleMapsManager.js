// src/utils/GoogleMapsManager.js
export default class GoogleMapsManager {
  static map = null;

  static init(container, options) {
    if (!window.google || !google.maps) {
      throw new Error("Google Maps script not loaded");
    }

    if (!GoogleMapsManager.map) {
      GoogleMapsManager.map = new google.maps.Map(container, {
        center: options.center, // Astana
        zoom: options.zoom || 17,
        tilt: options.tilt || 60,
        mapId: options.mapId, // for advanced markers (vector maps)
      });
    }
    return GoogleMapsManager.map;
  }

  static addCustomPin({ lat, lng, label }) {
    const { AdvancedMarkerElement, PinElement } = google.maps.marker;

    const pin = new PinElement({
      background: "#e53935", // red circle
      borderColor: "#fdd835", // yellow border
      glyph: "$", // your symbol
      glyphColor: "white", // symbol color
    });

    const marker = new AdvancedMarkerElement({
      map: GoogleMapsManager.map,
      position: { lat, lng },
      title: label,
      content: pin.element, // use custom styled pin
    });

    return marker;
  }

  static setCenter(lat, lng) {
    if (GoogleMapsManager.map) GoogleMapsManager.map.setCenter({ lat, lng });
  }

  static async getAddressFromCoords(lat, lng) {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(`Geocoder failed: ${status}`);
        }
      });
    });
  }

  // 1) Reverse geocode to get address (and maybe placeId)
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

  // 2) Given a placeId, fetch full place details (name, types, etc.)
  static getPlaceDetails(placeId) {
    return new Promise((resolve, reject) => {
      GoogleMapsManager.places.getDetails(
        {
          placeId,
          fields: ["name", "types", "website", "formatted_phone_number"],
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            resolve({
              name: place.name ?? null,
              types: place.types ?? [],
              phone: place.formatted_phone_number ?? null,
              website: place.website ?? null,
            });
          } else {
            resolve(null); // soft-fail to allow fallback
          }
        }
      );
    });
  }

  // 3) Fallback: find the nearest place around coords (if reverse geocode had no placeId or details failed)
  static findNearestPlace(lat, lng, radius = 50) {
    return new Promise((resolve) => {
      GoogleMapsManager.places.nearbySearch(
        { location: { lat, lng }, radius }, // you can add: type: "store" to filter
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
   * Main helper: from {lat,lng} get { address, name, placeId, types, phone, website, businessStatus }
   * Strategy:
   *  1) Reverse geocode → address + placeId
   *  2) If placeId → getDetails for name/types/etc.
   *  3) Else fallback to nearbySearch to guess nearest venue name
   */
  static async getAddressAndPlace(lat, lng) {
    try {
      const g = await GoogleMapsManager.geocodeLatLng(lat, lng);
      let details = null;

      if (g.placeId) {
        details = await GoogleMapsManager.getPlaceDetails(g.placeId);
      }
      if (!details) {
        // fallback to nearest place if details missing
        const near = await GoogleMapsManager.findNearestPlace(lat, lng, 50);
        if (near) {
          return {
            address: g.address ?? null,
          };
        }
      }

      // normal case (had placeId + details)
      return {
        address: g.address ?? null,
        name: details?.name ?? null,
        placeId: g.placeId ?? null,
        types: details?.types ?? [],
        phone: details?.phone ?? null,
        website: details?.website ?? null,
        businessStatus: details?.businessStatus ?? null,
      };
    } catch (e) {
      // If geocoding fails, we still try nearbySearch as a last resort
      return {
        name: near?.name ?? null,
        placeId: near?.placeId ?? null,
        error: e.message,
      };
    }
  }
}
