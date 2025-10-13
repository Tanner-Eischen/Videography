import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Configuration:', {
  url: supabaseUrl ? 'Set' : 'Missing',
  key: supabaseAnonKey ? 'Set' : 'Missing',
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables:', import.meta.env);
  throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('Supabase client initialized successfully');

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
  form_data?: any;
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
