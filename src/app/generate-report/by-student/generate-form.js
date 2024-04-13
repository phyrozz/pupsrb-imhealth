"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardBody, CardFooter, Button, Input, Chip, Select, SelectItem, CircularProgress, Popover, PopoverTrigger, PopoverContent, Autocomplete, AutocompleteItem, Textarea } from '@nextui-org/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import GeneratePDFByStudent from './generate-pdf'
import { useStudentList } from './use-student-list'
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll'

export default function ByStudentForm() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)

  const [isOpen, setIsOpen] = React.useState(false)
  const [counselingStatuses, setCounselingStatuses] = React.useState([])
  const [minDate, setMinDate] = React.useState("")
  const [maxDate, setMaxDate] = React.useState("")
  const [selectedStudentKey, setSelectedStudentKey] = React.useState(null)
  const [filterText, setFilterText] = React.useState("")
  const { items, hasMore, isLoading, onLoadMore } = useStudentList({ supabase, filterText })
  const [selectedCounselingStatuses, setselectedCounselingStatuses] = React.useState("")
  const [selectedAssessmentResults, setSelectedAssessmentResults] = React.useState("")
  const [selectedDomains, setSelectedDomains] = React.useState("")
  const [popoverMessage, setPopoverMessage] = React.useState(null)
  const [domains, setDomains] = React.useState([])
  const [recommendations, setRecommendations] = React.useState("")

  const assessmentResultItems = ["0", "1", "2", "3"]

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

  const getDomains = React.useCallback(
    async () => {
      try {
        const { data: domainsData, error } = await supabase.from("assessment_domains").select(`*`)
  
        if (error) {
          throw error
        }
  
        setDomains(domainsData)
      } catch (error) {
        console.error(error)
      }
    },
    [supabase],
  )

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

  const handleDomainsChange = (e) => {
    setSelectedDomains(e.target.value)
  }

  const handleCounselingStatusChange = (e) => {
    setselectedCounselingStatuses(e.target.value)
  }

  const handleAssessmentResultsChange = (e) => {
    setSelectedAssessmentResults(e.target.value)
  }

  const generatePdf = async (e) => {
    e.preventDefault()
    let counselingStatuses = selectedCounselingStatuses.split(",").map(item => parseInt(item.trim(), 10)).filter(num => !isNaN(num))
    let assessmentResults = selectedAssessmentResults.split(",").map(item => parseInt(item.trim(), 10)).filter(num => !isNaN(num))
    let domainIds = selectedDomains.split(",").map(item => parseInt(item.trim(), 10)).filter(num => !isNaN(num))
    let filters = []

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
          counseling_statuses!inner(id, name), 
          assessments!inner(responses)
          `)
        .eq("profiles.id", selectedStudentKey)
  
      if (counselingStatuses.length) { 
        query = query.in("counseling_statuses.id", counselingStatuses)
        filters.push(counselingStatuses.join(", "))
      }
      if (assessmentResults.length) { 
        query = query.in("assessment_scenarios.id", assessmentResults)
        filters.push(assessmentResults.join(", ")) 
      }
      
      if (minDate && maxDate) { 
        query = query.gte("created_at", minDate)
        query = query.lte("created_at", maxDate)
      }
      query = query.order("created_at", { ascending: false })
  
      const { data: reportData, error } = await query
      
      // For the domainData. Currently the rpc only reads the array structure of mappedData and not reportData
      // It will throw a postgres error for some reason
      const mappedData = reportData.map(item => {
        return {
          assessment_scenario: item.assessment_scenarios.name,
          created_at: item.created_at,
          responses: item.assessments.responses
        }
      })

      const { data: domainData } = await supabase.rpc("filter_assessments_by_domains", { mappeddata: mappedData, domain_ids: domainIds.length > 0 ? domainIds : Array.from({ length: 13 }, (_, i) => i + 1) })

      // merge domainData with reportData
      reportData.forEach((report, index) => {
        if (domainData[index]) {
            report['domains'] = domainData[index].response;
        } else {
            report['domains'] = [];
        }
      })
  
      if (error) { throw error }

      const { data: scenarioData, error: scenarioError } = await supabase
        .from('assessment_scenarios')
        .select('name, description')
        .order('id');

      if (scenarioError) {
        throw scenarioError
      }
      
      if (reportData.length) {
        setPopoverMessage("Generating PDF...")
        await pdf(<GeneratePDFByStudent
          reports={reportData} 
          scenarioData={scenarioData} 
          startDate={minDate}
          endDate={maxDate}
          recommendations={recommendations}
          filters={filters}
        />).toBlob()
        .then((blob) => {
          saveAs(blob, "report.pdf");
        })
        setPopoverMessage(null)
      } else {
        setPopoverMessage("No results found. Cannot generate PDF.")
      }
      

    } catch (error) {
      console.error(error)
    }
  }  

  const [, scrollerRef] = useInfiniteScroll({
    hasMore,
    isEnabled: isOpen,
    shouldUseLoader: false, // We don't want to show the loader at the bottom of the list
    onLoadMore,
  })

  const handleInputChange = (value) => {
    setFilterText(value)
  }

  const onSelectionChange = (id) => {
    setSelectedStudentKey(id)
  }

  const onEmptiedChange = () => {
    setSelectedStudentKey(null)
    setFilterText(null)
  }

  React.useEffect(() => {
    getCounselingStatuses()
    getDomains()
  }, [getCounselingStatuses, getDomains])

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
            <div className="flex flex-col gap-3">
              <Autocomplete                
                defaultInputValue={filterText}
                value={filterText}
                isLoading={isLoading}
                defaultItems={items}
                label="Student name"
                placeholder="Enter a student name..."
                variant="underlined"
                onInputChange={handleInputChange}
                scrollRef={scrollerRef}
                onOpenChange={setIsOpen}
                onSelectionChange={onSelectionChange}
                selectedKey={selectedStudentKey}
                isRequired
                shouldCloseOnBlur={false}
                onEmptied={onEmptiedChange}
              >
                {items.map((item) => 
                  <AutocompleteItem key={item.profiles.id} value={`${item.first_name} ${item.middle_name} ${item.last_name} ${item.name_suffix}`}>
                    {`${item.first_name} ${item.middle_name} ${item.last_name} ${item.name_suffix}`}
                    {/* {item.student_number && <p className="text-xs">{`${item.student_number}`}</p>} */}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <p className="mt-1 text-small text-default-500">Selected student: <b>{filterText}</b></p>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <Input type="date" label="Start date" name="startDate" placeholder="mm / dd / yyyy" min={minDate} onChange={handleDateChange} />
                <Input type="date" label="End date" name="endDate" placeholder="mm / dd / yyyy" min={minDate} max={maxDate} onChange={handleDateChange} />
              </div>
              
              <p className="font-bold text-sm pt-4">Filter by:</p>

              <Select
                items={domains}
                label="Domain(s)"
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
                onChange={handleDomainsChange}
                description="Assessments will be filtered with possible issues related to the selected domain(s)."
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
            <div className="pt-10">
              <Textarea label="Recommendations/Referral" value={recommendations} onValueChange={setRecommendations} />
            </div>
          </CardBody>
          <CardFooter>
            <div className="flex w-full justify-end">
              <Popover>
                <PopoverTrigger>
                  <Button type="submit" variant="shadow" color="primary">Generate</Button>
                </PopoverTrigger>
                {<PopoverContent hidden={!popoverMessage}>
                  {popoverMessage}
                </PopoverContent>}
              </Popover>
            </div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
