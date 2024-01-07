"use client"

import { useRouter } from "next/navigation";
import AuthForm from "./auth-form";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-slate-200 h-screen p-10 justify-between flex flex-col">
      <div>
        <h1 className="text-slate-950 text-2xl font-extralight">Welcome to</h1>
        <h1 className="text-slate-950 text-6xl font-extralight mb-10">PUPSRC-iMHealth!</h1>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="container py-10 px-5 m-5 w-96 bg-slate-900 rounded-lg shadow-xl shadow-neutral-600">
          <h1 className="text-3xl font-bold">Get Started</h1>
          <AuthForm />
        </div>
      </div>
    </div>
  )
}
