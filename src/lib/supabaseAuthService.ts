import { supabase } from './supabase';

export const supabaseAuthService = {
  // Sign up with email
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      console.error('Sign up error:', error);
      return { user: null, error };
    }

    // Create profile
    if (data.user) {
      await supabase.from('profiles').insert([{
        id: data.user.id,
        full_name: fullName
      }]);
    }

    return { user: data.user, error: null };
  },

  // Sign in with email
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Sign in error:', error);
      return { user: null, error };
    }

    return { user: data.user, error: null };
  },

  // Sign in with phone (OTP)
  async signInWithPhone(phone: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone
    });

    if (error) {
      console.error('Phone sign in error:', error);
      return { error };
    }

    return { error: null };
  },

  // Verify OTP
  async verifyOtp(phone: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    });

    if (error) {
      console.error('OTP verification error:', error);
      return { user: null, error };
    }

    return { user: data.user, error: null };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get current session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Update profile
  async updateProfile(updates: { full_name?: string; phone?: string; location?: string; language?: string }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Profile update error:', error);
      return { error };
    }

    return { error: null };
  },

  // Get profile
  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      return null;
    }

    return data;
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Mark onboarding as complete
  async completeOnboarding() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    // Update profiles table (primary source of truth)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ onboarding_complete: true })
      .eq('id', user.id);

    if (profileError) {
      console.error('Failed to update profile onboarding status:', profileError);
      return { error: profileError };
    }

    // Also update user metadata for backward compatibility
    try {
      await supabase.auth.updateUser({
        data: { onboarding_complete: true }
      });
    } catch (error) {
      console.warn('Failed to update user metadata (non-critical):', error);
    }

    return { error: null };
  },

  // Check if onboarding is complete
  async isOnboardingComplete() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check profiles table first (primary source)
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', user.id)
      .single();

    if (profile?.onboarding_complete) {
      return true;
    }

    // Fallback to user metadata for backward compatibility
    return user.user_metadata?.onboarding_complete === true;
  }
};
