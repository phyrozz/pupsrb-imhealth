import React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardHeader, CardBody, Divider, Input, Button } from "@nextui-org/react"
import { ArrowForwardRounded } from "@mui/icons-material"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function SignUpForm() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [error, setError] = React.useState(null)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient({supabaseUrl: supabaseUrl, supabaseKey: supabaseKey})

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      if (password === confirmPassword) {
        const { error } = await supabase.auth.signUp({email, password})

        if (error) {
          throw error
        }
  
        router.replace('/assessment/form')
      } else {
        setError("Passwords don't match.")
      }
      
    } catch (error) {
      setError('Sign up failed.')
    }
  }

  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-96 w-full md:px-0 px-5'>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
        }}
      >
        <Card isBlurred shadow='sm'>
          <CardHeader>
            <div className="flex flex-col mt-3">
              <h1 className="text-2xl font-bold text-left">Create a New Account</h1>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <form onSubmit={handleSignUp} className="w-full items-end flex flex-col">
              <div className="py-5 flex flex-col gap-2 w-full">
                <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} isRequired />
                <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} isRequired />
                <Input type="password" label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} isRequired />
                <p className="text-center text-red-600 font-bold text-sm">{error}</p>
              </div>
              <Button type="submit" color="primary">
                <ArrowForwardRounded />
              </Button>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  )
}