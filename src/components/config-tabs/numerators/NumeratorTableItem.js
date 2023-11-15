import { Button, TableCell, TableRow, ButtonStrip } from '@dhis2/ui'
import { Chip } from '@dhis2/ui-core'
import PropTypes from 'prop-types'
import React, { useMemo, useCallback, useState } from 'react'
import {
    CLEAR_NUMERATOR_DATA_MAPPING,
    DELETE_NUMERATOR,
    UPDATE_NUMERATOR,
    useConfigurations,
    useConfigurationsDispatch,
    useMetadataNames,
} from '../../../utils/index.js'
import { getNumeratorMemberGroups } from '../../../utils/numeratorsMetadataData.js'
import { ConfirmationModal } from '../ConfirmationModal.js'
import { EditNumeratorModal } from './EditNumeratorModal.js'
import styles from './NumeratorTableItem.module.css'

/** Manages the "update form" modal and datastore mutation */
const EditNumeratorButton = ({ numerator, groupsContainingNumerator }) => {
    const [editModalOpen, setEditModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setEditModalOpen(true), [])
    const closeModal = useCallback(() => setEditModalOpen(false), [])

    const updateNumerator = useCallback(
        ({ newNumeratorData, groupsContainingNumerator }) => {
            // todo: dispatch
            console.log({
                type: UPDATE_NUMERATOR,
                payload: {
                    code: numerator.code,
                    updatedNumeratorData: newNumeratorData,
                    groupsContainingNumerator,
                },
                dispatch,
            })
        },
        [dispatch, numerator.code]
    )

    // not all fields are needed for form initial values
    const numeratorDataForForm = useMemo(
        () => ({
            name: numerator.name,
            definition: numerator.definition,
            core: numerator.core,
            groups: groupsContainingNumerator.map((group) => group.code),
            // if not custom, some fields will be read-only
            custom: numerator.custom,
            // used to print: "This numerator is currently mapped to <dataItem>"
            dataID: numerator.dataID,
        }),
        [numerator, groupsContainingNumerator]
    )

    return (
        <>
            <Button small onClick={openModal}>
                Edit
            </Button>
            {editModalOpen && (
                <EditNumeratorModal
                    numeratorDataToEdit={numeratorDataForForm}
                    onSave={updateNumerator}
                    onClose={closeModal}
                />
            )}
        </>
    )
}
EditNumeratorButton.propTypes = {
    groupsContainingNumerator: PropTypes.array,
    numerator: PropTypes.object,
}

const ClearNumeratorButton = ({ numerator }) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setConfirmationModalOpen(true), [])
    const closeModal = useCallback(() => setConfirmationModalOpen(false), [])

    const clearNumerator = useCallback(
        () =>
            dispatch({
                type: CLEAR_NUMERATOR_DATA_MAPPING,
                payload: { code: numerator.code },
            }),
        [dispatch, numerator.code]
    )

    const isClearEnabled = useMemo(
        () => numerator.dataID || numerator.dataSetID?.length,
        [numerator]
    )

    return (
        <>
            <Button
                small
                onClick={openModal}
                disabled={!isClearEnabled}
                className={styles.clearOrDeleteButton}
            >
                Clear
            </Button>
            {confirmationModalOpen && (
                <ConfirmationModal
                    title="Clear numerator data mapping"
                    text={`Are you sure you want to clear the data mappings for ${numerator.name}?`}
                    action="Clear"
                    onClose={closeModal}
                    onConfirm={clearNumerator}
                />
            )}
        </>
    )
}
ClearNumeratorButton.propTypes = {
    numerator: PropTypes.object,
}

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
            <Button
                small
                destructive
                onClick={openModal}
                className={styles.clearOrDeleteButton}
            >
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
    const metadataNames = useMetadataNames()

    const groupsContainingNumerator = React.useMemo(
        () => getNumeratorMemberGroups(configurations, numerator.code),
        [configurations, numerator]
    )

    const dataSetNames = React.useMemo(() => {
        const { dataSetID } = numerator
        if (!dataSetID) {
            return
        }
        if (Array.isArray(dataSetID)) {
            return dataSetID
                .map((id) => metadataNames.get(id))
                .filter((e) => e)
                .join(', ')
        }
        return metadataNames.get(dataSetID)
    }, [metadataNames, numerator])

    return (
        <TableRow>
            <TableCell dense>
                {groupsContainingNumerator.map((group) => (
                    <Chip key={group.code} dense>
                        {group.displayName}
                    </Chip>
                ))}
            </TableCell>
            <TableCell dense>{numerator.name}</TableCell>
            <TableCell dense>{numerator.core ? '✔️' : ''}</TableCell>
            <TableCell dense>{metadataNames.get(numerator.dataID)}</TableCell>
            <TableCell dense>{dataSetNames}</TableCell>
            <TableCell dense>
                <ButtonStrip end>
                    <EditNumeratorButton
                        numerator={numerator}
                        groupsContainingNumerator={groupsContainingNumerator}
                    />
                    {numerator.custom ? (
                        <DeleteNumeratorButton numerator={numerator} />
                    ) : (
                        <ClearNumeratorButton numerator={numerator} />
                    )}
                </ButtonStrip>
            </TableCell>
        </TableRow>
    )
}
NumeratorTableItem.propTypes = {
    numerator: PropTypes.object,
}
