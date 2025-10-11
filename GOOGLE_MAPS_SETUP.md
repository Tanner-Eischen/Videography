# Google Maps API Setup Guide

This guide will help you configure your Google Maps API key to work with both local development and production environments.

## Problem

The Google Maps API may work in some environments but fail locally due to:
- API key restrictions blocking localhost
- Missing required APIs
- CORS restrictions when using REST endpoints directly

## Solution

We've updated the application to use the Google Maps JavaScript SDK exclusively, which eliminates CORS issues. However, you still need to configure your API key properly.

## Step 1: Enable Required APIs

Go to the [Google Cloud Console](https://console.cloud.google.com/) and enable these APIs:

1. **Maps JavaScript API** - Required for the core SDK
2. **Places API** - Required for address autocomplete
3. **Distance Matrix API** - Required for distance calculations
4. **Geocoding API** - Required for address-to-coordinates conversion

### How to enable APIs:
1. Navigate to "APIs & Services" > "Library"
2. Search for each API name above
3. Click on it and press "Enable"

## Step 2: Configure API Key Restrictions

### Application Restrictions

1. Go to [API Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your API key
3. Under "Application restrictions", select **"HTTP referrers (web sites)"**
4. Add these referrer URLs:

```
http://localhost:*
http://127.0.0.1:*
https://yourdomain.com/*
https://*.yourdomain.com/*
```

Replace `yourdomain.com` with your actual production domain.

### API Restrictions

1. In the same API key settings page
2. Under "API restrictions", select **"Restrict key"**
3. Select only the APIs you're using:
   - Maps JavaScript API
   - Places API
   - Distance Matrix API
   - Geocoding API

## Step 3: Update Your Environment Variables

Ensure your `.env` file has the correct API key:

```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Important:**
- Never commit your `.env` file to version control
- Use the `VITE_` prefix for all Vite environment variables
- Restart your dev server after changing environment variables

## Step 4: Test Your Setup

### In Browser Console

Open your browser's developer console (F12) and look for logs starting with:
- `[useGoogleMaps]` - Script loading status
- `[LocationInput]` - Autocomplete functionality
- `[Distance Calculation]` - Distance matrix calculations

### Expected Flow

1. You should see: `[useGoogleMaps] Google Maps loaded successfully`
2. When typing in address fields: `[LocationInput] Autocomplete status: OK predictions: X`
3. When calculating distance: `[Distance Calculation] Success: {...}`

### Common Errors

#### "RefererNotAllowedMapError"
- Your localhost/domain is not in the HTTP referrers list
- Solution: Add `http://localhost:*` to referrers

#### "ApiNotActivatedMapError"
- Required API is not enabled in Google Cloud Console
- Solution: Enable all required APIs listed in Step 1

#### "Google Maps not loaded"
- Script failed to load or API key is invalid
- Solution: Check browser console for specific error, verify API key

#### "REQUEST_DENIED"
- API restrictions are too strict or API not enabled
- Solution: Check API restrictions and ensure all required APIs are enabled

## Troubleshooting

### Clear browser cache
Sometimes old scripts are cached. Try:
1. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. Clear browser cache and reload

### Check Network Tab
1. Open DevTools > Network tab
2. Filter by "maps.googleapis.com"
3. Check if script loads successfully (200 status)
4. Check API calls for error responses

### Verify API Key
Test your API key directly:
```
https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places
```

If this loads without errors in your browser, the key is valid.

## Development vs Production

### Development (Local)
- Uses `http://localhost:5173` (Vite default)
- Referrer: `http://localhost:*`
- Console logs are enabled for debugging

### Production
- Uses your actual domain
- Referrer: `https://yourdomain.com/*`
- Consider disabling detailed console logs for performance

## Best Practices

1. **Use separate API keys** for development and production
2. **Set quotas** to prevent unexpected charges
3. **Monitor usage** in Google Cloud Console
4. **Rotate keys** periodically for security
5. **Never expose keys** in public repositories

## Support

If you continue to experience issues:
1. Check the browser console for detailed error logs
2. Verify all APIs are enabled in Google Cloud Console
3. Confirm HTTP referrers include your domain/localhost
4. Ensure your API key is active and not expired

## References

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Distance Matrix API Documentation](https://developers.google.com/maps/documentation/distance-matrix)
