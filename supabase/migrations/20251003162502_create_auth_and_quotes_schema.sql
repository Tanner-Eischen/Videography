-- Initial Schema for Quote Management System
--
-- Overview:
-- This migration sets up the complete database schema for a quote management system 
-- with role-based access control.
--
-- New Tables:
-- 1. profiles - User profiles with role information (admin/client)
-- 2. quotes - Main quotes table with client and project information
-- 3. quote_standard_details - Standard tier specific fields
-- 4. quote_premium_details - Premium tier specific fields
-- 5. dashboard_stats - Dashboard statistics for users
--
-- Security:
-- - RLS enabled on all tables
-- - Policies for role-based access control
-- - Admin users can access all data
-- - Client users can only access their own data

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create quotes table
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
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'done', 'exported', 'emailed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Users can insert own quotes"
  ON quotes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update own quotes"
  ON quotes FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Admins can view all quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all quotes"
  ON quotes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create quote_standard_details table
CREATE TABLE IF NOT EXISTS quote_standard_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid UNIQUE REFERENCES quotes(id) ON DELETE CASCADE,
  crew_per_setup text,
  weight_production_to_profit text,
  discount text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quote_standard_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own standard details"
  ON quote_standard_details FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_standard_details.quote_id
      AND quotes.client_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own standard details"
  ON quote_standard_details FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_standard_details.quote_id
      AND quotes.client_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own standard details"
  ON quote_standard_details FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_standard_details.quote_id
      AND quotes.client_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_standard_details.quote_id
      AND quotes.client_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all standard details"
  ON quote_standard_details FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create quote_premium_details table
CREATE TABLE IF NOT EXISTS quote_premium_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid UNIQUE REFERENCES quotes(id) ON DELETE CASCADE,
  num_deliverables integer CHECK (num_deliverables >= 1 AND num_deliverables <= 7),
  avg_length_per_deliverable text,
  filming_days integer CHECK (filming_days >= 1 AND filming_days <= 7),
  hours_per_day text,
  num_locations integer CHECK (num_locations >= 1 AND num_locations <= 7),
  miles_from_service_rep integer CHECK (miles_from_service_rep >= 0 AND miles_from_service_rep <= 300),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quote_premium_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own premium details"
  ON quote_premium_details FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_premium_details.quote_id
      AND quotes.client_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own premium details"
  ON quote_premium_details FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_premium_details.quote_id
      AND quotes.client_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own premium details"
  ON quote_premium_details FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_premium_details.quote_id
      AND quotes.client_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_premium_details.quote_id
      AND quotes.client_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all premium details"
  ON quote_premium_details FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create dashboard_stats table
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

CREATE POLICY "Users can view own stats"
  ON dashboard_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON dashboard_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON dashboard_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quote_standard_details_updated_at BEFORE UPDATE ON quote_standard_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quote_premium_details_updated_at BEFORE UPDATE ON quote_premium_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_stats_updated_at BEFORE UPDATE ON dashboard_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();