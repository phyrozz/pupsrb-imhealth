"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardBody, CardFooter, Button, Input, Chip, Select, SelectItem, CircularProgress } from '@nextui-org/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import generatePDF from '../generate-pdf'

export default function ByProgramForm() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)

  const [programs, setPrograms] = React.useState([])
  const [counselingStatuses, setCounselingStatuses] = React.useState([])
  const [minDate, setMinDate] = React.useState("")
  const [maxDate, setMaxDate] = React.useState("")
  const [selectedPrograms, setSelectedPrograms] = React.useState("")
  const [selectedYears, setSelectedYears] = React.useState("")
  const [selectedCounselingStatuses, setselectedCounselingStatuses] = React.useState("")
  const [selectedAssessmentResults, setSelectedAssessmentResults] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)

  const yearItems = ["1", "2", "3", "4", "5"]
  const assessmentResultItems = ["0", "1", "2", "3"]

  const getPrograms = React.useCallback(
    async () => {
      try {
        const { data: programsData, error: programsError } = await supabase.from("programs").select(`id, name, initial`)
  
        if (programsError) {
          throw programsError
        }
  
        setPrograms(programsData)
      } catch (error) {
        console.error(error)
      }
    },
    [supabase],
  )

  const getCounselingStatuses = React.useCallback(
    async () => {
      try {
        const { data: counselingStatusesData, error } = await supabase.from("counseling_statuses").select(`id, name`)
  
        if (error) {
          throw error
        }
  
        setCounselingStatuses(counselingStatusesData)
      } catch (error) {
        console.error(error)
      }
    },
    [supabase],
  )
  
  const handleProgramsChange = (e) => {
    setSelectedPrograms(e.target.value)
  }

  const handleDateChange = (e) => {
    const { name, value } = e.target
    if (name === 'startDate') {
      // Update minDate when the start date changes
      setMinDate(value)
    } else if (name === 'endDate') {
      // Update maxDate when the end date changes
      setMaxDate(value)
    }
  }

  const handleYearsChange = (e) => {
    setSelectedYears(e.target.value)
  }

  const handleCounselingStatusChange = (e) => {
    setselectedCounselingStatuses(e.target.value)
  }

  const handleAssessmentResultsChange = (e) => {
    setSelectedAssessmentResults(e.target.value)
  }

  const generatePdf = async (e) => {
    e.preventDefault()
    let programs = selectedPrograms.split(",").map(item => parseInt(item.trim(), 10)).filter(num => !isNaN(num))
    let years = selectedYears.split(",").map(item => parseInt(item.trim(), 10)).filter(num => !isNaN(num))
    let counselingStatuses = selectedCounselingStatuses.split(",").map(item => parseInt(item.trim(), 10)).filter(num => !isNaN(num))
    let assessmentResults = selectedAssessmentResults.split(",").map(item => parseInt(item.trim(), 10)).filter(num => !isNaN(num))

    try {
      let query = supabase
        .from("apriori_results")
        .select(
          `profiles!inner(
            id, personal_details!inner(
              first_name, 
              middle_name, 
              last_name, 
              name_suffix,
              programs!inner(id, name, initial),
              year,
              marital_statuses!inner(id, status),
              email,
              student_number
            )
          ), 
          created_at, 
          assessment_scenarios!inner(id, name), 
          counseling_statuses!inner(id, name)`)
  
      if (programs.length) { query = query.in("profiles.personal_details.programs.id", programs) }
      if (years.length) { query = query.in("profiles.personal_details.year", years) }
      if (counselingStatuses.length) { query = query.in("counseling_statuses.id", counselingStatuses) }
      if (assessmentResults.length) { query = query.in("assessment_scenarios.id", assessmentResults) }
      
      if (minDate && maxDate) { 
        query = query.gte("created_at", minDate)
        query = query.lte("created_at", maxDate)
      }
      query = query.order("created_at", { ascending: false })
  
      const { data: reportData, error } = await query
  
      if (error) { throw error }
  
      generatePDF(reportData)
    } catch (error) {
      console.error(error)
    }
  }  
  
  React.useEffect(() => {
    getPrograms()
    getCounselingStatuses()
    setIsLoading(false)
  }, [getPrograms, getCounselingStatuses])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <Card isBlurred>
        <form onSubmit={generatePdf}>
          <CardHeader>
            <h1 className="text-md font-bold">Generate Report</h1>
          </CardHeader>
          <CardBody className="overflow-auto max-h-[60vh]">
            {isLoading ? 
              <div className="h-full w-full justify-center items-center">
                <CircularProgress />
              </div>
            :
              <div className="flex flex-col gap-3">
                <Select
                  isRequired
                  items={programs}
                  label="Program(s)"
                  isMultiline={true}
                  selectionMode="multiple"
                  labelPlacement="outside"
                  placeholder="Choose program(s)"
                  classNames={{
                    trigger: "min-h-unit-12 py-2",
                  }}
                  renderValue={(items) => {
                    return (
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                          <Chip key={item.key} color="primary">{item.data.initial}</Chip>
                        ))}
                      </div>
                    )
                  }}
                  onChange={handleProgramsChange}
                >
                  {(program) => (
                    <SelectItem key={program.id} textValue={program.id}>
                      <div className="flex gap-2 items-center">
                        <div className="flex flex-col">
                          <span className="text-small">{program.initial}</span>
                          <span className="text-tiny text-default-400">{program.name}</span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                  <Input type="date" label="Start date" name="startDate" placeholder="mm / dd / yyyy" min={minDate} onChange={handleDateChange} />
                  <Input type="date" label="End date" name="endDate" placeholder="mm / dd / yyyy" min={minDate} max={maxDate} onChange={handleDateChange} />
                </div>
                
                <p className="font-bold text-sm pt-4">Filter by:</p>

                <Select
                  items={yearItems}
                  label="Year(s)"
                  selectionMode="multiple"
                  labelPlacement="outside"
                  classNames={{
                    trigger: "min-h-unit-12 py-2",
                  }}
                  placeholder={<Chip color="primary">All</Chip>}
                  renderValue={(items) => {
                    return (
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                          <Chip key={item.key} color="primary">{item.key}</Chip>
                        ))}
                      </div>
                    )
                  }}
                  onChange={handleYearsChange}
                >
                  {yearItems.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))
                  }
                </Select>
                <Select
                  items={counselingStatuses}
                  label="Counseling Status(es)"
                  isMultiline={true}
                  selectionMode="multiple"
                  labelPlacement="outside"
                  placeholder={
                    <Chip color="primary">All</Chip>
                  }
                  classNames={{
                    trigger: "min-h-unit-12 py-2",
                  }}
                  renderValue={(items) => {
                    return (
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                          <Chip key={item.key} color="primary">{item.data.name}</Chip>
                        ))}
                      </div>
                    )
                  }}
                  onChange={handleCounselingStatusChange}
                >
                  {(status) => (
                    <SelectItem key={status.id} textValue={status.id}>
                      <div className="flex gap-2 items-center">
                        <div className="flex flex-col">
                          <span className="text-small">{status.name}</span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
                <Select
                  items={assessmentResultItems}
                  label="Assessment Result(s)"
                  selectionMode="multiple"
                  labelPlacement="outside"
                  classNames={{
                    trigger: "min-h-unit-12 py-2",
                  }}
                  placeholder={<Chip color="primary">All</Chip>}
                  renderValue={(items) => {
                    return (
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                          <Chip key={item.key} color="primary">{item.key}</Chip>
                        ))}
                      </div>
                    )
                  }}
                  onChange={handleAssessmentResultsChange}
                >
                  {assessmentResultItems.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))
                  }
                </Select>
              </div>
            }
          </CardBody>
          <CardFooter>
            <div className="flex w-full justify-end">
              <Button type="submit" variant="shadow" color="primary">Generate</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
