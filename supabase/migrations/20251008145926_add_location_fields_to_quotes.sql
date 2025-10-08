/*
  # Add Location Fields to Quotes Table

  1. Changes
    - Add `pickup_address` (text) - Full address of pickup location
    - Add `dropoff_address` (text) - Full address of dropoff location
    - Add `pickup_lat` (numeric) - Latitude of pickup location for geocoding
    - Add `pickup_lng` (numeric) - Longitude of pickup location for geocoding
    - Add `dropoff_lat` (numeric) - Latitude of dropoff location for geocoding
    - Add `dropoff_lng` (numeric) - Longitude of dropoff location for geocoding
    - Add `distance_miles` (numeric) - Calculated distance between locations in miles
    - Add `distance_km` (numeric) - Calculated distance between locations in kilometers
    - Add `travel_duration_minutes` (integer) - Estimated travel time in minutes

  2. Notes
    - All fields are nullable to allow gradual adoption
    - Latitude/longitude stored for accurate distance recalculation if needed
    - Distance stored in both miles and km for flexibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'pickup_address'
  ) THEN
    ALTER TABLE quotes ADD COLUMN pickup_address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'dropoff_address'
  ) THEN
    ALTER TABLE quotes ADD COLUMN dropoff_address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'pickup_lat'
  ) THEN
    ALTER TABLE quotes ADD COLUMN pickup_lat numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'pickup_lng'
  ) THEN
    ALTER TABLE quotes ADD COLUMN pickup_lng numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'dropoff_lat'
  ) THEN
    ALTER TABLE quotes ADD COLUMN dropoff_lat numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'dropoff_lng'
  ) THEN
    ALTER TABLE quotes ADD COLUMN dropoff_lng numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'distance_miles'
  ) THEN
    ALTER TABLE quotes ADD COLUMN distance_miles numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'distance_km'
  ) THEN
    ALTER TABLE quotes ADD COLUMN distance_km numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'travel_duration_minutes'
  ) THEN
    ALTER TABLE quotes ADD COLUMN travel_duration_minutes integer;
  END IF;
END $$;
