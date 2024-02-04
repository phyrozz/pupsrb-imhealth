import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const checkUserSession = async (req) => {
  try {
    // Check user session on the server side
    const { user, session, error } = await supabase.auth.api.getUserByCookie(req);

    if (error) {
      throw error;
    }

    return { user, session };
  } catch (error) {
    throw error;
  }
};

export async function getCurrentUser() {
 let user = null;
 const session = supabase.auth.user();
 if (session) {
   user = session.user;
 }
 return { user };
}

export const signUp = async (email, password) => {
  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return true; // Successfully signed out
  } catch (error) {
    throw error;
  }
};

export default supabase;
