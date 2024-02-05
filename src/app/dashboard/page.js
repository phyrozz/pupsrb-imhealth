import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Dashboard from './dashboard';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link } from '@nextui-org/react';

export default async function DashboardPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore }, { supabaseUrl: supabaseUrl, supabaseKey: supabaseKey })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-300 h-screen">
      <Navbar shouldHideOnScroll isBordered>
        <NavbarBrand>
          <p className="text-xl font-bold text-black">PUP-iMHealth</p>
        </NavbarBrand>
        <NavbarContent>
          <NavbarItem isActive>
            <Link isBlock color="foreground" href="/dashboard">Dashboard</Link>
          </NavbarItem>
          <NavbarItem>
            <Link isBlock color="foreground" href="/students">Students</Link>
          </NavbarItem>
          <NavbarItem>
            <Link isBlock color="foreground" href="/my-account">My Account</Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <form action="/auth/signout" method="post">
              <Button type="submit" color="danger" variant="shadow">
                Log out
              </Button>
            </form>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <Dashboard session={ session } />
    </div>
  )
}
