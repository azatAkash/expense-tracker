// src/utils/GoogleMapsManager.js
const GoogleMapsManager = {
  map: null,
  _placeCache: new Map(),

  init(
    container,
    { center = { lat: 51.09, lng: 71.4 }, zoom = 17, tilt = 60, mapId } = {}
  ) {
    if (!window.google?.maps) throw new Error("Google Maps script not loaded");
    if (!this.map) {
      this.map = new google.maps.Map(container, { center, zoom, mapId, tilt });
    }
    return this.map;
  },

  setCenter(lat, lng) {
    this.map?.setCenter({ lat, lng });
  },

  // tiny helper to normalize displayName shape
  _normalizeDisplayName(val) {
    if (!val) return null;
    if (typeof val === "string") return val; // sometimes it's a string
    if (typeof val?.text === "string") return val.text; // sometimes it's LocalizedText
    return null;
  },

  async textSearchNear(
    textQuery,
    lat,
    lng,
    {
      includedType, // e.g. "restaurant"
      maxResultCount = 3,
      ensureName = false,
    } = {}
  ) {
    if (!window.google?.maps) {
      throw new Error("Google Maps script not loaded");
    }

    const { Place } = await google.maps.importLibrary("places");

    const request = {
      textQuery,
      fields: [
        "id",
        "displayName",
        "formattedAddress",
        "location",
        "types",
        "businessStatus",
        "rating",
        "userRatingCount",
      ],
      locationBias: { lat, lng },
      maxResultCount,
    };
    if (includedType) request.includedType = includedType;

    // @ts-ignore (types may lag)
    const { places = [] } = await Place.searchByText(request);

    // map first with robust name extraction
    let results = places.map((p) => {
      const name =
        this._normalizeDisplayName(p.displayName) ??
        // legacy fallback (older typings/objects)
        (typeof p.name === "string" ? p.name : null);

      return {
        id: p.id || null,
        name,
        address: p.formattedAddress || null,
        location: p.location || null,
        types: p.types || [],
        businessStatus: p.businessStatus || null,
        rating: p.rating ?? null,
        userRatingCount: p.userRatingCount ?? null,
      };
    });

    // Optional: fetch details to fill missing names (extra request, extra quota)
    if (ensureName) {
      const missing = results.filter((r) => !r.name && r.id);
      if (missing.length) {
        await Promise.all(
          missing.map(async (r) => {
            try {
              const place = new Place({ id: r.id });
              await place.fetchFields({ fields: ["displayName"] });
              r.name = this._normalizeDisplayName(place.displayName) || r.name;
            } catch {}
          })
        );
      }
    }

    return results;
  },
};

export default GoogleMapsManager;
