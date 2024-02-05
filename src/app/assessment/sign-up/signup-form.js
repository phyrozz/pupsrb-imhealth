import React from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardBody, Divider, Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react"
import { ArrowForwardRounded } from "@mui/icons-material"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function SignUpForm() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [error, setError] = React.useState(null)
  const {isOpen, onOpen, onOpenChange} = useDisclosure()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient({supabaseUrl: supabaseUrl, supabaseKey: supabaseKey})

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      if (password === confirmPassword) {
        const { data, error } = await supabase.auth.signUp({ email, password, options: {emailRedirectTo: "https://pupsrb-imhealth.vercel.app/assessment/form"} })
  
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError("Account already exists.")
        } else if (error) {
          throw error
        } else {
          setEmail('')
          setPassword('')
          setConfirmPassword('')
          setError(null)
          onOpen()
        }
      } else {
        setError("Passwords don't match.")
      }
    } catch (error) {
      setError('Sign up failed.')
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Confirmation Sent</ModalHeader>
                <ModalBody>
                  <p className="text-black">A confirmation email has been sent to your email address.</p>
                  <p className="text-black">Please check your inbox or your spam folder for the confirmation link to successfully verify your new account.</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    OK
                  </Button>
                </ModalFooter>
              </>
            )}
        </ModalContent>
      </Modal>
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
                <p className="text-sm text-center mb-5">This website will only ask for your email address and password. Providing personal details such as your full name are optional.</p>
                <Button type="submit" color="primary">
                  <ArrowForwardRounded />
                </Button>
              </form>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </>
  )
}