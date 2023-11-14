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

// todo: this could be shared with other components --
// if so, move out of this dir

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
                    onClick={onConfirm}
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
