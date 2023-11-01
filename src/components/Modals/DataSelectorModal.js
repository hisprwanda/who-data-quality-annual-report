import { DataDimension } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

export const DataSelectorModal = ({
    isHiddenDataModal,
    currentlySelected = [],
    toggleModal,
    onSave,
}) => {
    const [selected, setSelected] = useState(currentlySelected)

    return (
        <Modal onClose={toggleModal} hide={isHiddenDataModal} large>
            <ModalTitle>{i18n.t('Select period(s)')}</ModalTitle>
            <ModalContent>
                <DataDimension
                    displayNameProp="displayName"
                    selectedDimensions={currentlySelected}
                    infoBoxMessage=""
                    onSelect={({ items }) => setSelected(items)}
                    onCalculationSave={onSave}
                />
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={toggleModal}>{i18n.t('Cancel')}</Button>
                    <Button
                        primary
                        onClick={() => {
                            onSave(selected)
                            toggleModal()
                        }}
                    >
                        {i18n.t('Save')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

DataSelectorModal.propTypes = {
    currentlySelected: PropTypes.array,
    isHiddenDataModal: PropTypes.bool,
    toggleModal: PropTypes.func,
    onSave: PropTypes.func,
}
