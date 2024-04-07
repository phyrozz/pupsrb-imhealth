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
            <h1>Confirm changes</h1>
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to save your changes?</p>
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