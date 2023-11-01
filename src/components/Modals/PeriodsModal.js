import { PeriodDimension } from '@dhis2/analytics'
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

export function PeriodsModal({
    isHiddenPeriod,
    currentlySelected = [],
    toggleModal,
    onSave,
}) {
    const [selected, setSelected] = useState(currentlySelected)

    return (
        <Modal onClose={toggleModal} hide={isHiddenPeriod}>
            <ModalTitle>{i18n.t('Select period(s)')}</ModalTitle>
            <ModalContent>
                <PeriodDimension
                    maxSelections={2}
                    selectedPeriods={selected}
                    onSelect={({ items }) => setSelected(items)}
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

PeriodsModal.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    currentlySelected: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            path: PropTypes.string,
        })
    ),
    isHiddenPeriod: PropTypes.bool,
}

export default PeriodsModal
