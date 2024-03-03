import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Dashboard from './dashboard';
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarContent, NavbarItem, Button, Link } from '@nextui-org/react';
import CustomNavbar from '../components/navbar';

export default async function DashboardPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore }, { supabaseUrl: supabaseUrl, supabaseKey: supabaseKey })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <>
      <CustomNavbar activeLink="Dashboard" />
      <Dashboard session={ session } />
    </>
  )
}
