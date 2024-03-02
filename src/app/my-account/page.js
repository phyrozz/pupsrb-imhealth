import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AccountForm from './account-form'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link } from '@nextui-org/react';
import CustomNavbar from '../components/navbar';

export default async function Account() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore }, { supabaseUrl: supabaseUrl, supabaseKey: supabaseKey })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-300 h-screen">
    <CustomNavbar activeLink="My Account" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-1/2 w-full md:px-0 px-5">
        <AccountForm session={session} />
      </div>
    </div>
  )
}