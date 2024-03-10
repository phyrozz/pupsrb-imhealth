import React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardBody, Divider, Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, CircularProgress, Select, SelectItem, RadioGroup, Radio, Link } from "@nextui-org/react"
import { ArrowForwardRounded } from "@mui/icons-material"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function SignUpForm() {
  // Sign up field states
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [middleName, setMiddleName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [nameSuffix, setNameSuffix] = React.useState('')
  const [birthDate, setBirthDate] = React.useState('')
  const [program, setProgram] = React.useState('')
  const [completeProgramName, setCompleteProgramName] = React.useState("")
  const [year, setYear] = React.useState(1)
  const [maritalStatus, setMaritalStatus] = React.useState('')
  const [isWorkingStudent, setIsWorkingStudent] = React.useState(false)
  const [maritalStatuses, setMaritalStatuses] = React.useState([])
  const [programs, setPrograms] = React.useState([])
  const [passwordStrength, setPasswordStrength] = React.useState("")

  const [error, setError] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)
  // const {isOpen, onOpen, onOpenChange} = useDisclosure()
  const router = useRouter()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClientComponentClient({supabaseUrl: supabaseUrl, supabaseKey: supabaseKey})

  React.useEffect(() => {
    async function fetchMaritalStatuses() {
      try {
        const { data: maritalStatuses, error } = await supabase
          .from('marital_statuses')
          .select("id, status")

        if (error) {
          throw error
        }

        setMaritalStatuses(maritalStatuses)
      } catch (error) {
        console.error('Error fetching marital statuses:', error)
      }
    }

    async function fetchPrograms() {
      try {
        const { data: programs, error } = await supabase
          .from('programs')
          .select("id, name, initial")

        if (error) {
          throw error
        }

        setPrograms(programs)
      } catch (error) {
        console.error('Error fetching programs:', error)
      }
    }

    fetchMaritalStatuses()
    fetchPrograms()
  }, [supabase])

  const handleMaritalStatusChange = (e) => {
    setMaritalStatus(e.target.value)
  }

  const handleProgramsChange = (e) => {
    const selectedProgramId = e.target.value
    const selectedProgram = programs.find(program => program.id == selectedProgramId)
    if (selectedProgram) {
      setProgram(selectedProgramId)
      setCompleteProgramName(selectedProgram.name)
    }
    console.log(program)
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    if (value.length < 8) {
      setPasswordStrength("weak")
    } else {
      setPasswordStrength("strong")
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (password === confirmPassword) {
        const { data, error } = await supabase.auth.signUp({ email, password, options: {emailRedirectTo: "https://pupsrb-imhealth.vercel.app/assessment/login"} })
  
        if (data.user && data.user.identities && data.user.identities.length == 0) {
          setError("Account already exists.")
        } else if (error) {
          throw error
        } else {
          await supabase.from('personal_details').insert({
            user_id: data.user.id,
            email: email,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            name_suffix: nameSuffix,
            birth_date: birthDate,
            program_id: program,
            year: year,
            marital_status_id: maritalStatus,
            is_working_student: isWorkingStudent
          })

          setFirstName('')
          setMiddleName('')
          setLastName('')
          setNameSuffix('')
          setBirthDate('')
          setProgram('')
          setYear(1)
          setMaritalStatus('')
          setIsWorkingStudent(false)
          setEmail('')
          setPassword('')
          setConfirmPassword('')
          setError(null)

          await supabase.auth.signInWithPassword({ email, password })
          router.replace("/assessment/form")
          // onOpen()
        }
      } else {
        setError("Passwords don't match.")
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      setError('Sign up failed: ' + error.message)
    }
  }

  return (
    <>
      {/* <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-black">Confirmation Sent</ModalHeader>
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
      </Modal> */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-1/2 w-[90vw]'>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0, 0.71, 0.2, 1.01]
          }}
        >
          <Card className="md:h-[86vh] h-[80vh] overflow-auto" isBlurred shadow='xl'>
            <CardHeader>
              <div className="flex flex-col mt-3">
                <h1 className="text-2xl font-bold text-left">Create a New Account</h1>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <form onSubmit={handleSignUp} className="w-full items-stretch flex flex-col">
                <div className="py-5 grid grid-cols-4 gap-2 w-full">
                  <Input className="md:col-span-2 col-span-4" type="text" label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} isRequired />
                  <Input className="md:col-span-2 col-span-4 md:col-start-3 col-start-1" type="text" label="Middle name" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                  <Input className="md:col-span-2 col-span-4" type="text" label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} isRequired />
                  <Input className="md:col-span-2 col-span-4 md:col-start-3 col-start-1" type="text" label="Suffix (Jr., III, etc.)" value={nameSuffix} onChange={(e) => setNameSuffix(e.target.value)} />
                  <Input className="col-span-4" type="date" placeholder="mm / dd / yyyy" label="Birth date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} isRequired />
                  <Select
                    items={programs}
                    onChange={handleProgramsChange}
                    className="col-span-3"
                    label="Program"
                    placeholder="Choose your program"
                    description={completeProgramName}
                    isRequired
                  >
                    {programs.map((program) => <SelectItem key={program.id} value={program.id} className="text-black">{program.initial}</SelectItem>)}
                  </Select>
                  <Input className="col-start-4" type="number" label="Year" value={year} min={1} max={5} onChange={(e) => setYear(e.target.value)} isRequired />
                  <Select
                    items={maritalStatuses}
                    onChange={handleMaritalStatusChange}
                    className="col-span-4"
                    label="Marital Status"
                    placeholder="Choose your status"
                    isRequired
                  >
                    {(status) => <SelectItem key={status.id} value={status.id} className="text-black">{status.status}</SelectItem>}
                  </Select>
                  <Input className="col-span-4" type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} isRequired />
                  <Input className="col-span-4" type="password" label="Password" value={password} onChange={handlePasswordChange} isRequired />
                  {passwordStrength && <p className="text-sm">Strength: <b className={passwordStrength === "strong" ? "text-green-600" : "text-red-600"}>{passwordStrength}</b></p>}
                  <Input className="col-span-4" type="password" label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} isRequired />
                  <RadioGroup
                    className="col-span-4"
                    label="Are you a working student?"
                    orientation="horizontal"
                    value={isWorkingStudent}
                    onValueChange={setIsWorkingStudent}
                  >
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </RadioGroup>
                  <p className="text-center text-red-600 font-bold text-sm col-span-4">{error}</p>
                </div>
                <p className="text-sm text-center mb-5">By creating an account, you agree to PUP&apos;s Privacy Statement. Read more at <Link size="sm" href="https://www.pup.edu.ph/privacy/" target="_blank">https://www.pup.edu.ph/privacy/</Link></p>
                <div className="flex flex-col items-end">
                  <Button type="submit" color="primary">
                    {isLoading ? 
                      <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        ease: [0, 0.71, 0.2, 1.01]
                      }}
                      >
                        <CircularProgress />
                      </motion.div> : <ArrowForwardRounded />
                    }
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </>
  )
}