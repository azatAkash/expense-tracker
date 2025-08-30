// src/utils/GoogleMapsManager.js
export default class GoogleMapsManager {
  static #loaded = false;

  static async ensureLoaded() {
    if (!this.#loaded) {
      if (!window.google?.maps?.importLibrary) {
        throw new Error("Google Maps JS API не подключен в index.html");
      }
      this.#loaded = true;
    }
    return google.maps;
  }

  static async getMapLib() {
    await this.ensureLoaded();
    const { Map } = await google.maps.importLibrary("maps");
    return { Map };
  }

  static async getGeocodingLib() {
    await this.ensureLoaded();
    const { Geocoder } = await google.maps.importLibrary("geocoding");
    return { Geocoder };
  }

  static async getMarkerLib() {
    await this.ensureLoaded();
    const { AdvancedMarkerElement, PinElement } =
      await google.maps.importLibrary("marker");
    return { AdvancedMarkerElement, PinElement, Marker: google.maps.Marker };
  }

  static async getPlacesLib() {
    await this.ensureLoaded();
    const { PlacesService } = await google.maps.importLibrary("places");
    return { PlacesService };
  }
}
