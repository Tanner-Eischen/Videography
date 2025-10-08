import { useState, useEffect, useCallback } from 'react';

interface DistanceResult {
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

interface UseDistanceCalculationOptions {
  debounceMs?: number;
  includeMetrics?: boolean;
}

export const useDistanceCalculation = (
  origin: string,
  destination: string,
  options: UseDistanceCalculationOptions = {}
) => {
  const { debounceMs = 1500, includeMetrics = true } = options;

  const [result, setResult] = useState<DistanceResult | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDistance = useCallback(async () => {
    if (!origin?.trim() || !destination?.trim()) {
      setResult(null);
      setDistance(null);
      setError(null);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      setError('Google Maps API key not configured');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const geocoder = window.google?.maps ? new google.maps.Geocoder() : null;

      if (!geocoder) {
        setError('Google Maps not loaded');
        setLoading(false);
        return;
      }

      const originGeocode = await new Promise<google.maps.GeocoderResult>((resolve, reject) => {
        geocoder.geocode({ address: origin }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error('Origin geocoding failed'));
          }
        });
      });

      const destGeocode = await new Promise<google.maps.GeocoderResult>((resolve, reject) => {
        geocoder.geocode({ address: destination }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error('Destination geocoding failed'));
          }
        });
      });

      const originCoords = {
        lat: originGeocode.geometry.location.lat(),
        lng: originGeocode.geometry.location.lng(),
      };

      const destCoords = {
        lat: destGeocode.geometry.location.lat(),
        lng: destGeocode.geometry.location.lng(),
      };

      const requestBody = {
        origin: {
          location: {
            latLng: {
              latitude: originCoords.lat,
              longitude: originCoords.lng,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: destCoords.lat,
              longitude: destCoords.lng,
            },
          },
        },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false,
          avoidFerries: false,
        },
        languageCode: 'en-US',
        units: 'IMPERIAL',
      };

      const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Routes API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        setError('No route found between the addresses.');
        setResult(null);
        setDistance(null);
        setLoading(false);
        return;
      }

      const route = data.routes[0];
      const distanceMeters = route.distanceMeters;
      const durationSeconds = parseInt(route.duration.replace('s', ''));

      const miles = distanceMeters * 0.000621371;
      const roundedMiles = Math.round(miles);
      const minutes = Math.round(durationSeconds / 60);
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      let durationText = '';
      if (hours > 0) {
        durationText = `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`;
      } else {
        durationText = `${minutes} min${minutes !== 1 ? 's' : ''}`;
      }

      setDistance(roundedMiles);

      if (includeMetrics) {
        setResult({
          distance: {
            miles: miles,
            km: distanceMeters / 1000,
          },
          duration: {
            minutes: minutes,
            text: durationText,
          },
          origin: originCoords,
          destination: destCoords,
        });
      }

      setError(null);
    } catch (err) {
      console.error('Distance calculation error:', err);
      setError('Failed to calculate distance. Please try again.');
      setResult(null);
      setDistance(null);
    } finally {
      setLoading(false);
    }
  }, [origin, destination, includeMetrics]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateDistance();
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [calculateDistance, debounceMs]);

  return { result, distance, loading, error, recalculate: calculateDistance };
};
