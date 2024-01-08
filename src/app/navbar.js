"use client"

import { useRouter } from "next/navigation"

export default function Navbar() {
	const router = useRouter()

	return (
		<div className="flex flex-row gap-10 font-extralight w-auto md:w-full justify-center">
      <button onClick={() => router.push('/dashboard')} className="hover:text-cyan-600 hover:underline underline-offset-2 transition-all">
        Dashboard
      </button>
      <button onClick={() => router.push('/students')} className="hover:text-cyan-600 hover:underline underline-offset-2 transition-all">
        Students
      </button>
      <button onClick={() => router.push('/my-account')} className="hover:text-cyan-600 hover:underline underline-offset-2 transition-all">
        My Account
      </button>
			<form action="auth/signout" method="post" className="md:ml-auto ml-0">
				<button type="submit" className="hover:text-cyan-600 hover:underline underline-offset-2 transition-all">
					Logout
				</button>
			</form>
    </div>
	)
}