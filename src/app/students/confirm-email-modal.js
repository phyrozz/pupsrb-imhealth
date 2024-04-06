import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalContent, ModalHeader, Button } from '@nextui-org/react'

export default function ConfirmSendEmailModal({isOpen, onOpenChange, onClose, onConfirm, onCancel}) {

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
      <ModalContent>
        <>
          <ModalHeader>
            <h1>Confirm to send email</h1>
          </ModalHeader>
          <ModalBody>
            <p>Saving your changes will send an email to the student about the updated status of their assessment(s). Are you sure you want to save your changes?</p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onCancel}>Cancel</Button>
            <Button color="primary" onPress={handleConfirm}>Yes</Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  )
}