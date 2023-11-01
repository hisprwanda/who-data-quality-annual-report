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

const WarningModal = ({ onClose, isHidden, onDelete }) => {
    return (
        <Modal onClose={onClose} hide={isHidden} position="middle">
            <ModalTitle>Warning</ModalTitle>
            <ModalContent>
                {`Are you sure you want to clear this numerator's content?`}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>
                        Cancel
                    </Button>
                    <Button destructive onClick={onDelete}>
                        Delete
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

WarningModal.propTypes = {
    isHidden: PropTypes.bool,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
}

export default WarningModal
