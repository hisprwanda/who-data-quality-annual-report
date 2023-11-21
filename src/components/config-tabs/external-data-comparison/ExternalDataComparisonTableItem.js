import { Button, TableCell, TableRow, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useMemo, useCallback } from 'react'
import { getDenominatorRelations } from '../../../utils/denominatorsMetadataData.js'
import {
    DELETE_EXTERNAL_RELATION,
    UPDATE_EXTERNAL_RELATION,
    useConfigurationsDispatch,
} from '../../../utils/index.js'
import { getNumeratorDataElement } from '../../../utils/numeratorsMetadataData.js'
import { EditExternalDataComparisonModel } from './EditExternalDataComparisonModel.js'
import { ConfirmationModal } from '../ConfirmationModal.js'

/** Manages the "update form" modal and datastore mutation */
const EditExternalRelationButton = ({ externalRelation }) => {
    const [editModalOpen, setEditModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setEditModalOpen(true), [])
    const closeModal = useCallback(() => setEditModalOpen(false), [])

    const updateExternalRelation = useCallback(
        (newRelationValues) => {
            dispatch({
                type: UPDATE_EXTERNAL_RELATION,
                payload: {
                    code: externalRelation.code,
                    updatedExternalRelation: newRelationValues,
                },
            })
        },
        [dispatch, externalRelation.code]
    )

    return (
        <>
            <Button small onClick={openModal}>
                Edit
            </Button>
            {editModalOpen && (
                <EditExternalDataComparisonModel
                    externalRelationToEdit={externalRelation}
                    onSave={updateExternalRelation}
                    onClose={closeModal}
                />
            )}
        </>
    )
}
EditExternalRelationButton.propTypes = {
    externalRelation: PropTypes.object,
}

/** Manages the "delete confirmation" modal and datastore mutation */
const DeleteExternalRelationButton = ({ externalRelation }) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setConfirmationModalOpen(true), [])
    const closeModal = useCallback(() => setConfirmationModalOpen(false), [])

    const deleteRelation = useCallback(
        () =>
            dispatch({
                type: DELETE_EXTERNAL_RELATION,
                payload: { code: externalRelation.code },
            }),
        [dispatch, externalRelation.code]
    )

    return (
        <>
            <Button small destructive onClick={openModal}>
                Delete
            </Button>
            {confirmationModalOpen && (
                <ConfirmationModal
                    title="Delete External Relation"
                    text={`Are you sure you want to delete ${externalRelation.name}?`}
                    action="Delete"
                    destructive
                    onClose={closeModal}
                    onConfirm={deleteRelation}
                />
            )}
        </>
    )
}
DeleteExternalRelationButton.propTypes = {
    externalRelation: PropTypes.object,
}

export function ExternalDataComparisonTableItem({
    configurations,
    externalRelation: externalRelation,
}) {
    // some of these values are hard to memoize effectively:
    // they depend on the large configurations object
    const externalIndicator = useMemo(
        () =>
            getNumeratorDataElement(
                configurations,
                externalRelation.externalData
            ),
        [configurations, externalRelation.externalData]
    )
    const routineDataNumerator = useMemo(
        () =>
            getDenominatorRelations(
                configurations.numerators,
                externalRelation.numerator
            ),
        [configurations.numerators, externalRelation.numerator]
    )
    const routineDataDenominator = useMemo(
        () =>
            getDenominatorRelations(
                configurations.denominators,
                externalRelation.denominator
            ),
        [configurations.denominators, externalRelation.denominator]
    )

    return (
        <TableRow>
            <TableCell>{externalRelation.name}</TableCell>
            <TableCell>{externalIndicator}</TableCell>
            <TableCell>{routineDataNumerator}</TableCell>
            <TableCell>{routineDataDenominator}</TableCell>
            <TableCell>{externalRelation.criteria}%</TableCell>
            <TableCell>District</TableCell>
            <TableCell>
                <ButtonStrip>
                    <EditExternalRelationButton
                        externalRelation={externalRelation}
                    />
                    <DeleteExternalRelationButton
                        externalRelation={externalRelation}
                    />
                </ButtonStrip>
            </TableCell>
        </TableRow>
    )
}
ExternalDataComparisonTableItem.propTypes = {
    configurations: PropTypes.object,
    externalRelation: PropTypes.object,
}
