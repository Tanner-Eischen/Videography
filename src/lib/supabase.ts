import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'client';
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
  status: 'draft' | 'done' | 'exported' | 'emailed';
  created_at: string;
  updated_at: string;
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
