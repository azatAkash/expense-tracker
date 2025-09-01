// src/utils/GoogleMapsManager.js
const GoogleMapsManager = {
  map: null,
  _placeCache: new Map(),
  _markers: new Set(), // keep references so we can clear/remove

  // in GoogleMapsManager
  _readyPromise: null,
  _readyResolve: null,
  _activeInfoWindow: null,
  _infoCssInjected: false,

  waitForMap() {
    if (this.map) return Promise.resolve(this.map);
    if (!this._readyPromise) {
      this._readyPromise = new Promise((res) => (this._readyResolve = res));
    }
    return this._readyPromise;
  },

  init(container, opts = {}) {
    if (!window.google?.maps) throw new Error("Google Maps script not loaded");
    if (!this.map) {
      const {
        center = { lat: 51.09, lng: 71.4 },
        zoom = 17,
        tilt = 60,
        mapId,
      } = opts;
      this.map = new google.maps.Map(container, { center, zoom, mapId, tilt });
      this._readyResolve?.(this.map); // 👈 resolve “ready”
    }
    return this.map;
  },

  setCenter(lat, lng) {
    this.map?.setCenter({ lat, lng });
  },

  // ---------- helpers ----------
  async _ensurePlacesLib() {
    if (!window.google?.maps) throw new Error("Google Maps script not loaded");
    const { Place } = await google.maps.importLibrary("places");
    return { Place };
  },

  async _ensureMarkerLib() {
    if (!window.google?.maps) throw new Error("Google Maps script not loaded");
    const { AdvancedMarkerElement, PinElement } =
      await google.maps.importLibrary("marker");
    return { AdvancedMarkerElement, PinElement };
  },

  _normalizeDisplayName(val) {
    if (!val) return null;
    if (typeof val === "string") return val;
    if (typeof val?.text === "string") return val.text;
    return null;
  },

  _normalizeLocation(loc) {
    if (!loc) return null;
    const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
    const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  },

  // ---------- custom marker factory ----------
  /**
   * Create a circular money marker like in the screenshot.
   * Returns the AdvancedMarkerElement instance.
   */
  async addMoneyMarker(lat, lng, opts = {}) {
    if (!this.map) throw new Error("Map is not initialized");
    const {
      size = 40, // diameter in px
      label = "$", // glyph text
      bg = "#e53935", // red center
      ring = "#ffb300", // yellow ring
      textColor = "#fff", // glyph color
      ringWidth = 5,
      shadow = true,
      zIndex,
      draggable = false,
      onClick,
    } = opts;

    const { AdvancedMarkerElement } = await this._ensureMarkerLib();

    // build HTML content
    const el = document.createElement("div");
    el.className = "gm-money-marker";
    Object.assign(el.style, {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: bg,
      border: `${ringWidth}px solid ${ring}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: textColor,
      fontWeight: "700",
      fontFamily:
        "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      fontSize: `${Math.round(size * 0.5)}px`,
      lineHeight: "1",
      boxShadow: shadow ? "0 8px 18px rgba(0,0,0,.35)" : "none",
      transform: "translateZ(0)", // avoid blurriness
    });
    el.textContent = label;

    const marker = new AdvancedMarkerElement({
      map: this.map,
      position: { lat, lng },
      content: el,
      zIndex,
      gmpClickable: Boolean(onClick),
      draggable,
    });

    // housekeeping
    this._markers.add(marker);
    marker.addListener("map_changed", () => {
      if (!marker.map) this._markers.delete(marker);
    });
    if (onClick) marker.addListener("click", onClick);

    return marker;
  },

  setMarkerPosition(marker, lat, lng) {
    if (!marker) return;
    marker.position = { lat, lng }; // AdvancedMarkerElement setter
  },

  removeMarker(marker) {
    if (!marker) return;
    try {
      marker.map = null; // detach
      this._markers.delete(marker);
    } catch {}
  },

  clearMarkers() {
    for (const m of this._markers) {
      try {
        m.map = null;
      } catch {}
    }
    this._markers.clear();
  },

  // ---------- (your existing place search code below) ----------
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

  _mapPlaceSummary(p) {
    const name =
      this._normalizeDisplayName(p.displayName) ??
      (typeof p.name === "string" ? p.name : null);
    return {
      id: p.id || null,
      name,
      address: p.formattedAddress || null,
      location: this._normalizeLocation(p.location),
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
        } catch {}
      })
    );
    return results;
  },

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
    // @ts-ignore
    const { places = [] } = await Place.searchByText(request);
    let results = places.map((p) => this._mapPlaceSummary(p));
    if (ensureName) results = await this._fillMissingNames(results, Place);
    return results;
  },

  _closeActiveInfo() {
    try {
      this._activeInfoWindow?.close();
    } catch {}
    this._activeInfoWindow = null;
  },

  // inject once; tweak sizes/colors as you like
  _injectInfoCss() {
    if (this._infoCssInjected) return;
    const css = `
  .exp-iw { width: 360px; border-radius: 16px; overflow: hidden; }
  .exp-iw__head { background:#1a73e8; color:#fff; padding:12px 16px; }
  .exp-iw__row { display:flex; align-items:center; justify-content:space-between; }
  .exp-iw__amount { font-weight:800; font-size:22px; letter-spacing:.2px; }
  .exp-iw__close { width:28px; height:28px; border-radius:50%; background:rgba(255,255,255,.2);
                   display:flex; align-items:center; justify-content:center; cursor:pointer; }
  .exp-iw__meta { margin-top:6px; opacity:.92; font-weight:600; font-size:13px; }
  .exp-iw__body { background:#fff; color:#222; padding:14px 16px; }
  .exp-iw__title { font-size:18px; font-weight:700; margin-bottom:8px; }
  .exp-iw__place { display:flex; align-items:center; gap:8px; color:#5f6368; font-size:14px; }
  .exp-iw__dot { width:8px; height:8px; border-radius:50%; background:#5f6368; }
  `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    this._infoCssInjected = true;
  },

  _formatUSD(cents) {
    if (!Number.isFinite(cents)) return "$0.00";
    return `$${(cents / 100).toFixed(2)}`;
  },

  _formatTimeHHmm(hhmm) {
    // "0915" -> "09:15" (24h). Adjust to your formatter if needed.
    if (!hhmm || String(hhmm).length < 4) return "";
    const h = Number(String(hhmm).slice(0, 2));
    const m = Number(String(hhmm).slice(2, 4));
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  },

  /**
   * Build & open a styled info window anchored to a marker.
   * expense: { amountUSDCents, category, time, note, placeName }
   */
  openExpenseInfo(marker, expense = {}) {
    if (!this.map || !marker) return;
    this._injectInfoCss();
    this._closeActiveInfo();

    const {
      amountUSDCents = 0,
      category = "",
      time = "",
      note = "",
      placeName = "",
    } = expense;

    const wrap = document.createElement("div");
    wrap.className = "exp-iw";
    wrap.innerHTML = `
    <div class="exp-iw__head">
      <div class="exp-iw__row">
        <div class="exp-iw__amount">${this._formatUSD(amountUSDCents)}</div>
        <div class="exp-iw__close" aria-label="Close">✕</div>
      </div>
      <div class="exp-iw__meta">${category || ""}${category && time ? " • " : ""}${this._formatTimeHHmm(time) || ""}</div>
    </div>
    <div class="exp-iw__body">
      <div class="exp-iw__title">${this._escape(note || "Expense")}</div>
      <div class="exp-iw__place"><span class="exp-iw__dot"></span>${this._escape(placeName || "Unknown place")}</div>
    </div>
  `;

    this._showInfoWindowAt(marker, wrap);
  },

  // add this small escape util next to other helpers:
  _escape(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c]
    );
  },

  /* finally, still inside GoogleMapsManager: */
  _showInfoWindowAt(marker, content) {
    const iw = new google.maps.InfoWindow({ content });
    iw.open({ map: this.map, anchor: marker, shouldFocus: false });
    iw.addListener("domready", () => {
      const root = this.map.getDiv();
      // The close button has class 'gm-ui-hover-effect'
      const closeBtn = root.querySelector(".gm-ui-hover-effect");
      if (closeBtn) closeBtn.style.display = "none";
    });
    this._activeInfoWindow = iw;
    const btn = content.querySelector?.(".exp-iw__close");
    btn?.addEventListener("click", () => this._closeActiveInfo());
  },
};

export default GoogleMapsManager;
