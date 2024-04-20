"use client"
import React from "react"
import { Button, NextUIProvider, CircularProgress } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import IconArrowRightShort from "../icons/arrow-right-short"
import { motion } from "framer-motion"

export default function AssessmentPage() {
    const router = useRouter()
    
    const [isLoading, setIsLoading] = React.useState(false)

    const handleClick = () => {
        setIsLoading(true)
        router.push("/assessment/login")
    }

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
                        onClick={handleClick}
                    >
                        {isLoading ? <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.5,
                                ease: [0, 0.71, 0.2, 1.01]
                            }}
                            >
                                <CircularProgress />
                            </motion.div> : <>
                            Answer the form
                            <IconArrowRightShort />
                        </>}
                        
                    </Button>
                </div>
            </div>
        </NextUIProvider>
    )
}