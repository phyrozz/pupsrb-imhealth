import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navbar from '../navbar';
import Dashboard from './dashboard';

export default async function DashboardPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore }, { supabaseUrl: supabaseUrl, supabaseKey: supabaseKey })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-300 h-screen py-10 px-5 overflow-hidden">
      <Navbar />
      <Dashboard session={ session } />
    </div>
  )
}
