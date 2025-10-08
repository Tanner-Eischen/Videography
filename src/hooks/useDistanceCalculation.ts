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

export const useDistanceCalculation = (origin: string, destination: string) => {
  const [result, setResult] = useState<DistanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDistance = useCallback(async () => {
    if (!origin.trim() || !destination.trim()) {
      setResult(null);
      setError(null);
      return;
    }

    if (!window.google || !window.google.maps) {
      setError('Google Maps is not loaded');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const service = new google.maps.DistanceMatrixService();
      const geocoder = new google.maps.Geocoder();

      const distanceResult = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
        service.getDistanceMatrix(
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
              reject(new Error(`Distance Matrix failed: ${status}`));
            }
          }
        );
      });

      const element = distanceResult.rows[0]?.elements[0];

      if (!element || element.status !== 'OK') {
        setError('Unable to calculate distance. Please check the addresses.');
        setResult(null);
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

      const distanceMeters = element.distance.value;
      const durationSeconds = element.duration.value;

      setResult({
        distance: {
          miles: distanceMeters * 0.000621371,
          km: distanceMeters / 1000,
        },
        duration: {
          minutes: Math.round(durationSeconds / 60),
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

      setError(null);
    } catch (err) {
      console.error('Distance calculation error:', err);
      setError('Failed to calculate distance. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [origin, destination]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateDistance();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [calculateDistance]);

  return { result, loading, error, recalculate: calculateDistance };
};
