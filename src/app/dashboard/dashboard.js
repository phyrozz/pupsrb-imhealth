"use client"

import Navbar from "../navbar";
import { useState, useCallback, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Dashboard({ session }) {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)
	const user = session?.user

	const [email, setEmail] = useState(null);

	const getUserEmail = useCallback(async () => {
    try {
      const userEmail = await user.email
			setEmail(userEmail)
    } catch (error) {
      alert('Error loading user data!')
    } finally {
    }
  }, [user.email])

  useEffect(() => {
    getUserEmail()
  }, [getUserEmail])

	return (
    <div className="text-center md:text-left">
			<h1 className="text-6xl font-extralight pt-10">
				Welcome!
			</h1>
			<p className="text-2xl font-bold pb-10">{email}</p>
		</div>
	)
}