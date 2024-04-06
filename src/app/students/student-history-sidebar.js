import React, { useState } from "react"
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Progress,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  useDisclosure,
  Popover, PopoverContent, PopoverTrigger,
  Select, SelectItem
} from "@nextui-org/react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AssessmentResponsesModal from "./assessment-responses-modal"
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import GeneratePDFByStudent from "../generate-report/by-student/generate-pdf"
import IconIconEdit from "../components/edit-icon"
import IconClose from "../components/close-icon"
import ConfirmSendEmailModal from "./confirm-email-modal"
import IconBxSave from "../components/bx-save"

export default function StudentHistorySidebar({ user, onClose }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)
  const [assessmentHistory, setAssessmentHistory] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  // const [isOpen, setIsOpen] = React.useState(false)
  const [selectedAssessment, setSelectedAssessment] = React.useState(null)
  const {isOpen: isAssessmentResponsesModalOpen, onOpen: onAssessmentResponsesModalOpen, onOpenChange: onAssessmentResponsesModalOpenChange} = useDisclosure()
  const {isOpen: isConfirmEmailModalOpen, onOpen: onConfirmEmailModalOpen, onOpenChange: onConfirmEmailModalOpenChange} = useDisclosure()
  const [popoverMessage, setPopoverMessage] = React.useState(null)
  const [userId, setUserId] = React.useState(null)
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [counselingStatuses, setCounselingStatuses] = React.useState([])
  const [currentUserRole, setCurrentUserRole] = React.useState("")
  const [assessmentScenarios, setAssessmentScenarios] = React.useState([])
  const [hasMadeChanges, setHasMadeChanges] = useState(false)
  const [tempStatusChanges, setTempStatusChanges] = useState({})

  const getAssessmentHistory = React.useCallback(async () => {
    try {
      const { data, error, status } = await supabase
        .from("assessments")
        .select(
          `id, created_at, user_id, responses, apriori_results (id, apriori_result, counseling_statuses (id, name))`
        )
        .eq("user_id", user.user_id)
  
      const { data: counselingData } = await supabase
        .from("counseling_statuses")
        .select(`id, name`)
        .order('id')
      
      setUserId(user.user_id)
      setCounselingStatuses(counselingData)
  
      if (error && status !== 406) {
        throw error
      }
  
      // Map through data and add color key to each assessment object
      const assessmentsWithColor = data.map(assessment => ({
        ...assessment,
        color: getColorForAprioriResult(assessment.apriori_results[0].apriori_result)
      }))
  
      setAssessmentHistory(assessmentsWithColor)
      setIsLoading(false)
    } catch (e) {
      console.error(e)
    }
  }, [supabase, user.user_id])

  const getColorForAprioriResult = (result) => {
    switch (result) {
      case 0:
        return "default"
      case 1:
        return "primary"
      case 2:
        return "warning"
      case 3:
        return "danger"
      default:
        return "default"
    }
  }

  const getCurrentUserRole = async () => {
    try {
      const { data: userSession, error: userError } = await supabase.auth.getSession()

      if (userError) { throw userError }

      const userEmail = userSession.session.user.email
      const { data: adminData, error: adminError } = await supabase.from("admins").select("admin_roles!inner(role_name)").eq("email", userEmail).limit(1).single()

      if (adminError) { throw adminError }

      setCurrentUserRole(adminData.admin_roles.role_name)
    } catch (error) {
      console.error(error)
    }
  }

  const getAssessmentScenarios = async () => {
    try {
      const { data: scenarioData, error: scenarioError } = await supabase
        .from("assessment_scenarios")
        .select("id, name, description")
        .order("id")
  
      if (scenarioError) { throw scenarioError }
  
      const colors = ["default", "primary", "warning", "danger"]
  
      const scenariosWithColor = scenarioData.map((scenario, index) => ({
        ...scenario,
        color: colors[index % colors.length],
      }))
  
      setAssessmentScenarios(scenariosWithColor)
    } catch (error) {
      console.error(error)
    }
  }  

  React.useEffect(() => {
    setIsLoading(true)
    getAssessmentScenarios()
    getAssessmentHistory()
    getCurrentUserRole()
  }, [user, getAssessmentHistory])

  const handleRowClick = (id) => {
    setSelectedAssessment(id)
    onAssessmentResponsesModalOpen()
    // setIsOpen(true)
  }

  const handleCloseModal = () => {
    // setIsOpen(false)
    onConfirmEmailModalOpenChange()
    setHasMadeChanges(false)
  }

  const handleGenerateButton = async () => {
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
        .eq("profiles.id", userId)
  
      const { data: reportData, error } = await query
  
      if (error) { throw error }

      const { data: scenarioData, error: scenarioError } = await supabase
        .from('assessment_scenarios')
        .select('name, description')
        .order('id')

      if (scenarioError) {
        throw scenarioError
      }
      
      if (reportData.length) {
        setPopoverMessage("Generating PDF...")
        await pdf(<GeneratePDFByStudent
          reports={reportData} 
          scenarioData={scenarioData} 
        />).toBlob()
        .then((blob) => {
          saveAs(blob, "report.pdf")
        })
        setPopoverMessage(null)
      } else {
        setPopoverMessage("No results found. Cannot generate PDF.")
      }
      

    } catch (error) {
      console.error(error)
    }
  }

  const handleEditButton = () => {
    if (isEditMode) {
      if (hasMadeChanges) {
        onConfirmEmailModalOpen()
      } else {
        setIsEditMode(false)
      }
    } else {
      setIsEditMode(true)
    }
  }

  // const handleUpdateStatus = async (assessmentId, newStatusId) => {
  //   try {
  //     // Update the counseling status for the selected assessment in Supabase
  //     const { data } = await supabase
  //       .from("apriori_results")
  //       .update({ "counseling_status_id": newStatusId })
  //       .select(`counseling_statuses!inner(name)`)
  //       .eq("assessment_id", assessmentId)
  
  //     // Find the name of the new status
  //     const newStatus = counselingStatuses.find((status) => status.name === data[0].counseling_statuses.name)
  
  //     // Update the local assessment history with the new status
  //     setAssessmentHistory((prevHistory) =>
  //     prevHistory.map((assessment) =>
  //       assessment.id === assessmentId
  //         ? {
  //             ...assessment,
  //             apriori_results: assessment.apriori_results.map((result) =>
  //                   ({
  //                     ...result,
  //                     counseling_statuses: { 
  //                       name: newStatus.name,
  //                       id: newStatus.id,
  //                     },
  //                   })
  //             ),
  //         }
  //         : assessment
  //       )
  //     )

  //     // Set to true when any changes were made on the status dropdowns to make the confirm modal appear
  //     setHasMadeChanges(true)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }  

  const handleTempStatusChange = (assessmentId, newStatusId) => {
    setTempStatusChanges(prevState => ({
      ...prevState,
      [assessmentId]: newStatusId
    }))

    setHasMadeChanges(true)
  }

  const handleConfirmChanges = async () => {
    try {
      // Update statuses in Supabase using tempStatusChanges
      for (const [assessmentId, newStatusId] of Object.entries(tempStatusChanges)) {
        const { data } = await supabase
          .from("apriori_results")
          .update({ "counseling_status_id": newStatusId })
          .select("counseling_statuses!inner(name)")
          .eq("assessment_id", assessmentId)
  
        // Find the name of the new status
        const newName = data[0].counseling_statuses.name
  
        // Update the local assessment history with the new status name
        setAssessmentHistory(prevHistory =>
          prevHistory.map(assessment => 
            assessment.id === assessmentId ? ({
            ...assessment,
            apriori_results: assessment.apriori_results.map(result => ({
              ...result,
              counseling_statuses: {
                name: newName,
                id: result.counseling_statuses.id
              }
            }))
          }) : assessment)
        )
      }
  
      // Reset temporary status changes
      setTempStatusChanges({})
  
      // Close the confirmation modal
      onConfirmEmailModalOpenChange()
      setIsEditMode(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancelChanges = () => {
    setIsEditMode(false)
    setHasMadeChanges(false)
    setTempStatusChanges({})
    onConfirmEmailModalOpenChange()
  }
  
  return (
    <>
      <ConfirmSendEmailModal isOpen={isConfirmEmailModalOpen} onOpenChange={onConfirmEmailModalOpenChange} onClose={handleCloseModal} onConfirm={handleConfirmChanges} onCancel={handleCancelChanges} />
      <AssessmentResponsesModal assessmentId={selectedAssessment} isOpen={isAssessmentResponsesModalOpen} onOpenChange={onAssessmentResponsesModalOpenChange} />
      <Card className="h-full w-full overflow-auto" aria-label="Sidebar Card">
        {user && (
          <>
            {isLoading ? <Progress isIndeterminate size="sm" aria-label="Sidebar Loading" /> :
              <>
                <CardHeader className="flex flex-row justify-between gap-1 text-black font-bold" aria-label="Sidebar Card Header">
                  {`${user.first_name} ${user.middle_name} ${user.last_name} ${user.name_suffix}`}
                  <Button isIconOnly color="primary" variant="light" onClick={onClose}>
                    <IconClose />
                  </Button>
                </CardHeader>
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
                        { label: "Student Number", value: user.student_number },
                        { label: "Email address", value: user.email },
                        { label: "Birth date", value: new Date(user.birth_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                        { label: "Program", value: user.program_name },
                        { label: "Year", value: user.year },
                        { label: "Marital Status", value: user.marital_status },
                        { label: "Working Student?", value: user.is_working_student ? "Yes" : "No" },
                      ].map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-right font-bold">{item.label}</TableCell>
                          <TableCell>{item.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="w-full flex flex-row justify-between items-center pb-1">
                    <h1 className="text-xl font-bold pb-3">Assessment History</h1>
                    {(currentUserRole === "guidance_counselor" || currentUserRole === "clinician" || currentUserRole === "su_admin") && <Button variant={isEditMode ? "shadow" : "light"} onClick={handleEditButton}>
                      {isEditMode ? <><IconBxSave /> Save Changes</> : <><IconIconEdit /> Edit Status(es)</>}
                    </Button>}
                  </div>
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
                          <TableCell><Chip radius="full" color={assessment.color}>{assessment.apriori_results && assessment.apriori_results.length > 0 ? assessment.apriori_results[0].apriori_result : 'N/A'}</Chip></TableCell>
                          <TableCell>
                            {isEditMode ? (
                              <Select
                                items={counselingStatuses}
                                defaultSelectedKeys={[String(assessment.apriori_results[0].counseling_statuses.id)]}
                                value={assessment.apriori_results[0].counseling_statuses_id}
                                size="sm"
                                onChange={(newStatusId) => handleTempStatusChange(assessment.id, newStatusId.target.value)}
                              >
                                {counselingStatuses.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                              </Select>
                            ) : (
                              <Chip color="default">{assessment.apriori_results && assessment.apriori_results.length > 0 ? (assessment.apriori_results[0].counseling_statuses ? assessment.apriori_results[0].counseling_statuses.name : 'N/A') : 'N/A'}</Chip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="w-full flex justify-end items-center my-4">
                    <Popover>
                      <PopoverTrigger>
                        <Button variant="shadow" color="primary" onClick={handleGenerateButton}>Generate Report</Button>
                      </PopoverTrigger>
                      {<PopoverContent hidden={!popoverMessage}>
                        {popoverMessage}
                      </PopoverContent>}
                    </Popover>
                  </div>
                  <div className="w-full flex flex-row justify-between items-center pb-1">
                    <h1 className="text-xl font-bold pb-3">Result Interpretations</h1>
                  </div>
                  <Table removeWrapper selectionMode="single" aria-label="Result Interpretations Table">
                    <TableHeader aria-label="Result Interpretations Table Header">
                      <TableColumn>Result</TableColumn>
                      <TableColumn>Scenario</TableColumn>
                      <TableColumn>Description</TableColumn>
                    </TableHeader>
                    <TableBody className="overflow-auto" aria-label="Result Interpretations Table Body">
                      {assessmentScenarios.map((scenario) => (
                        <TableRow key={scenario.id}>
                          <TableCell>{scenario.id}</TableCell>
                          <TableCell><Chip size="sm" radius="full" color={scenario.color}>{scenario.name}</Chip></TableCell>
                          <TableCell>{scenario.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardBody>
              </>
            }
          </>
        )}
      </Card>
    </>
  )
}
