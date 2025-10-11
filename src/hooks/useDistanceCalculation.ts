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
      console.error('[Distance Calculation] API key not configured');
      setError('Google Maps API key not configured');
      return;
    }

    if (!window.google?.maps) {
      console.error('[Distance Calculation] Google Maps SDK not loaded');
      setError('Google Maps not loaded. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[Distance Calculation] Starting calculation', { origin, destination });

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
              console.error('[Distance Calculation] Distance Matrix failed:', status);
              reject(new Error(`Distance Matrix API error: ${status}`));
            }
          }
        );
      });

      if (!matrixResult.rows || matrixResult.rows.length === 0) {
        console.warn('[Distance Calculation] No results in matrix response');
        setError('No route found between the addresses.');
        setResult(null);
        setDistance(null);
        setLoading(false);
        return;
      }

      const element = matrixResult.rows[0].elements[0];

      if (element.status !== google.maps.DistanceMatrixElementStatus.OK) {
        console.error('[Distance Calculation] Element status error:', element.status);
        setError('Could not calculate distance between these addresses.');
        setResult(null);
        setDistance(null);
        setLoading(false);
        return;
      }

      const distanceMeters = element.distance.value;
      const durationSeconds = element.duration.value;
      const miles = distanceMeters * 0.000621371;
      const roundedMiles = Math.round(miles);
      const minutes = Math.round(durationSeconds / 60);

      console.log('[Distance Calculation] Success:', {
        miles: roundedMiles,
        minutes,
        distance: element.distance.text,
        duration: element.duration.text
      });

      setDistance(roundedMiles);

      if (includeMetrics) {
        const geocoder = new google.maps.Geocoder();

        const [originGeocode, destGeocode] = await Promise.all([
          new Promise<google.maps.GeocoderResult>((resolve, reject) => {
            geocoder.geocode({ address: origin }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                resolve(results[0]);
              } else {
                reject(new Error('Origin geocoding failed'));
              }
            });
          }),
          new Promise<google.maps.GeocoderResult>((resolve, reject) => {
            geocoder.geocode({ address: destination }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                resolve(results[0]);
              } else {
                reject(new Error('Destination geocoding failed'));
              }
            });
          })
        ]);

        setResult({
          distance: {
            miles: miles,
            km: distanceMeters / 1000,
          },
          duration: {
            minutes: minutes,
            text: element.duration.text,
          },
          origin: {
            lat: originGeocode.geometry.location.lat(),
            lng: originGeocode.geometry.location.lng(),
          },
          destination: {
            lat: destGeocode.geometry.location.lat(),
            lng: destGeocode.geometry.location.lng(),
          },
        });
      }

      setError(null);
    } catch (err) {
      console.error('[Distance Calculation] Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate distance';
      setError(errorMessage);
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
