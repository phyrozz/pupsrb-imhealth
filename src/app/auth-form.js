import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader, Input, Divider, Button, Link, CircularProgress } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { ArrowForwardRounded } from '@mui/icons-material'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthForm(props) {
  const headerText = props.headerText
  const subText = props.subText
  const signUpHref = props.signUpHref
  const signInHref = props.signInHref
  const checkIfStudent = props.checkIfStudent

  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient({supabaseUrl: supabaseUrl, supabaseKey: supabaseKey})

  const handleLogin = async (e) => {
    setIsLoading(true)

    e.preventDefault()
    try {
      const { data: userData, error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        throw authError
      }

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('is_student')
        .eq('id', userData.user.id)
        .single()

      if (fetchError) {
        throw fetchError
      }

      const isStudent = data && data.is_student;

      if ((checkIfStudent && isStudent) || (!checkIfStudent && !isStudent)) {
        // Successfully logged in
        router.replace(signInHref);
      } else {
        // User is not of the expected role
        // You may also want to sign the user out if needed
        await supabase.auth.signOut();
        throw new Error('Invalid role');
      }
      
    } catch (error) {
      setIsLoading(false)
      setError('Login failed: ' + error.message);
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
              <h1 className="text-3xl font-bold text-left">{headerText}</h1>
              <h1 className="text-md font-extralight text-left">{subText}</h1>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <form onSubmit={handleLogin} className="w-full items-end flex flex-col">
              <div className="py-5 flex flex-col gap-2 w-full">
                <Input type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} isRequired />
                <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} isRequired />
                <p className="text-center text-red-600 font-bold text-sm">{error}</p>
              </div>
              <Button type="submit" color="primary">
                {isLoading ? <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    ease: [0, 0.71, 0.2, 1.01]
                  }}
                >
                  <CircularProgress />
                </motion.div> : <ArrowForwardRounded />}
              </Button>
            </form>
            {signUpHref ? <div className="text-center mt-6 mb-3">
                <Link href={signUpHref}>Create an account</Link>
            </div> : null}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  )
}
