import { Button, TableCell, TableRow, ButtonStrip } from '@dhis2/ui'
import { Chip } from '@dhis2/ui-core'
import PropTypes from 'prop-types'
import React, { useMemo, useCallback, useState } from 'react'
import {
    CLEAR_NUMERATOR_DATA_MAPPING,
    DELETE_NUMERATOR,
    useConfigurations,
    useConfigurationsDispatch,
    useMetadataNames,
} from '../../../utils/index.js'
import { getNumeratorMemberGroups } from '../../../utils/numeratorsMetadataData.js'
import { ConfirmationModal } from '../ConfirmationModal.js'
import styles from './NumeratorTableItem.module.css'
// import { EditNumeratorModal } from './EditNumeratorModal.js'

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
            <TableCell>
                {groupsContainingNumerator.map((group) => (
                    <Chip key={group.code} dense>
                        {group.displayName}
                    </Chip>
                ))}
            </TableCell>
            <TableCell>{numerator.name}</TableCell>
            <TableCell>{numerator.core ? '✔️' : ''}</TableCell>
            <TableCell>{metadataNames.get(numerator.dataID)}</TableCell>
            <TableCell>{dataSetNames}</TableCell>
            <TableCell>
                <ButtonStrip end>
                    <Button small onClick={() => alert('todo: edit')}>
                        Edit
                    </Button>
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
