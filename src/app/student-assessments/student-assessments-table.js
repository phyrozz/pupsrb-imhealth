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
import AssessmentResponsesModal from '../students/assessment-responses-modal'
import StudentHistorySidebar from '../students/student-history-sidebar'


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
  const rowsPerPage = 20

  const pages = Math.ceil(assessmentCount / rowsPerPage)

  const getAssessments = async () => {
    try {
      const { data, error } = await supabase.rpc("get_assessments_table", { 
        search_query: "",
        selected_scenario_name: "",
        selected_status_name: "",
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
  }

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

  React.useEffect(() => {
    getAssessments()
  }, [page])

  return (
    <>
      <AssessmentResponsesModal assessmentId={selectedAssessment} isOpen={isAssessmentResponsesModalOpen} onOpenChange={onAssessmentResponsesModalOpenChange} />
      {isLoading ? 
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <CircularProgress aria-label="Loading..." />
      </div>
      :
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
              <TableColumn>Counseling Status</TableColumn>
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
      }
    </>
  )
}
