import SurveyComponent from "../SurveyComponent"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Navbar, NavbarContent, NavbarItem, Link, Button, NavbarBrand } from "@nextui-org/react";

export default async function AssessmentForm() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore }, { supabaseUrl: supabaseUrl, supabaseKey: supabaseKey })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <div className=" h-screen bg-gray-100">
      <Navbar  shouldHideOnScroll isBordered>
        <NavbarBrand>
          <p className="font-extralight text-xl">PUP-iMHealth</p>
        </NavbarBrand>
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
      <SurveyComponent session={session} />
    </div>
  )    
}