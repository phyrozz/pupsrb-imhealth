import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res }, { supabaseUrl, supabaseKey });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let allowedPaths;

    if (user) {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('is_student')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      allowedPaths = profileData.is_student
        ? ['/', '/assessment', '/assessment/login', '/assessment/form', '/assessment/sign-up']
        : ['/', '/dashboard', '/students', '/my-account'];
    } else {
      allowedPaths = ['/', '/assessment', '/assessment/login', '/assessment/sign-up'];
    }

    // Check if the current path is allowed for the user
    if (!allowedPaths.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  } catch (error) {
    // Handle error (user not signed in, etc.)
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/dashboard', '/students', '/my-account', '/assessment', '/assessment/login', '/assessment/sign-up', '/assessment/form'],
};
