import { useAlert } from '@dhis2/app-runtime'
import {
    Button,
    ButtonStrip,
    IconCheckmark24,
    TableCell,
    TableRow,
} from '@dhis2/ui'
import { Chip } from '@dhis2/ui-core'
import PropTypes from 'prop-types'
import React, { useMemo, useCallback, useState } from 'react'
import {
    CLEAR_NUMERATOR_DATA_MAPPING,
    DELETE_NUMERATOR,
    UPDATE_NUMERATOR,
    useConfigurations,
    useConfigurationsDispatch,
    useDataItemNames,
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
        ({
            newNumeratorData,
            groupsContainingNumerator,
            dataSetsContainingNumerator,
        }) => {
            dispatch({
                type: UPDATE_NUMERATOR,
                payload: {
                    code: numerator.code,
                    updatedNumeratorData: newNumeratorData,
                    groupsContainingNumerator,
                    dataSetsContainingNumerator,
                },
            })
        },
        [dispatch, numerator.code]
    )

    // not all fields are needed for form initial values
    const numeratorDataForForm = useMemo(
        () => ({
            name: numerator.name,
            core: numerator.core,
            definition: numerator.definition,
            groups: groupsContainingNumerator.map((group) => group.code),
            // if not custom, some fields will be read-only
            custom: numerator.custom,
            // used to print: "This numerator is currently mapped to <dataItem>"
            prevDataID: numerator.dataID,
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
    const configurations = useConfigurations()
    const { show } = useAlert(({ message }) => message, { critical: true })
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

    // Check to see if this numerator is used in any other metadata like
    // numerator relations or external relations -- if so, it can't be deleted
    const validateDeletion = useCallback(() => {
        const associatedNumeratorRelations = []
        configurations.numeratorRelations.forEach((relation) => {
            const { A, B, name } = relation
            if (A === numerator.code || B === numerator.code) {
                associatedNumeratorRelations.push(name)
            }
        })

        const associatedExternalRelations = []
        configurations.externalRelations.forEach((relation) => {
            if (relation.numerator === numerator.code) {
                associatedExternalRelations.push(relation.name)
            }
        })

        if (
            associatedNumeratorRelations.length === 0 &&
            associatedExternalRelations.length === 0
        ) {
            // then no problem; this deletion is valid
            return true
        }

        // Otherwise, warn the user
        const numRelsText =
            associatedNumeratorRelations.length > 0
                ? '\nNumerator relations: ' +
                  associatedNumeratorRelations.join(', ') +
                  '.'
                : ''
        const extRelsText =
            associatedExternalRelations.length > 0
                ? '\nExternal relations: ' +
                  associatedExternalRelations.join(', ') +
                  '.'
                : ''
        const message =
            `Can't delete the numerator "${numerator.name}" because it's ` +
            `associated with the following metadata.` +
            numRelsText +
            extRelsText
        show({ message })
        return false
    }, [configurations, numerator, show])

    return (
        <>
            <Button
                small
                destructive
                onClick={() => {
                    if (validateDeletion()) {
                        openModal()
                    }
                }}
                className={styles.clearOrDeleteButton}
            >
                Delete
            </Button>
            {confirmationModalOpen && (
                <ConfirmationModal
                    title="Delete numerator"
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
    const dataItemNames = useDataItemNames()

    const groupsContainingNumerator = React.useMemo(
        () => getNumeratorMemberGroups(configurations, numerator.code),
        [configurations, numerator]
    )

    const getDataSetName = useCallback(
        (id) =>
            configurations.dataSets.find((dataSet) => dataSet.id === id)?.name,
        [configurations]
    )

    const dataSetNames = React.useMemo(() => {
        const { dataSetID } = numerator
        if (!dataSetID) {
            return
        }
        if (Array.isArray(dataSetID)) {
            return dataSetID
                .map((id) => getDataSetName(id))
                .filter((e) => e)
                .join(', ')
        }
        return getDataSetName(dataSetID)
    }, [getDataSetName, numerator])

    return (
        <TableRow>
            <TableCell dense>
                {groupsContainingNumerator.map((group) => (
                    <Chip key={group.code} dense>
                        {group.name}
                    </Chip>
                ))}
            </TableCell>
            <TableCell dense>{numerator.name}</TableCell>
            <TableCell dense>{numerator.core && <IconCheckmark24 />}</TableCell>
            <TableCell dense>{dataItemNames.get(numerator.dataID)}</TableCell>
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
