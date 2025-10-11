# Google Maps API Setup Guide

This guide will help you configure your Google Maps API key to work with both local development and Netlify production environments.

## Table of Contents

- [Quick Start](#quick-start)
- [Problem](#problem)
- [Solution](#solution)
- [Step 1: Enable Required APIs](#step-1-enable-required-apis)
- [Step 2: Configure API Key Restrictions](#step-2-configure-api-key-restrictions)
- [Step 3: Update Your Environment Variables](#step-3-update-your-environment-variables)
  - [For Local Development](#for-local-development)
  - [For Netlify Deployment](#for-netlify-deployment)
- [Step 4: Test Your Setup](#step-4-test-your-setup)
- [Troubleshooting](#troubleshooting)
- [Development vs Production](#development-vs-production)
- [Netlify-Specific Testing and Verification](#netlify-specific-testing-and-verification)
- [Best Practices](#best-practices)
- [Quick Reference Checklist](#quick-reference-checklist)
- [Continuous Deployment Notes](#continuous-deployment-notes)
- [Additional Resources](#additional-resources)
- [Support](#support)

## Quick Start

For the impatient, here's the fastest way to get Google Maps working on both local and Netlify:

1. **Enable APIs:** Go to [Google Cloud Console](https://console.cloud.google.com/apis/library) and enable: Maps JavaScript API, Places API, Distance Matrix API, and Geocoding API

2. **Configure Referrers:** In [API Credentials](https://console.cloud.google.com/apis/credentials), add these HTTP referrers:
   ```
   http://localhost:*
   https://vidquo.netlify.app/*
   https://deploy-preview-*--vidquo.netlify.app/*
   https://*--vidquo.netlify.app/*
   ```

3. **Local Setup:** Add to `.env` file:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. **Netlify Setup:** Add environment variable in [Netlify UI](https://app.netlify.com/sites/vidquo/configuration/env):
   - Key: `VITE_GOOGLE_MAPS_API_KEY`
   - Value: Your API key
   - Scope: Builds

5. **Deploy:** Push to Git or trigger a manual deploy in Netlify

6. **Verify:** Test on both `localhost` and `vidquo.netlify.app`

For detailed instructions, continue reading below.

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
https://vidquo.netlify.app/*
https://deploy-preview-*--vidquo.netlify.app/*
https://*--vidquo.netlify.app/*
```

**Explanation:**
- `http://localhost:*` - For local development
- `http://127.0.0.1:*` - Alternative localhost address
- `https://vidquo.netlify.app/*` - Production Netlify site
- `https://deploy-preview-*--vidquo.netlify.app/*` - Netlify deploy previews for pull requests
- `https://*--vidquo.netlify.app/*` - Netlify branch deploys (e.g., `https://dev--vidquo.netlify.app/`)

### API Restrictions

1. In the same API key settings page
2. Under "API restrictions", select **"Restrict key"**
3. Select only the APIs you're using:
   - Maps JavaScript API
   - Places API
   - Distance Matrix API
   - Geocoding API

## Step 3: Update Your Environment Variables

### For Local Development

Ensure your `.env` file has the correct API key:

```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Important:**
- Never commit your `.env` file to version control
- Use the `VITE_` prefix for all Vite environment variables
- Restart your dev server after changing environment variables

### For Netlify Deployment

You must configure the API key in Netlify's dashboard for production and preview deployments.

**Option 1: Using Netlify UI (Recommended)**

1. Go to your [Netlify site dashboard](https://app.netlify.com/sites/vidquo/configuration/env)
2. Navigate to **Site configuration > Environment variables**
3. Click **Add a variable** or **Add variable**
4. Set the following:
   - **Key:** `VITE_GOOGLE_MAPS_API_KEY`
   - **Values:** Your Google Maps API key
   - **Scopes:** Select **Builds** (required for Vite to access during build time)
   - **Deploy contexts:** Choose the contexts where you want the key available:
     - **Production** - For main site deployment
     - **Deploy Previews** - For pull request previews
     - **Branch deploys** - For specific branch deployments
5. Click **Create variable** or **Save**

**Option 2: Using Netlify CLI**

```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site (if not already linked)
netlify link

# Set environment variable
netlify env:set VITE_GOOGLE_MAPS_API_KEY "your_actual_api_key_here"

# Or import from your local .env file
netlify env:import .env
```

**Option 3: Using netlify.toml Configuration File**

Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

# Note: For sensitive values like API keys, use Netlify UI instead
# This is only for demonstration - DO NOT commit API keys to version control
[context.production.environment]
  # VITE_GOOGLE_MAPS_API_KEY = "set_this_in_netlify_ui"

[context.deploy-preview.environment]
  # VITE_GOOGLE_MAPS_API_KEY = "set_this_in_netlify_ui"
```

**Security Note:** While you can set environment variables in `netlify.toml`, it's NOT recommended for sensitive values like API keys since this file is committed to version control. Always use the Netlify UI or CLI for sensitive values.

**Important Notes:**
- Environment variable changes require a new build and deploy to take effect
- Netlify does NOT read `.env` files during build - you must set variables in Netlify's dashboard or CLI
- The `VITE_` prefix makes the variable available to client-side code during build time
- After adding or changing variables, trigger a new deploy from the Netlify dashboard or push new code

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
- Environment variables from `.env` file
- Console logs are enabled for debugging

### Production (Netlify)
- Production URL: `https://vidquo.netlify.app`
- Deploy Preview URLs: `https://deploy-preview-*--vidquo.netlify.app`
- Branch Deploy URLs: `https://*--vidquo.netlify.app`
- Referrers configured in Google Cloud Console
- Environment variables from Netlify dashboard
- Consider disabling detailed console logs for performance

### Key Differences

| Aspect | Local Development | Netlify Production |
|--------|------------------|-------------------|
| Environment Variables | Read from `.env` file | Set in Netlify dashboard |
| URL | `localhost:5173` | `vidquo.netlify.app` |
| Build Process | `npm run dev` | `npm run build` (automated) |
| API Key Source | Local `.env` | Netlify environment variables |
| Deployment | Manual restart | Automatic on git push |

## Netlify-Specific Testing and Verification

### Verifying Environment Variables in Netlify

After setting up your environment variables, verify they're correctly configured:

1. **Check Build Logs:**
   - Go to your [Netlify deploys dashboard](https://app.netlify.com/sites/vidquo/deploys)
   - Click on the latest deploy
   - Look for any environment variable related errors in the build log
   - Vite will show warnings if environment variables are missing

2. **Test in Deploy Preview:**
   - Create a pull request or branch
   - Netlify will automatically create a deploy preview
   - Test Google Maps functionality in the preview URL before merging to production
   - Check browser console for any API key errors

3. **Verify in Production:**
   - After deploying to production, visit `https://vidquo.netlify.app`
   - Open browser DevTools (F12) and check the Console tab
   - Look for `[useGoogleMaps] Google Maps loaded successfully`
   - Test address autocomplete and distance calculations

4. **Check Network Requests:**
   - Open DevTools > Network tab
   - Filter by "maps.googleapis.com"
   - Verify requests return 200 status codes
   - If you see 403 errors, check your HTTP referrer configuration

### Triggering a Rebuild After Environment Variable Changes

If you add or modify environment variables in Netlify:

1. **Option 1: Via Netlify UI**
   - Go to [Deploys](https://app.netlify.com/sites/vidquo/deploys)
   - Click **Trigger deploy > Deploy site**
   - Wait for build to complete

2. **Option 2: Via Git Push**
   - Make any small change to your repository
   - Commit and push to trigger automatic deployment

3. **Option 3: Via Netlify CLI**
   ```bash
   netlify deploy --prod
   ```

### Common Netlify Deployment Issues

#### Issue: "API key is undefined in production"
**Symptoms:** Google Maps works locally but not on Netlify
**Solution:**
1. Verify the environment variable is set in Netlify UI with the exact name: `VITE_GOOGLE_MAPS_API_KEY`
2. Ensure the **Builds** scope is selected
3. Check that the variable is available in the correct deploy context (Production/Deploy Preview)
4. Trigger a new deploy after setting the variable

#### Issue: "RefererNotAllowedMapError on Netlify"
**Symptoms:** Maps API rejects requests from Netlify URLs
**Solution:**
1. Go to [Google Cloud Console API Credentials](https://console.cloud.google.com/apis/credentials)
2. Add these referrers:
   - `https://vidquo.netlify.app/*`
   - `https://deploy-preview-*--vidquo.netlify.app/*`
   - `https://*--vidquo.netlify.app/*`
3. Save and wait a few minutes for changes to propagate

#### Issue: "Build succeeds but maps don't load"
**Symptoms:** No console errors, but maps don't initialize
**Solution:**
1. Check if the API key is actually being injected: look for it in browser console
2. Verify all required Google Maps APIs are enabled (Maps JavaScript API, Places API, Distance Matrix API, Geocoding API)
3. Check browser Network tab for failed API requests
4. Ensure your Google Cloud project has billing enabled

#### Issue: "Environment variable not found during build"
**Symptoms:** Build logs show `undefined` for the API key
**Solution:**
1. Verify the variable name has the `VITE_` prefix
2. Check that variable is available in the Build scope
3. Ensure you're checking the correct deploy context
4. List environment variables via CLI: `netlify env:list`

## Best Practices

### For Local Development
1. **Keep `.env` file local** - Never commit it to version control
2. **Use `.env.example`** - Create a template file with placeholder values for team members
3. **Add to `.gitignore`** - Ensure `.env` is listed in your `.gitignore` file

### For Netlify Production
1. **Use separate API keys** for development and production environments
2. **Enable "Contains secret values"** - Mark sensitive variables as secrets in Netlify UI for additional protection
3. **Set quotas** to prevent unexpected charges in Google Cloud Console
4. **Monitor usage** in Google Cloud Console to track API calls and costs
5. **Rotate keys** periodically for security (update in both Google Cloud and Netlify)
6. **Use Deploy Contexts** - Set different API keys for production vs deploy previews if needed
7. **Document your setup** - Keep team members informed about which environments use which keys

### Security Recommendations
1. **HTTP Referrer Restrictions:** Always configure HTTP referrers in Google Cloud Console - never use unrestricted keys
2. **API Restrictions:** Limit the key to only the APIs you're actually using
3. **Netlify Secrets Controller:** For enhanced security, mark variables as secrets in Netlify
4. **Regular Audits:** Review Google Cloud Console usage logs periodically
5. **Key Rotation:** Update API keys every 3-6 months and immediately if compromised

## Quick Reference Checklist

### Initial Setup Checklist

- [ ] Enable all required Google Maps APIs in Google Cloud Console
  - [ ] Maps JavaScript API
  - [ ] Places API
  - [ ] Distance Matrix API
  - [ ] Geocoding API
- [ ] Configure HTTP referrers in Google Cloud Console
  - [ ] `http://localhost:*`
  - [ ] `http://127.0.0.1:*`
  - [ ] `https://vidquo.netlify.app/*`
  - [ ] `https://deploy-preview-*--vidquo.netlify.app/*`
  - [ ] `https://*--vidquo.netlify.app/*`
- [ ] Set API restrictions to only required APIs
- [ ] Add `VITE_GOOGLE_MAPS_API_KEY` to local `.env` file
- [ ] Add `VITE_GOOGLE_MAPS_API_KEY` to Netlify environment variables
  - [ ] Set scope to **Builds**
  - [ ] Configure for appropriate deploy contexts
- [ ] Test locally with `npm run dev`
- [ ] Deploy to Netlify and test in production
- [ ] Verify in deploy preview before production release

### Deployment Verification Checklist

When deploying to Netlify, verify:

- [ ] Environment variable is set in Netlify dashboard
- [ ] Variable name is exactly `VITE_GOOGLE_MAPS_API_KEY` (with VITE_ prefix)
- [ ] Builds scope is selected
- [ ] New deploy is triggered after setting variables
- [ ] Build logs show no environment variable errors
- [ ] Production site loads Google Maps successfully
- [ ] Address autocomplete works
- [ ] Distance calculation works
- [ ] No console errors related to API key or referrers

## Continuous Deployment Notes

### How Netlify Continuous Deployment Works with Google Maps

1. **On Git Push:** Netlify automatically detects changes and starts a build
2. **Build Process:** During `npm run build`, Vite injects environment variables (including `VITE_GOOGLE_MAPS_API_KEY`) into the client bundle
3. **Deploy:** Built files are deployed to Netlify CDN
4. **Runtime:** When users visit the site, the API key is already embedded in the JavaScript bundle

**Important:** The API key is embedded at build time, not runtime. This means:
- Changes to environment variables require a rebuild
- The key will be visible in the client-side JavaScript (which is why HTTP referrer restrictions are critical)
- You cannot change the key without triggering a new deployment

### When to Trigger Manual Deploys

You need to manually trigger a deploy when:
- Adding or updating environment variables in Netlify
- Changing API key restrictions in Google Cloud Console
- Rotating API keys for security
- Troubleshooting environment variable issues

**How to trigger:**
```bash
# Via Netlify CLI
netlify deploy --prod

# Or via Netlify UI
# Go to Deploys > Trigger deploy > Deploy site
```

## Additional Resources

### Helpful CLI Commands

```bash
# List all environment variables for your site
netlify env:list

# Set a new environment variable
netlify env:set VITE_GOOGLE_MAPS_API_KEY "your_api_key"

# Import variables from .env file
netlify env:import .env

# Get the value of a specific variable (careful with sensitive data)
netlify env:get VITE_GOOGLE_MAPS_API_KEY

# Unset a variable
netlify env:unset VITE_GOOGLE_MAPS_API_KEY

# Check site status
netlify status

# View recent deploys
netlify deploy --list
```

### Quick Links

**Netlify:**
- [Vidquo Site Dashboard](https://app.netlify.com/sites/vidquo)
- [Environment Variables Settings](https://app.netlify.com/sites/vidquo/configuration/env)
- [Deploy Dashboard](https://app.netlify.com/sites/vidquo/deploys)
- [Netlify Environment Variables Documentation](https://docs.netlify.com/environment-variables/get-started/)

**Google Cloud Console:**
- [API Credentials](https://console.cloud.google.com/apis/credentials)
- [API Library](https://console.cloud.google.com/apis/library)
- [API Usage Dashboard](https://console.cloud.google.com/apis/dashboard)
- [Billing](https://console.cloud.google.com/billing)

**Documentation:**
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix)
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## Support

### Local Development Issues
1. Check the browser console for detailed error logs
2. Verify `.env` file exists and contains `VITE_GOOGLE_MAPS_API_KEY`
3. Restart dev server after changing environment variables
4. Confirm HTTP referrers include `http://localhost:*`

### Netlify Production Issues
1. Check build logs in [Netlify deploys dashboard](https://app.netlify.com/sites/vidquo/deploys)
2. Verify environment variable is set in [Netlify UI](https://app.netlify.com/sites/vidquo/configuration/env)
3. Confirm HTTP referrers include all Netlify URL patterns
4. Test in deploy preview before production
5. Check browser console on production site for specific errors

### Google Cloud Console Issues
1. Verify all required APIs are enabled
2. Check API key restrictions are not too strict
3. Confirm billing is enabled for your Google Cloud project
4. Review API usage quotas and limits
5. Check for any service outages on [Google Cloud Status](https://status.cloud.google.com/)

If issues persist, review the detailed troubleshooting sections above for specific error messages and solutions.
