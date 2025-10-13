import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Configuration:', {
  url: supabaseUrl ? 'Set' : 'Missing',
  key: supabaseAnonKey ? 'Set' : 'Missing',
  allEnvVars: Object.keys(import.meta.env),
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '[SET]' : '[MISSING]');
  console.error('All environment variables:', import.meta.env);

  const errorMessage = 'Supabase configuration missing. The app requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.';

  if (typeof window !== 'undefined') {
    const showError = () => {
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg, #003D82, #8FC4D4);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:Lexend,sans-serif;';
      errorDiv.innerHTML = `
        <div style="background:white;padding:2rem;border-radius:1rem;max-width:500px;margin:1rem;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);">
          <h1 style="color:#003D82;font-size:1.5rem;font-weight:bold;margin-bottom:1rem;">Configuration Error</h1>
          <p style="color:#666;margin-bottom:1rem;">${errorMessage}</p>
          <p style="color:#666;font-size:0.875rem;">This usually happens in preview environments. The app should work correctly when deployed.</p>
        </div>
      `;
      document.body.appendChild(errorDiv);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showError);
    } else {
      showError();
    }
  }

  throw new Error(errorMessage);
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
