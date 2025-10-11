interface DistanceMatrixResult {
  distance: {
    miles: number;
    km: number;
  };
  duration: {
    minutes: number;
    text: string;
  };
  origin: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
}

interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export class GoogleMapsService {
  private isGoogleMapsLoaded(): boolean {
    return !!(window.google && window.google.maps);
  }

  async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    if (!address.trim()) {
      return null;
    }

    if (!this.isGoogleMapsLoaded()) {
      console.error('[GoogleMapsService] Google Maps SDK not loaded');
      return null;
    }

    try {
      const geocoder = new google.maps.Geocoder();

      const result = await new Promise<google.maps.GeocoderResult>((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      return {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng(),
        formattedAddress: result.formatted_address,
      };
    } catch (error) {
      console.error('[GoogleMapsService] Geocoding error:', error);
      return null;
    }
  }

  async calculateDistance(
    origin: string,
    destination: string
  ): Promise<DistanceMatrixResult | null> {
    if (!origin.trim() || !destination.trim()) {
      return null;
    }

    if (!this.isGoogleMapsLoaded()) {
      console.error('[GoogleMapsService] Google Maps SDK not loaded');
      return null;
    }

    try {
      const distanceMatrixService = new google.maps.DistanceMatrixService();

      const matrixResult = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
        distanceMatrixService.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
          },
          (response, status) => {
            if (status === google.maps.DistanceMatrixStatus.OK && response) {
              resolve(response);
            } else {
              reject(new Error(`Distance Matrix API error: ${status}`));
            }
          }
        );
      });

      if (
        !matrixResult.rows ||
        matrixResult.rows.length === 0 ||
        !matrixResult.rows[0].elements ||
        matrixResult.rows[0].elements.length === 0
      ) {
        console.warn('[GoogleMapsService] No results in distance matrix');
        return null;
      }

      const element = matrixResult.rows[0].elements[0];

      if (element.status !== google.maps.DistanceMatrixElementStatus.OK) {
        console.warn('[GoogleMapsService] Distance element status:', element.status);
        return null;
      }

      const distanceMeters = element.distance.value;
      const durationSeconds = element.duration.value;

      const [originGeocode, destGeocode] = await Promise.all([
        this.geocodeAddress(origin),
        this.geocodeAddress(destination)
      ]);

      if (!originGeocode || !destGeocode) {
        console.error('[GoogleMapsService] Failed to geocode origin or destination');
        return null;
      }

      return {
        distance: {
          miles: distanceMeters * 0.000621371,
          km: distanceMeters / 1000,
        },
        duration: {
          minutes: Math.round(durationSeconds / 60),
          text: element.duration.text,
        },
        origin: {
          lat: originGeocode.lat,
          lng: originGeocode.lng,
        },
        destination: {
          lat: destGeocode.lat,
          lng: destGeocode.lng,
        },
      };
    } catch (error) {
      console.error('[GoogleMapsService] Distance calculation error:', error);
      return null;
    }
  }

  async getPlaceAutocomplete(input: string): Promise<google.maps.places.AutocompletePrediction[]> {
    if (!input.trim()) {
      return [];
    }

    if (!this.isGoogleMapsLoaded() || !window.google.maps.places) {
      console.error('[GoogleMapsService] Google Maps Places SDK not loaded');
      return [];
    }

    try {
      const autocompleteService = new google.maps.places.AutocompleteService();

      const predictions = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
        autocompleteService.getPlacePredictions(
          {
            input,
            componentRestrictions: { country: 'us' },
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              resolve([]);
            } else {
              reject(new Error(`Autocomplete error: ${status}`));
            }
          }
        );
      });

      return predictions;
    } catch (error) {
      console.error('[GoogleMapsService] Autocomplete error:', error);
      return [];
    }
  }
}
