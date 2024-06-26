"use client"
import { NextUIProvider, Link, Button } from "@nextui-org/react"
import React from "react"
import SignUpForm from "./signup-form"
import IconArrowBackUp from "@/app/icons/arrow-back-up"

export default function SignUpPage() {
    return (
        <NextUIProvider>
            <div className="h-screen bg-gradient-to-r from-slate-50 to-slate-300 flex flex-col justify-center items-center relative">
                <div className="absolute left-0 top-0 p-5">
                    <Button as={Link} href="/assessment/login" variant="faded">
                        <IconArrowBackUp />
                        Back
                    </Button>
                </div>
                <SignUpForm />
            </div>
        </NextUIProvider>
    )
}