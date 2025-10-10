/*
  # Add Rush Fee and High Traffic Fee to User Settings

  1. Changes
    - Add `rush_fee` column to `user_settings` table (numeric, default 0)
    - Add `high_traffic_fee` column to `user_settings` table (numeric, default 0)
  
  2. Purpose
    - Store default rush fee and high traffic fee values per user
    - These values will be used as checkboxes on the quote creation page
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'rush_fee'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN rush_fee NUMERIC DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'high_traffic_fee'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN high_traffic_fee NUMERIC DEFAULT 0;
  END IF;
END $$;