import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, role: 'superadmin' | 'admin') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log('Starting auth initialization...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          await supabase.auth.signOut();
        }

        console.log('Session retrieved:', session ? 'User found' : 'No session');

        if (!mounted) return;

        if (session?.user) {
          console.log('Loading profile for user:', session.user.id);
          setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Init auth error:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          console.log('Setting loading to false');
          setLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout - forcing loading to false');
        setLoading(false);
        setUser(null);
        setProfile(null);
      }
    }, 5000);

    initAuth().finally(() => {
      clearTimeout(timeoutId);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      console.log('Fetching profile from database...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('Profile query result:', { data, error });

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        console.log('Profile loaded successfully:', data.role);
        setProfile(data as Profile);
      } else {
        console.warn('No profile found for user:', userId);
        setProfile(null);
      }
    } catch (err) {
      console.error('Exception loading profile:', err);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'superadmin' | 'admin') => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (authError) {
        return { error: authError };
      }

      if (!authData.user) {
        return { error: { message: 'Failed to create user' } };
      }

      return { error: null };
    } catch (err) {
      console.error('Signup exception:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
