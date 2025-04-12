import { supabase } from '../config/supabase';

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error);
  } else {
    console.log('User logged out successfully');
  }
} 