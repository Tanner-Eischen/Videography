import { useEffect, useState } from 'react';

interface UseGoogleMapsOptions {
  apiKey: string;
}

export const useGoogleMaps = ({ apiKey }: UseGoogleMapsOptions) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (!apiKey) {
      console.error('[useGoogleMaps] API key is missing');
      setLoadError(new Error('Google Maps API key is required'));
      return;
    }

    if (apiKey === 'YOUR_API_KEY_HERE') {
      console.error('[useGoogleMaps] API key is placeholder value');
      setLoadError(new Error('Google Maps API key not configured'));
      return;
    }

    console.log('[useGoogleMaps] Initializing Google Maps SDK');

    if (window.google && window.google.maps) {
      console.log('[useGoogleMaps] Google Maps already loaded');
      setIsLoaded(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com/maps/api"]`
    );

    if (existingScript) {
      console.log('[useGoogleMaps] Script tag exists, waiting for load');
      let attempts = 0;
      const maxAttempts = 50;
      const checkIfLoaded = setInterval(() => {
        attempts++;
        if (window.google && window.google.maps) {
          console.log('[useGoogleMaps] Google Maps loaded successfully');
          setIsLoaded(true);
          clearInterval(checkIfLoaded);
        } else if (attempts >= maxAttempts) {
          console.error('[useGoogleMaps] Timeout waiting for Google Maps to load');
          setLoadError(new Error('Timeout loading Google Maps'));
          clearInterval(checkIfLoaded);
        }
      }, 100);

      return () => clearInterval(checkIfLoaded);
    }

    console.log('[useGoogleMaps] Creating new script tag');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.maps) {
        console.log('[useGoogleMaps] Script loaded successfully');
        setIsLoaded(true);
      } else {
        console.error('[useGoogleMaps] Script loaded but google.maps not available');
        setLoadError(new Error('Google Maps object not found after script load'));
      }
    };

    script.onerror = (event) => {
      console.error('[useGoogleMaps] Failed to load script:', event);
      setLoadError(new Error('Failed to load Google Maps script. Check your API key and network connection.'));
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [apiKey]);

  useEffect(() => {
    if (loadError) {
      console.error('[useGoogleMaps] Load error:', loadError.message);
    }
  }, [loadError]);

  return { isLoaded, loadError };
};
