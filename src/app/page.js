"use client"

import React from "react"
import AuthForm from "./auth-form"
import { NextUIProvider } from "@nextui-org/react"
import { Link } from "@nextui-org/react"


export default function Home() {
  return (
    <NextUIProvider>
      <main className="light text-foreground bg-background">
        <div className="bg-gradient-to-r from-slate-50 to-slate-300 h-screen p-10 justify-between flex flex-col">
          <AuthForm
            headerText="Sign in"
            subText="as Admin"
            signInHref="/dashboard"
          />
          <div className="absolute bottom-5 left-0 flex flex-col justify-center items-center w-screen">
            <p><b>Not an admin?</b> <Link href="/assessment/login">Log in as a student</Link></p>
          </div>
        </div>
      </main>
    </NextUIProvider>
  )
}
