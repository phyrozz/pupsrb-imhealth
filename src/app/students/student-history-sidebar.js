import React from "react"
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  CircularProgress,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  useDisclosure
} from "@nextui-org/react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AssessmentResponsesModal from "./assessment-responses-modal"

export default function StudentHistorySidebar({ user, onClose }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)
  const [assessmentHistory, setAssessmentHistory] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  // const [isOpen, setIsOpen] = React.useState(false)
  const [selectedAssessment, setSelectedAssessment] = React.useState(null)
  const {isOpen, onOpen, onOpenChange} = useDisclosure()

  const getAssessmentHistory = React.useCallback(async () => {
    try {
      const { data, error, status } = await supabase
        .from("assessments")
        .select(
          `id, created_at, user_id, responses, apriori_results (apriori_result, counseling_statuses (name))`
        )
        .eq("user_id", user.profiles.id)

      if (error && status !== 406) {
        throw error
      }

      setAssessmentHistory(data)
      setIsLoading(false)
    } catch (e) {
      console.error(e)
    }
  }, [supabase, user.profiles.id])

  React.useEffect(() => {
    getAssessmentHistory()
  }, [getAssessmentHistory])

  const handleRowClick = (id) => {
    setSelectedAssessment(id)
    onOpen()
    // setIsOpen(true)
  }

  const handleCloseModal = () => {
    // setIsOpen(false)
  }

  return (
    <>
      <AssessmentResponsesModal assessmentId={selectedAssessment} isOpen={isOpen} onOpenChange={onOpenChange} />
      <Card className="h-full w-full overflow-auto" aria-label="Sidebar Card">
        {user && (
          <>
            <CardHeader className="flex flex-row justify-between gap-1 text-black font-bold" aria-label="Sidebar Card Header">
              {`${user.first_name} ${user.middle_name} ${user.last_name} ${user.name_suffix}`}
              <Button isIconOnly color="primary" variant="light" onClick={onClose}>
                X
              </Button>
            </CardHeader>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <CardBody aria-label="Sidebar Card Body">
                <h1 className="text-xl font-bold pb-3">Personal Details</h1>
                <Table hideHeader removeWrapper className="pb-5" aria-label="Student Details Table">
                  <TableHeader aria-label="Student Details Table Header">
                    <TableColumn aria-label="Details"></TableColumn>
                    <TableColumn aria-label="Details Value"></TableColumn>
                  </TableHeader>
                  <TableBody className="overflow-auto" aria-label="Student Details Table Body">
                    {[
                      { label: "Name", value: `${user.first_name} ${user.middle_name} ${user.last_name} ${user.name_suffix}` },
                      { label: "Email address", value: user.email },
                      { label: "Birth date", value: new Date(user.birth_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                      { label: "Program", value: user.programs.name },
                      { label: "Year", value: user.year },
                      { label: "Marital Status", value: user.marital_statuses.status },
                      { label: "Working Student?", value: user.is_working_student ? "Yes" : "No" },
                    ].map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-right font-bold">{item.label}</TableCell>
                        <TableCell>{item.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <h1 className="text-xl font-bold pb-3">Assessment History</h1>
                <Table removeWrapper selectionMode="single" aria-label="Assessment History Table">
                  <TableHeader aria-label="Assessment History Table Header">
                    <TableColumn></TableColumn>
                    <TableColumn>Result</TableColumn>
                    <TableColumn>Counseling Status</TableColumn>
                  </TableHeader>
                  <TableBody className="overflow-auto" emptyContent={"No answered assessment."} aria-label="Assessment History Table Body">
                    {assessmentHistory.map((assessment) => (
                      <TableRow key={assessment.id} onClick={() => handleRowClick(assessment.id)}>
                        <TableCell>{new Date(assessment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true  })}</TableCell>
                        <TableCell>{assessment.apriori_results && assessment.apriori_results.length > 0 ? assessment.apriori_results[0].apriori_result : 'N/A'}</TableCell>
                        <TableCell>
                          <Chip color="default">{assessment.apriori_results && assessment.apriori_results.length > 0 ? (assessment.apriori_results[0].counseling_statuses ? assessment.apriori_results[0].counseling_statuses.name : 'N/A') : 'N/A'}</Chip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            )}
          </>
        )}
      </Card>
    </>
  )
}
