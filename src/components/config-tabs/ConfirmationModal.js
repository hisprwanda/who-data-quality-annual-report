import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

export const ConfirmationModal = ({
    title,
    text,
    action,
    destructive,
    onClose,
    onConfirm,
}) => (
    <Modal onClose={onClose} position="middle">
        <ModalTitle>{title}</ModalTitle>
        <ModalContent>{text}</ModalContent>
        <ModalActions>
            <ButtonStrip end>
                <Button secondary onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    destructive={destructive}
                    primary={!destructive}
                    onClick={() => {
                        onConfirm()
                        onClose()
                    }}
                >
                    {action}
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
)
ConfirmationModal.propTypes = {
    action: PropTypes.string,
    destructive: PropTypes.bool,
    text: PropTypes.string,
    title: PropTypes.string,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
}
