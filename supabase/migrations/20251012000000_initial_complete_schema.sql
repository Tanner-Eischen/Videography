/*
  # Complete Database Schema for Vid-QUO Quote Management System

  ## Overview
  This migration creates the complete database schema for a video production quote
  management system with role-based access control, user settings, and comprehensive
  quote tracking.

  ## Tables Created

  ### 1. profiles
  User profiles with role-based access (superadmin and admin roles)
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique, required)
  - `full_name` (text, nullable)
  - `role` (text, either 'superadmin' or 'admin')
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. quotes
  Main quotes table storing all quote information
  - `id` (uuid, primary key)
  - `client_id` (uuid, references profiles)
  - `client_name` (text, required)
  - `client_email` (text, required)
  - `client_phone` (text, nullable)
  - `production_company` (text, nullable)
  - `project_start_date` (date, nullable)
  - `project_end_date` (date, nullable)
  - `tier` (text, standard/premium, nullable)
  - `status` (text, draft/done/exported/emailed/downloaded)
  - `filming_hours` (numeric, defaults to 0)
  - `revenue` (numeric, defaults to 0)
  - `is_accepted` (boolean, defaults to false)
  - `accepted_at` (timestamptz, nullable)
  - `form_data` (jsonb, stores complete form state)
  - `pickup_address` (text, nullable)
  - `dropoff_address` (text, nullable)
  - `pickup_lat` (numeric, nullable)
  - `pickup_lng` (numeric, nullable)
  - `dropoff_lat` (numeric, nullable)
  - `dropoff_lng` (numeric, nullable)
  - `distance_miles` (numeric, nullable)
  - `distance_km` (numeric, nullable)
  - `travel_duration_minutes` (integer, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. user_settings
  User-specific settings for crew rates and fees
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, unique)
  - `director_of_photography_rate` (numeric, defaults to 0)
  - `editor_rate` (numeric, defaults to 0)
  - `producer_rate` (numeric, defaults to 0)
  - `enablement_content_owner_rate` (numeric, defaults to 0)
  - `creative_director_rate` (numeric, defaults to 0)
  - `set_designer_rate` (numeric, defaults to 0)
  - `company_name` (text, defaults to empty string)
  - `phone_number` (text, defaults to empty string)
  - `rush_fee` (numeric, defaults to 0)
  - `high_traffic_fee` (numeric, defaults to 0)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. dashboard_stats
  Dashboard metrics for analytics
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles, unique)
  - `total_clients` (integer, defaults to 0)
  - `total_revenue` (numeric, defaults to 0)
  - `total_quotes` (integer, defaults to 0)
  - `clients_change_percent` (numeric, defaults to 0)
  - `revenue_change_percent` (numeric, defaults to 0)
  - `quotes_change_percent` (numeric, defaults to 0)
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users (admin role) can only access their own data
  - Superadmins can access all data across all accounts
  - Service role can insert profiles for new user signups
  - Automatic profile creation on user signup via trigger

  ## Functions
  - `handle_new_user()` - Automatically creates profile when user signs up
  - `update_updated_at_column()` - Automatically updates updated_at timestamp

  ## Triggers
  - Auto-create profile on user signup
  - Auto-update timestamps on all tables when records are modified
*/

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Superadmins can view all profiles
CREATE POLICY "Superadmins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'superadmin'
    )
  );

-- Superadmins can update all profiles
CREATE POLICY "Superadmins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'superadmin'
    )
  );

-- Service role can insert profiles (for automatic profile creation)
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- QUOTES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text,
  production_company text,
  project_start_date date,
  project_end_date date,
  tier text CHECK (tier IN ('standard', 'premium')),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'done', 'exported', 'emailed', 'downloaded')),
  filming_hours numeric DEFAULT 0,
  revenue numeric DEFAULT 0,
  is_accepted boolean DEFAULT false,
  accepted_at timestamptz,
  form_data jsonb,
  pickup_address text,
  dropoff_address text,
  pickup_lat numeric,
  pickup_lng numeric,
  dropoff_lat numeric,
  dropoff_lng numeric,
  distance_miles numeric,
  distance_km numeric,
  travel_duration_minutes integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Users can view their own quotes
CREATE POLICY "Users can view own quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

-- Users can insert their own quotes
CREATE POLICY "Users can insert own quotes"
  ON quotes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

-- Users can update their own quotes
CREATE POLICY "Users can update own quotes"
  ON quotes FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- Users can delete their own quotes
CREATE POLICY "Users can delete own quotes"
  ON quotes FOR DELETE
  TO authenticated
  USING (auth.uid() = client_id);

-- Superadmins can view all quotes
CREATE POLICY "Superadmins can view all quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'superadmin'
    )
  );

-- Superadmins can update all quotes
CREATE POLICY "Superadmins can update all quotes"
  ON quotes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'superadmin'
    )
  );

-- Superadmins can delete all quotes
CREATE POLICY "Superadmins can delete all quotes"
  ON quotes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'superadmin'
    )
  );

-- ============================================================================
-- USER SETTINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  director_of_photography_rate numeric DEFAULT 0,
  editor_rate numeric DEFAULT 0,
  producer_rate numeric DEFAULT 0,
  enablement_content_owner_rate numeric DEFAULT 0,
  creative_director_rate numeric DEFAULT 0,
  set_designer_rate numeric DEFAULT 0,
  company_name text DEFAULT '',
  phone_number text DEFAULT '',
  rush_fee numeric DEFAULT 0,
  high_traffic_fee numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can view their own settings
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own settings
CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- DASHBOARD STATS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS dashboard_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  total_clients integer DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  total_quotes integer DEFAULT 0,
  clients_change_percent numeric DEFAULT 0,
  revenue_change_percent numeric DEFAULT 0,
  quotes_change_percent numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE dashboard_stats ENABLE ROW LEVEL SECURITY;

-- Users can view their own stats
CREATE POLICY "Users can view own stats"
  ON dashboard_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own stats
CREATE POLICY "Users can insert own stats"
  ON dashboard_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own stats
CREATE POLICY "Users can update own stats"
  ON dashboard_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Triggers to automatically update updated_at timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_stats_updated_at
  BEFORE UPDATE ON dashboard_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
