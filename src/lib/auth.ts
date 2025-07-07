import { createClient } from '@/services/supabase/server';
import { User } from '@supabase/supabase-js';
import { cache } from 'react';

/**
 * Fetches the currently authenticated user from Supabase.
 * This function is cached to avoid redundant lookups within a single request.
 * @returns {Promise<User | null>} The user object or null if not authenticated.
 */
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * Fetches the profile for a given user ID from the 'profiles' table.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<any | null>} The user profile or null if not found.
 */
export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return profile;
}
