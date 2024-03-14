import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, CircularProgress, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@nextui-org/react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import assessmentData from './assessment_questions.json'

export default function AssessmentResponsesModal({ assessmentId, isOpen, onOpenChange }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)
  const [responses, setResponses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getAssessmentResponse = async () => {
    try {
      const { data, error, status } = await supabase
        .from("assessments")
        .select(`responses`)
        .eq("id", assessmentId)

      if (error && status !== 406) {
        throw error
      }

      setResponses(data[0].responses)
      setIsLoading(false)
    } catch (e) {
      console.error(e)
    }
  };

  useEffect(() => {
    getAssessmentResponse()
  }, [assessmentId])

  const getChipColor = (responseIndex) => {
    const responseValue = responses[responseIndex]
    switch (responseValue) {
      case 0:
        return "default"
      case 1:
        return "primary"
      case 2:
        return "secondary"
      case 3:
        return "warning"
      case 4:
        return "danger"
      default:
        return "default"
    }
  }

  // Flatten questions into a single array
  const flattenedQuestions = assessmentData.questions.map((question, index) => ({
    index,
    question: question.question,
    domain: question.domain
  }))

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" size="3xl">
      <ModalContent>
        {onClose => (
          <>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <>
                <ModalHeader className="flex flex-col gap-1 text-black">Responses</ModalHeader>
                <ModalBody>
                  <Table removeWrapper>
                    <TableHeader>
                      <TableColumn></TableColumn>
                      <TableColumn></TableColumn>
                      <TableColumn>Question</TableColumn>
                      <TableColumn align="end" className="text-right">Answer</TableColumn>
                    </TableHeader>
                    <TableBody className="overflow-auto">
                      {flattenedQuestions.map(({ index, question, domain }) => (
                        <TableRow key={index}>
                          <TableCell><b>{`${domain}`}</b></TableCell>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{question}</TableCell>
                          <TableCell align="end" className="text-right">
                            <Chip radius="sm" color={getChipColor(index)}>
                              {assessmentData.responses[responses[index]]}
                            </Chip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
