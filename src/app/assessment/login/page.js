"use client"
import AuthForm from "@/app/auth-form"
import React from "react"
import { NextUIProvider } from "@nextui-org/react"

export default function AssessmentLoginPage() {
    return (
        <NextUIProvider>
            <div className="h-screen bg-gradient-to-r from-slate-50 to-slate-300 flex flex-col justify-center items-center">
                <AuthForm headerText="Sign in" subText="to Answer Your Assessment Form" signUpHref="/assessment/sign-up" />
            </div>
        </NextUIProvider>
    )
}