"use client"

import React from "react"
import AuthForm from "./auth-form"
import { NextUIProvider } from "@nextui-org/react"


export default function Home() {
  return (
    <NextUIProvider>
      <main className="light text-foreground bg-background">
        <div className="bg-slate-200 h-screen p-10 justify-between flex flex-col">
          <div>
            <h1 className="text-slate-950 text-2xl font-extralight">Welcome to</h1>
            <h1 className="text-slate-950 text-6xl font-extralight mb-10">PUPSRC-iMHealth!</h1>
          </div>
          
          <AuthForm headerText="Sign in" subText="as Admin" />
        </div>
      </main>
    </NextUIProvider>
  )
}
