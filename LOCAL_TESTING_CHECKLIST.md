# Local Testing Checklist

Use this checklist to verify Google Maps API is working correctly in your local environment.

## Before You Start

- [ ] Ensure `.env` file exists with `VITE_GOOGLE_MAPS_API_KEY=your_key`
- [ ] Verify API key is NOT the placeholder value
- [ ] Restart dev server after any `.env` changes: `npm run dev`
- [ ] Open browser console (F12) to view debug logs

## Test 1: Google Maps Script Loading

**Expected Console Logs:**
```
[useGoogleMaps] Initializing Google Maps SDK
[useGoogleMaps] Google Maps loaded successfully
```

**If you see errors:**
- `API key is missing` → Check your .env file
- `Failed to load script` → Check your network connection and API key validity
- `RefererNotAllowedMapError` → Add localhost to API key restrictions (see GOOGLE_MAPS_SETUP.md)

## Test 2: Address Autocomplete

1. Navigate to "Create Quote" page
2. Go to "Project Information" step
3. Click on a location address field
4. Type at least 3 characters (e.g., "123 Main")

**Expected Results:**
- [ ] Dropdown appears with address suggestions
- [ ] Suggestions include street, city, state
- [ ] Clicking a suggestion fills the input field

**Expected Console Logs:**
```
[LocationInput] Initializing AutocompleteService
[LocationInput] Autocomplete status: OK predictions: 5
```

**If autocomplete fails:**
- Check console for `[LocationInput]` errors
- Verify "Places API" is enabled in Google Cloud Console
- Confirm API key has Places API restriction enabled

## Test 3: Distance Calculation

1. Stay on "Project Information" step
2. Enter a complete address in the first location field
3. Enter a different complete address in the second location field
4. Wait 1.5 seconds (debounce delay)

**Expected Results:**
- [ ] Loading spinner appears in distance badge
- [ ] Distance displays in miles (e.g., "15 miles to")
- [ ] Duration displays (e.g., "25 mins")
- [ ] Distance updates automatically when addresses change

**Expected Console Logs:**
```
[Distance Calculation] Starting calculation
[Distance Calculation] Success: { miles: 15, minutes: 25, ... }
```

**If distance calculation fails:**
- Check for `[Distance Calculation]` errors in console
- Verify "Distance Matrix API" is enabled in Google Cloud Console
- Ensure both addresses are valid and complete
- Check that API key has Distance Matrix API restriction enabled

## Test 4: Multiple Locations

1. Add multiple filming days
2. Add multiple locations per day
3. Verify distance calculation works between each location pair

**Expected Results:**
- [ ] Each location calculates distance from previous location
- [ ] First location shows "Starting Location" (no distance)
- [ ] All subsequent locations show distance and duration
- [ ] Calculations update when addresses change

## Common Issues & Solutions

### Issue: "Google Maps not loaded"
**Solution:**
1. Check browser console for script loading errors
2. Verify API key in .env file
3. Hard refresh browser (Ctrl+Shift+R)
4. Check Google Cloud Console for API key status

### Issue: No autocomplete suggestions
**Solution:**
1. Type at least 3 characters
2. Check that Places API is enabled
3. Verify API key restrictions include Places API
4. Look for console errors starting with `[LocationInput]`

### Issue: Distance shows 0 or doesn't update
**Solution:**
1. Wait for debounce (1.5 seconds after typing)
2. Ensure both addresses are complete and valid
3. Check Distance Matrix API is enabled
4. Look for console errors starting with `[Distance Calculation]`

### Issue: "REQUEST_DENIED" errors
**Solution:**
1. Check all required APIs are enabled:
   - Maps JavaScript API
   - Places API
   - Distance Matrix API
   - Geocoding API
2. Verify API restrictions in Google Cloud Console
3. Confirm HTTP referrers include `http://localhost:*`

## Network Debugging

Open DevTools → Network Tab:

1. **Filter by:** `maps.googleapis.com`
2. **Check for:**
   - Script load: `maps/api/js?key=...` → Status 200
   - No CORS errors (should not see REST API calls)
3. **If you see errors:**
   - 403: API key restrictions issue
   - 400: Malformed request
   - 404: Endpoint not found (shouldn't happen with SDK)

## Success Criteria

Your Google Maps integration is working correctly if:

- ✅ Console shows successful Google Maps load
- ✅ Address fields show autocomplete suggestions
- ✅ Distance calculations work between locations
- ✅ No console errors related to Google Maps
- ✅ UI updates smoothly without freezing

## Still Having Issues?

1. Check `GOOGLE_MAPS_SETUP.md` for detailed configuration steps
2. Verify all API keys and restrictions in Google Cloud Console
3. Clear browser cache and restart dev server
4. Test your API key directly in browser:
   ```
   https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places
   ```

## Performance Tips

- Autocomplete debounces after 3 characters (no API calls for 1-2 chars)
- Distance calculation debounces for 1.5 seconds
- Multiple simultaneous calculations are handled efficiently
- Console logs can be removed in production for better performance
