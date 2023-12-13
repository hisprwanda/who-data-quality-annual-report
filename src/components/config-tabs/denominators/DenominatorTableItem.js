import { useAlert } from '@dhis2/app-runtime'
import { Button, TableCell, TableRow, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo, useCallback, useState } from 'react'
import { getDenominatorType } from '../../../utils/denominatorsMetadataData.js'
import {
    DELETE_DENOMINATOR,
    UPDATE_DENOMINATOR,
    useConfigurations,
    useConfigurationsDispatch,
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
    const configurations = useConfigurations()
    const { show } = useAlert(({ message }) => message, { critical: true })
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

    // Check to see if this denominator is used in any other metadata same as it is done for numerators
    // denominator relations or external relations and warn the user if so
    /**
     * //TODO: this is a copy of the same function in NumeratorTableItem.js,
     * so it should be refactored into a shared function and use switch statements to determine which metadata to check
     *  */
    const validateDenominatorDeletion = useCallback(() => {
        const associatedDenominatorRelations = []
        configurations.denominatorRelations.forEach((relation) => {
            const { A, B, name } = relation
            if (A === denominator.code || B === denominator.code) {
                associatedDenominatorRelations.push(name)
            }
        })

        const associatedExternalRelations = []
        configurations.externalRelations.forEach((relation) => {
            if (relation.denominator === denominator.code) {
                associatedExternalRelations.push(relation.name)
            }
        })

        if (
            associatedDenominatorRelations.length === 0 &&
            associatedExternalRelations.length === 0
        ) {
            // then no problem; this deletion is valid
            return true
        }

        // Otherwise, warn the user
        const numRelsText =
            associatedDenominatorRelations.length > 0
                ? '\nDenominator relations: ' +
                  associatedDenominatorRelations.join(', ') +
                  '.'
                : ''
        const extRelsText =
            associatedExternalRelations.length > 0
                ? '\nExternal relations: ' +
                  associatedExternalRelations.join(', ') +
                  '.'
                : ''
        const message =
            `Can't delete the denominator "${denominator.name}" because it's ` +
            `associated with the following metadata.` +
            numRelsText +
            extRelsText
        show({ message })
        return false
    }, [configurations, denominator, show])

    return (
        <>
            <Button
                small
                destructive
                onClick={() => {
                    if (validateDenominatorDeletion()) {
                        openModal()
                    }
                }}
            >
                Delete
            </Button>
            {confirmationModalOpen && (
                <ConfirmationModal
                    title="Delete denominator"
                    text={`Are you sure you want to delete ${
                        denominator.name ?? denominator.code
                    }?`}
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
    const denominatorType = React.useMemo(() => {
        return getDenominatorType(denominator.type).label
    }, [denominator])

    return (
        <TableRow>
            <TableCell dense>{denominator.name ?? denominator.code}</TableCell>
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
