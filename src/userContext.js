"use client"

import React from "react";
import supabase from "./supabase";
import { useRouter } from "next/navigation";

export function UserProvider(props) {
    const router = useRouter();

	const [session, setSession] = React.useState(null);
	const [user, setUser] = React.useState(null);
	const [publicUser, setPublicUser] = React.useState(null);

	// Check if we have a user logged in
	React.useEffect(() => {
		const session = supabase.auth.session();
		console.log('session', session);
		setSession(session);
		setUser(session?.user ?? null);
		if (session?.user) {
			setTimeout(async () => {
				const publicUser = await getPublicUser(session.user);
				setPublicUser(publicUser);
			}, 100);
		}
		const { data: authListener } = supabase.auth.onAuthStateChange(
			async (event, session) => {
				if (session?.user) {
					const publicUser = await getPublicUser(session.user);
					setSession(session);
					setUser(session.user);
					setPublicUser(publicUser);
				}

				// @todo: implement redirect on logout
                router.replace("/");
			}
		);

		// Cleanup function
		return () => {
			authListener.unsubscribe();
		};
	}, []);

	const value = [publicUser, user, session];

	return <UserContext.Provider value={value} {...props} />;
}