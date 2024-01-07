'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthForm() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)

  return (
    <Auth
      supabaseClient={supabase}
			view="sign_in"
      appearance={{ theme: ThemeSupa }}
      theme="dark"
      showLinks={true}
      providers={[]}
    />
  )
}