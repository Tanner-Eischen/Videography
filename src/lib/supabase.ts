import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://crmlhcikkilkucytbvnp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybWxoY2lra2lsa3VjeXRidm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjU2NzMsImV4cCI6MjA3NTQwMTY3M30.mNe2meq_m07NVPbbgLIauiit1f5mJzg3IScEAJKiSrQ';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'superadmin' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Quote = {
  id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  production_company: string | null;
  project_start_date: string | null;
  project_end_date: string | null;
  tier: 'standard' | 'premium' | null;
  status: 'draft' | 'done' | 'exported' | 'emailed' | 'downloaded';
  created_at: string;
  updated_at: string;
  filming_hours: number;
  revenue: number;
  is_accepted: boolean;
  accepted_at: string | null;
};

export type DashboardStats = {
  id: string;
  user_id: string;
  total_clients: number;
  total_revenue: number;
  total_quotes: number;
  clients_change_percent: number;
  revenue_change_percent: number;
  quotes_change_percent: number;
  updated_at: string;
};
