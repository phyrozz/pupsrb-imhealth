"use client"

import { useState, useCallback, useEffect } from "react";
import ProgramCountTable from "./widgets/by-program-count-table";

export default function Dashboard({ session }) {
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
    <div className="text-center md:text-left text-slate-700 px-5">
			<h1 className="text-6xl font-thin pt-10">
				Welcome!
			</h1>
			<p className="text-2xl font-bold pb-10">{email}</p>
      <div className="grid grid-cols-4 gap-3">
        <ProgramCountTable />
        
      </div>
		</div>
	)
}