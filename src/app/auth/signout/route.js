import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore }, { supabaseUrl, supabaseKey });

  try {
    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      // Get the user's profile data
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('is_student')
        .eq('id', session.user.id)
        .single();

      if (error) {
        throw error;
      }

      // Redirect based on the is_student value
      const redirectPath = profileData.is_student ? '/assessment/login' : '/';

      await supabase.auth.signOut();

      return NextResponse.redirect(new URL(redirectPath, req.url), {
        status: 302,
      });
    }
  } catch (error) {
    console.error('Error during sign out:', error);
  }

  // Fallback to the default redirect path if there's an error or no session
  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  });
}
