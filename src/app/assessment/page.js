"use client"
import React from "react"
import { Button, NextUIProvider } from "@nextui-org/react"
import { useRouter } from "next/navigation"

export default function AssessmentPage() {
    const router = useRouter()

    return (
        <NextUIProvider>
            <div className="bg-slate-200 h-screen flex flex-col justify-center items-center">
                <div className="p-5 flex flex-col gap-3 justify-center items-center">
                    <h1 className="text-6xl font-thin text-slate-900">How are you doing?</h1>
                    <p className="text-slate-900 font-bold">Fill out this assessment form to get started! This will only take a few minutes.</p>
                </div>
                <div className="p-5 flex flex-col gap-3">
                    <Button
                        color="primary"
                        onClick={() => router.push("/assessment/login")}
                    >
                        Answer the form
                    </Button>
                </div>
            </div>
        </NextUIProvider>
    )
}