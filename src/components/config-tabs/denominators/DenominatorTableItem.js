import { useAlert } from '@dhis2/app-runtime'
import { Button, TableCell, TableRow, ButtonStrip } from '@dhis2/ui'
import { Chip } from '@dhis2/ui-core'
import PropTypes from 'prop-types'
import React, { useMemo, useCallback, useState } from 'react'
import {
    CLEAR_NUMERATOR_DATA_MAPPING,
    DELETE_DENOMINATOR,
    DELETE_NUMERATOR,
    UPDATE_NUMERATOR,
    useConfigurations,
    useConfigurationsDispatch,
    useDataItemNames,
} from '../../../utils/index.js'
import { ConfirmationModal } from '../ConfirmationModal.js'
import { EditDenominatorModal } from './EditDenominatorModal.js'
import { getDenominatorType } from '../../../utils/denominatorsMetadataData.js'

/** Manages the "update form" modal and datastore mutation */
const EditDenominatorButton = ({ denominator }) => {
    const [editModalOpen, setEditModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setEditModalOpen(true), [])
    const closeModal = useCallback(() => setEditModalOpen(false), [])

    const updateDenominator = useCallback(
        ({
            newDenominatorData,
            dataSetsContainingDenominator,
        }) => {
            dispatch({
                type: UPDATE_NUMERATOR,
                payload: {
                    code: denominator.code,
                    dataSetsContainingDenominator,
                },
            })
        },
        [dispatch, denominator.code]
    )

    // not all fields are needed for form initial values
    const denominatorDataForForm = useMemo(
        () => ({
            name: denominator.name,
            core: denominator.core,
            definition: denominator.definition,
            // if not custom, some fields will be read-only
            custom: denominator.custom,
            // used to print: "This denominator is currently mapped to <dataItem>"
            prevDataID: denominator.dataID,
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
                    text={`Are you sure you want to delete ${denominator.name}?`}
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
    const configurations = useConfigurations()
    const dataItemNames = useDataItemNames()

    const getDataSetName = useCallback(
        (id) =>
            configurations.dataSets.find((dataSet) => dataSet.id === id)?.name,
        [configurations]
    )

    const dataSetNames = React.useMemo(() => {
        const { dataSetID } = denominator
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
    }, [getDataSetName, denominator])

    const denominatorType = React.useMemo(() =>{     
        return getDenominatorType(denominator.type).label
}, [denominator])



    return (
        <TableRow>
            <TableCell dense>{denominator.name}</TableCell>
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
