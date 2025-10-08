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
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    if (!address.trim()) {
      return null;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        return {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          formattedAddress: result.formatted_address,
        };
      }

      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
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

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&units=imperial&key=${this.apiKey}`
      );

      const data = await response.json();

      if (
        data.status === 'OK' &&
        data.rows.length > 0 &&
        data.rows[0].elements.length > 0
      ) {
        const element = data.rows[0].elements[0];

        if (element.status === 'OK') {
          const distanceMeters = element.distance.value;
          const durationSeconds = element.duration.value;

          const originGeocode = await this.geocodeAddress(origin);
          const destGeocode = await this.geocodeAddress(destination);

          if (!originGeocode || !destGeocode) {
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
        }
      }

      return null;
    } catch (error) {
      console.error('Distance calculation error:', error);
      return null;
    }
  }

  async getPlaceAutocomplete(input: string): Promise<any[]> {
    if (!input.trim()) {
      return [];
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${this.apiKey}`
      );

      const data = await response.json();

      if (data.status === 'OK') {
        return data.predictions;
      }

      return [];
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  }
}
