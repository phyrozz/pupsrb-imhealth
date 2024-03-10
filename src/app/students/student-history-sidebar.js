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
  Chip
} from "@nextui-org/react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function StudentHistorySidebar({ user, onClose }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)
  const [assessmentHistory, setAssessmentHistory] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

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

  return (
    <Card className="h-full w-full">
      {user && (
        <>
          <CardHeader className="flex flex-row justify-between gap-1 text-black font-bold ">
            {`${user.first_name} ${user.middle_name} ${user.last_name} ${user.name_suffix}`}
            <Button isIconOnly color="primary" variant="light" onClick={onClose}>
              X
            </Button>
          </CardHeader>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <CardBody>
              <Table removeWrapper>
                <TableHeader>
                  <TableColumn></TableColumn>
                  <TableColumn>Result</TableColumn>
                  <TableColumn>Counseling Status</TableColumn>
                </TableHeader>
                <TableBody className="overflow-auto">
                  {assessmentHistory.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell>{new Date(assessment.created_at).toLocaleString()}</TableCell>
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
  )
}
