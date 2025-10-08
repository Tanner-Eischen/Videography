import { useState, useEffect } from 'react';

export const useLocationDistance = (originAddress: string, destinationAddress: string) => {
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateDistance = async () => {
      if (!originAddress?.trim() || !destinationAddress?.trim()) {
        setDistance(null);
        setError(null);
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        setError('API key not configured');
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
          geocoder.geocode({ address: originAddress }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              resolve(results[0]);
            } else {
              reject(new Error('Origin geocoding failed'));
            }
          });
        });

        const destGeocode = await new Promise<google.maps.GeocoderResult>((resolve, reject) => {
          geocoder.geocode({ address: destinationAddress }, (results, status) => {
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
          languageCode: 'en-US',
          units: 'IMPERIAL',
        };

        const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'routes.distanceMeters',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`Routes API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.routes || data.routes.length === 0) {
          setError('No route found');
          setDistance(null);
          setLoading(false);
          return;
        }

        const distanceMeters = data.routes[0].distanceMeters;
        const miles = Math.round(distanceMeters * 0.000621371);

        setDistance(miles);
        setError(null);
      } catch (err) {
        console.error('Distance calculation error:', err);
        setError('Failed to calculate');
        setDistance(null);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      calculateDistance();
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [originAddress, destinationAddress]);

  return { distance, loading, error };
};
