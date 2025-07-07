import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { supabaseServiceRole } from '@/services/supabase/server';

const USER_ID_COOKIE_NAME = 'anonymous_user_id';

export async function getOrCreateAnonymousUserId(): Promise<string> {
  const cookieStore = await cookies();
  let userId = cookieStore.get(USER_ID_COOKIE_NAME)?.value;
  console.log(`Retrieved user ID from cookie: ${userId}`);
  
  if (!userId) {
    userId = uuidv4();
    cookieStore.set(USER_ID_COOKIE_NAME, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
      path: '/',
      sameSite: 'lax',
    });
  }

  // Ensure the user ID exists in the database, even if a cookie was present.
  // This handles cases where the cookie exists but the DB was reset or user deleted.
  console.log(`Ensuring anonymous user with ID: ${userId} exists in DB.`);
  const { data, error } = await supabaseServiceRole
    .from('users')
    .insert({ id: userId })
    .select('id')
    .single();

  if (error) {
    // If the error is a duplicate key (user already exists), ignore it.
    // Otherwise, log the error as it's an unexpected issue.
    if (error.code === '23505') { // 23505 is the unique_violation error code
      console.log(`Anonymous user with ID: ${userId} already exists in DB.`);
    } else {
      console.error('Error ensuring anonymous user exists:', error);
      console.error('Supabase upsert error details:', error.message, error.details, error.hint, error.code);
    }
  } else if (data) {
    console.log('Anonymous user ensured/created in DB:', data.id);
  } else {
    console.log('Supabase upsert returned no data and no error. This might indicate an unexpected state.');
  }

  return userId;
}
