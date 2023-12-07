import { Button, TableCell, TableRow, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo, useCallback, useState } from 'react'
import { getDenominatorType } from '../../../utils/denominatorsMetadataData.js'
import {
    DELETE_DENOMINATOR,
    UPDATE_DENOMINATOR,
    useConfigurationsDispatch,
    useDataItemNames,
} from '../../../utils/index.js'
import { ConfirmationModal } from '../ConfirmationModal.js'
import { EditDenominatorModal } from './EditDenominatorModal.js'

/** Manages the "update form" modal and datastore mutation */
const EditDenominatorButton = ({ denominator }) => {
    const [editModalOpen, setEditModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setEditModalOpen(true), [])
    const closeModal = useCallback(() => setEditModalOpen(false), [])

    const updateDenominator = useCallback(
        ({ newDenominatorData }) => {
            dispatch({
                type: UPDATE_DENOMINATOR,
                payload: {
                    code: denominator.code,
                    updatedDenominatorData: newDenominatorData,
                },
            })
        },
        [dispatch, denominator.code]
    )

    // not all fields are needed for form initial values
    const denominatorDataForForm = useMemo(
        () => ({
            name: denominator.name,
            code: denominator.code,
            type: denominator.type,
            level: denominator.lowLevel,
            dataID: denominator.dataID,
        }),
        [denominator]
    )

    return (
        <>
            <Button small onClick={openModal}>
                Edit
            </Button>
            {editModalOpen && (
                <EditDenominatorModal
                    denominatorDataToEdit={denominatorDataForForm}
                    onSave={updateDenominator}
                    onClose={closeModal}
                />
            )}
        </>
    )
}
EditDenominatorButton.propTypes = {
    denominator: PropTypes.object,
}

const DeleteDenominatorButton = ({ denominator }) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
    const dataItemNames = useDataItemNames()
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setConfirmationModalOpen(true), [])
    const closeModal = useCallback(() => setConfirmationModalOpen(false), [])

    const deleteDenominator = useCallback(
        () =>
            dispatch({
                type: DELETE_DENOMINATOR,
                payload: { code: denominator.code },
            }),
        [dispatch, denominator.code]
    )

    return (
        <>
            <Button
                small
                destructive
                onClick={() => {
                    openModal()
                }}
            >
                Delete
            </Button>
            {confirmationModalOpen && (
                <ConfirmationModal
                    title="Delete denominator"
                    text={`Are you sure you want to delete ${dataItemNames.get(
                        denominator.dataID
                    )}?`}
                    action="Delete"
                    destructive
                    onClose={closeModal}
                    onConfirm={deleteDenominator}
                />
            )}
        </>
    )
}
DeleteDenominatorButton.propTypes = {
    denominator: PropTypes.object,
}

export const DenominatorTableItem = ({ denominator }) => {
    const dataItemNames = useDataItemNames()

    const denominatorType = React.useMemo(() => {
        return getDenominatorType(denominator.type).label
    }, [denominator])

    return (
        <TableRow>
            <TableCell dense>{dataItemNames.get(denominator.dataID)}</TableCell>
            <TableCell dense>{denominatorType}</TableCell>

            <TableCell dense>
                <ButtonStrip end>
                    <EditDenominatorButton denominator={denominator} />
                    <DeleteDenominatorButton denominator={denominator} />
                </ButtonStrip>
            </TableCell>
        </TableRow>
    )
}
DenominatorTableItem.propTypes = {
    denominator: PropTypes.object,
}
