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

  // inside GoogleMapsManager

  // --- helpers ---

  async _ensurePlacesLib() {
    if (!window.google?.maps) throw new Error("Google Maps script not loaded");
    const { Place } = await google.maps.importLibrary("places");
    return { Place };
  },

  _buildTextSearchRequest(
    textQuery,
    lat,
    lng,
    { includedType, maxResultCount }
  ) {
    if (!textQuery || typeof textQuery !== "string") {
      throw new Error("textQuery is required");
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new Error("Invalid coordinates");
    }

    const req = {
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
      maxResultCount: maxResultCount ?? 3,
    };
    if (includedType) req.includedType = includedType;

    return req;
  },

  _normalizeDisplayName(val) {
    if (!val) return null;
    if (typeof val === "string") return val;
    if (typeof val?.text === "string") return val.text;
    return null;
  },

  _mapPlaceSummary(p) {
    const name =
      this._normalizeDisplayName(p.displayName) ??
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
  },

  async _fillMissingNames(results, Place) {
    const missing = results.filter((r) => !r.name && r.id);
    if (!missing.length) return results;

    await Promise.all(
      missing.map(async (r) => {
        try {
          const place = new Place({ id: r.id });
          await place.fetchFields({ fields: ["displayName"] });
          r.name = this._normalizeDisplayName(place.displayName) || r.name;
        } catch {
          /* noop */
        }
      })
    );
    return results;
  },

  // --- public API ---

  async textSearchNear(
    textQuery,
    lat,
    lng,
    { includedType, maxResultCount = 3, ensureName = false } = {}
  ) {
    const { Place } = await this._ensurePlacesLib();
    const request = this._buildTextSearchRequest(textQuery, lat, lng, {
      includedType,
      maxResultCount,
    });

    // @ts-ignore (types may lag)
    const { places = [] } = await Place.searchByText(request);

    let results = places.map((p) => this._mapPlaceSummary(p));

    if (ensureName) {
      results = await this._fillMissingNames(results, Place);
    }

    return results;
  },
};

export default GoogleMapsManager;
