import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader, Input, Divider, Button, Link, CircularProgress } from '@nextui-org/react'
import { motion } from 'framer-motion'
import IconArrowRightShort from '../icons/arrow-right-short'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import HCaptcha from '@hcaptcha/react-hcaptcha'

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
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [captchaToken, setCaptchaToken] = useState()
  const captcha = useRef()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient({ supabaseUrl: supabaseUrl, supabaseKey: supabaseKey })

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setShowCaptcha(true)

    try {
      await captcha.current.execute()
    } catch (error) {
      setIsLoading(false)
      console.error('CAPTCHA execution error:', error)
    }
  }

  const handleCaptchaVerify = async (token) => {
    setIsLoading(true)
    setCaptchaToken(token)
    try {
      const { data, error: fetchError } = await supabase
        .from('admins')
        .select('email')
        .eq('email', email)
        .single()

      const isAdmin = data

      const { error: authError } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken: token } })

      if (authError) {
        throw authError
      }

      if ((checkIfStudent && !isAdmin) || (!checkIfStudent && isAdmin)) {
        // Successfully logged in
        router.replace(signInHref)
      } else {
        // User is not of the expected role
        // You may also want to sign the user out if needed
        await supabase.auth.signOut()
        throw new Error('Invalid role')
      }
    } catch (error) {
      setIsLoading(false)
      if (error.message === 'JSON object requested, multiple (or no) rows returned') {
        setError('Login failed: Invalid role')
      } else {
        setError('Login failed: ' + error.message)
      }
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
              <div className="w-full flex flex-row justify-center items-center pb-3">
                {showCaptcha && (
                  <HCaptcha
                    ref={captcha}
                    sitekey="e6d03459-96a5-40cf-8819-08774369a1ab"
                    onVerify={handleCaptchaVerify}
                  />
                )}
              </div>
              <Button type="submit" color="primary" isLoading={isLoading}>
                <IconArrowRightShort />
              </Button>
            </form>
            {signUpHref ? (
              <div className="text-center mt-6 mb-3">
                <Link href={signUpHref}>Create an account</Link>
              </div>
            ) : null}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  )
}
