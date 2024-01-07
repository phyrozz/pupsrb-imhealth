import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AccountForm from '../account/account-form'

export default async function Account() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore }, { supabaseUrl: supabaseUrl, supabaseKey: supabaseKey })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return <AccountForm session={session} />
}