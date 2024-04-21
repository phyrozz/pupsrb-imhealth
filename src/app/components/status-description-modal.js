import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalContent, ModalHeader, Button, Table, TableHeader, TableBody, TableColumn, TableCell, TableRow, CircularProgress } from '@nextui-org/react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"


export default function StatusDescriptionModal({isOpen, onOpenChange}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClientComponentClient(supabaseUrl, supabaseKey)

  const [statuses, setStatuses] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  
  const getStatuses = React.useCallback(
    async () => {
      try {
        const { data, error } = await supabase
          .from("counseling_statuses")
          .select("name, description")

        if (error) { throw error }

        setStatuses(data)
        setIsLoading(false)
      } catch (error) {
        console.error(error)
      }
    },
    [supabase],
  )
  
  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      getStatuses()
    }
  }, [getStatuses, isOpen])
  

  const handleOnClose = () => {
    onOpenChange()
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} aria-label='Status Description Modal'>
      <ModalContent aria-label='Status Description Modal Content'>
        <>
          {isLoading ? 
            <div className='w-full h-96 flex justify-center items-center'>
              <CircularProgress />
            </div>
          : 
            <>
              <ModalHeader aria-label='Status Description Modal Header'>
                <h1>Status Descriptions</h1>
              </ModalHeader>
              <ModalBody aria-label='Status Description Modal Body'>
                <Table removeWrapper aria-label='Status Description Table'>
                  <TableHeader aria-label='Status Description Table Header'>
                    <TableColumn className="text-right" aria-label='Status Name'>Name</TableColumn>
                    <TableColumn aria-label='Status Description'>Description</TableColumn>
                  </TableHeader>
                  <TableBody aria-label='Status Description Table Body'>
                    {statuses.map((status, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-right font-bold">{status.name}</TableCell>
                        <TableCell>{status.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter aria-label='Status Description Modal Footer'>
                <Button color="primary" onPress={handleOnClose}>Close</Button>
              </ModalFooter>
            </>
          }
        </>
      </ModalContent>
    </Modal>
  )
}