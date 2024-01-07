// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req) {
  // const cookieStore = cookies()
  // const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  // await supabase.auth.signInWithPassword({ email: req.email, password: req.password })

  return NextResponse.redirect(new URL('/home', req.url))
}