"use client"
import React from 'react'
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Pagination, 
  CircularProgress, 
  Input,
  Dropdown, DropdownItem, DropdownMenu, DropdownTrigger,
  Button,
  Autocomplete, AutocompleteItem,
  useDisclosure,
  Chip,
  Tooltip
} from '@nextui-org/react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'
import AssessmentResponsesModal from '../components/assessment-responses-modal'
import StudentHistorySidebar from '../components/student-history-sidebar'
import { SearchIcon } from '../icons/search-icon'
import IconFiltering from '../icons/filter-icon'


export default function StudentAssessmentsTable() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)
  const [isLoading, setIsLoading] = React.useState(true)
  const [assessments, setAssessments] = React.useState([])
  const [page, setPage] = React.useState(1)
  const [assessmentCount, setAssessmentCount] = React.useState(0)
  const [selectedAssessment, setSelectedAssessment] = React.useState(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState(null)
  const {isOpen: isAssessmentResponsesModalOpen, onOpen: onAssessmentResponsesModalOpen, onOpenChange: onAssessmentResponsesModalOpenChange} = useDisclosure()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [scenarios, setScenarios] = React.useState([])
  const [statusNames, setStatusNames] = React.useState([])
  const [filterByScenario, setFilterByScenario] = React.useState("")
  const [filterByStatusName, setFilterByStatusName] = React.useState("")

  const rowsPerPage = 20

  const pages = Math.ceil(assessmentCount / rowsPerPage)

  const getAssessments = React.useCallback(
    async () => {
      try {
        const { data, error } = await supabase.rpc("get_assessments_table", { 
          search_query: searchQuery,
          selected_scenario_name: filterByScenario,
          selected_status_name: filterByStatusName,
          page_size: rowsPerPage,
          page_number: page
        }) 
  
        if (error) { throw error }
  
        // Map through data and add color key to each assessment object
        const assessmentsWithColor = data.map(assessment => ({
          ...assessment,
          color: getColorForAprioriResult(assessment.result_scenario)
        }))
  
        setAssessments(assessmentsWithColor)
        setAssessmentCount(data[0].total_count)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    },
    [filterByScenario, filterByStatusName, page, searchQuery, supabase],
  )

  const getScenarios = React.useCallback(
    async () => {
      try {
        const { data, error } = await supabase
          .from("assessment_scenarios")
          .select(`name`)
        
        if (error) { throw error }
  
        setScenarios(data)
      } catch (error) {
        console.error(error)
      }
    },
    [supabase],
  )

  const getStatusNames = React.useCallback(
    async () => {
      try {
        const { data, error } = await supabase
          .from("counseling_statuses")
          .select(`name`)
        
        if (error) { throw error }
  
        setStatusNames(data)
      } catch (error) {
        console.error(error)
      }
    },
    [supabase],
  )

  const getColorForAprioriResult = (result) => {
    switch (result) {
      case "None":
        return "default"
      case "Scenario 1":
        return "primary"
      case "Scenario 2":
        return "warning"
      case "Scenario 3":
        return "danger"
      default:
        return "default"
    }
  }

  const handleScenarioClick = (id) => {
    setSelectedAssessment(id)
    onAssessmentResponsesModalOpen()
  }

  const handleStudentClick = (user) => {
    setSelectedUser(user)
    setIsOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsOpen(false)
  }

  const handleSearch = (e) => {
    const { value } = e.target
    setSearchQuery(value)
    if (value.trim() !== "") {
      setPage(1)
    }
  }

  const handleByScenarioAutocompleteChange = (key) => {
    setFilterByScenario(key)
  }

  const handleByStatusNameAutocompleteChange = (key) => {
    setFilterByStatusName(key)
  }

  React.useEffect(() => {
    getAssessments()
    getScenarios()
    getStatusNames()
  }, [page, searchQuery, filterByScenario, filterByStatusName, getAssessments, getScenarios, getStatusNames])

  return (
    <>
      <AssessmentResponsesModal assessmentId={selectedAssessment} isOpen={isAssessmentResponsesModalOpen} onOpenChange={onAssessmentResponsesModalOpenChange} />
      {isLoading ? 
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <CircularProgress aria-label="Loading..." />
      </div>
      :
      <>
        <div className="w-full pb-3 flex flex-row flex-wrap md:flex-nowrap justify-end items-center gap-3">
          <IconFiltering />
          <Autocomplete
            label="by Scenario"
            items={scenarios}
            size="sm"
            className="max-w-40"
            isClearable={false}
            defaultSelectedKey={""}
            onSelectionChange={handleByScenarioAutocompleteChange}
          >
            <AutocompleteItem key="">All</AutocompleteItem>
            {scenarios.map((scenario) => 
              <AutocompleteItem key={scenario.name}>
                {scenario.name}
              </AutocompleteItem>)}
          </Autocomplete>

          <Autocomplete
            label="by Status"
            items={statusNames}
            size="sm"
            className="max-w-52"
            isClearable={false}
            defaultSelectedKey={""}
            onSelectionChange={handleByStatusNameAutocompleteChange}
          >
            <AutocompleteItem key="">All</AutocompleteItem>
            {statusNames.map((status) => 
              <AutocompleteItem key={status.name}>
                {status.name}
              </AutocompleteItem>)}
          </Autocomplete>

          <Input
            isClearable
            variant="faded"
            radius="md"
            size="lg"
            className="w-96"
            placeholder="Search by student..."
            value={searchQuery}
            onChange={handleSearch}
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
            }
            onClear={() => setSearchQuery("")}
          />
        </div>
        <div className={isOpen ? "grid grid-cols-12 gap-3" : ""}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className="md:col-span-8 col-span-12 min-h-[90.3vh]"
          >
            <Table
              isStriped
              aria-label="Assessments table"
              bottomContent={
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              }
              className="text-slate-900"
            >
              <TableHeader>
                <TableColumn></TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Student Number</TableColumn>
                <TableColumn>Result</TableColumn>
                <TableColumn>Status</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"No rows to display."}>
                {assessments.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true  })}</TableCell>
                    <TableCell className="cursor-pointer" onClick={() => handleStudentClick(item)}><Tooltip content="View Student's Detail" size="sm" placement="left" showArrow><p>{`${item.first_name} ${item.middle_name} ${item.last_name} ${item.name_suffix}`}</p></Tooltip></TableCell>
                    <TableCell>{item.student_number}</TableCell>
                    <TableCell className="cursor-pointer" onClick={() => handleScenarioClick(item.id)}><Tooltip content="View Assessment Responses" size="sm" showArrow><Chip radius="full" color={item.color}>{item.result_scenario}</Chip></Tooltip></TableCell>
                    <TableCell>{item.counseling_status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                ease: [0, 0.71, 0.2, 1.01],
              }}
              className="md:col-span-4 col-span-12 md:static fixed md:h-full h-[80vh] md:w-full w-[94.5vw]"
            >
              <StudentHistorySidebar
                user={selectedUser}
                onClose={handleCloseSidebar}
              />
            </motion.div>
          )}
        </div>
      </>
      }
    </>
  )
}
