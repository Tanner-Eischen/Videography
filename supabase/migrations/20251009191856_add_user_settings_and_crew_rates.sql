/*
  # Add User Settings and Crew Rates

  1. New Tables
    - `user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `director_of_photography_rate` (decimal)
      - `editor_rate` (decimal)
      - `producer_rate` (decimal)
      - `enablement_content_owner_rate` (decimal)
      - `creative_director_rate` (decimal)
      - `set_designer_rate` (decimal)
      - `company_name` (text)
      - `phone_number` (text)
      - `notification_preferences` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_settings` table
    - Add policy for users to read their own settings
    - Add policy for users to insert their own settings
    - Add policy for users to update their own settings
*/

CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  director_of_photography_rate decimal(10, 2) DEFAULT 0,
  editor_rate decimal(10, 2) DEFAULT 0,
  producer_rate decimal(10, 2) DEFAULT 0,
  enablement_content_owner_rate decimal(10, 2) DEFAULT 0,
  creative_director_rate decimal(10, 2) DEFAULT 0,
  set_designer_rate decimal(10, 2) DEFAULT 0,
  company_name text DEFAULT '',
  phone_number text DEFAULT '',
  notification_preferences jsonb DEFAULT '{"email": true, "push": false}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on user_settings
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();