import { Button, TableCell, TableRow, ButtonStrip } from '@dhis2/ui'
import { Chip } from '@dhis2/ui-core'
import PropTypes from 'prop-types'
import React, { useMemo, useCallback, useState } from 'react'
import {
    DELETE_NUMERATOR,
    useConfigurations,
    useConfigurationsDispatch,
} from '../../../utils/index.js'
import {
    getNumeratorDataElement,
    getNumeratorDataset,
    getNumeratorMemberGroups,
} from '../../../utils/numeratorsMetadataData.js'
import { ConfirmationModal } from '../ConfirmationModal.js'
// import { EditNumeratorModal } from './EditNumeratorModal.js'

const DeleteNumeratorButton = ({ numerator }) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setConfirmationModalOpen(true), [])
    const closeModal = useCallback(() => setConfirmationModalOpen(false), [])

    const deleteNumerator = useCallback(
        () =>
            dispatch({
                type: DELETE_NUMERATOR,
                payload: { code: numerator.code },
            }),
        [dispatch, numerator.code]
    )

    return (
        <>
            <Button small destructive onClick={openModal}>
                Delete
            </Button>
            {confirmationModalOpen && (
                <ConfirmationModal
                    title="Delete numerator"
                    // todo: additional warning text if this also removes numerator and external relations
                    text={`Are you sure you want to delete ${numerator.name}?`}
                    action="Delete"
                    destructive
                    onClose={closeModal}
                    onConfirm={deleteNumerator}
                />
            )}
        </>
    )
}
DeleteNumeratorButton.propTypes = {
    numerator: PropTypes.object,
}

export const NumeratorTableItem = ({ numerator }) => {
    const configurations = useConfigurations()

    const isClearEnabled = useMemo(
        () => numerator.dataID || numerator.dataSetID?.length,
        [numerator]
    )

    return (
        <TableRow>
            <TableCell>
                {getNumeratorMemberGroups(configurations, numerator.code).map(
                    (group, key) => (
                        <Chip key={key} dense>
                            {group.displayName}
                        </Chip>
                    )
                )}
            </TableCell>
            <TableCell>{numerator.name}</TableCell>
            <TableCell>{numerator.core ? '✔️' : ''}</TableCell>
            <TableCell>
                {getNumeratorDataElement(
                    configurations.numerators,
                    numerator.dataID
                )}
            </TableCell>
            <TableCell>
                {getNumeratorDataset(configurations, numerator.dataSetID)}
            </TableCell>
            <TableCell>
                <ButtonStrip end>
                    <Button small onClick={() => alert('todo: edit')}>
                        Edit
                    </Button>
                    {numerator.custom ? (
                        <DeleteNumeratorButton numerator={numerator} />
                    ) : (
                        <Button
                            small
                            onClick={() => alert('todo: clear')}
                            disabled={!isClearEnabled}
                        >
                            Clear
                        </Button>
                    )}
                </ButtonStrip>
            </TableCell>
        </TableRow>
    )
}
NumeratorTableItem.propTypes = {
    numerator: PropTypes.object,
}
