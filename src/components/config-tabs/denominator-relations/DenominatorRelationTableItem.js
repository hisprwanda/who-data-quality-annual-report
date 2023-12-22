import { Button, TableCell, TableRow, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useMemo, useCallback } from 'react'
import { getDenominatorNameByCode } from '../../../utils/denominatorsMetadataData.js'
import {
    useConfigurationsDispatch,
    DELETE_DENOMINATOR_RELATION,
    UPDATE_DENOMINATOR_RELATION,
} from '../../../utils/index.js'
import { ConfirmationModal } from '../ConfirmationModal.js'
import { EditDenominatorRelationModal } from './EditDenominatorRelationModal.js'

/** Manages the "update form" modal and datastore mutation */
const EditRelationButton = ({ relation }) => {
    const [editModalOpen, setEditModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setEditModalOpen(true), [])
    const closeModal = useCallback(() => setEditModalOpen(false), [])

    const updateRelation = useCallback(
        (newRelationValues) => {
            dispatch({
                type: UPDATE_DENOMINATOR_RELATION,
                payload: {
                    code: relation.code,
                    updatedDenominatorRelation: newRelationValues,
                },
            })
        },
        [dispatch, relation.code]
    )

    return (
        <>
            <Button small onClick={openModal}>
                Edit
            </Button>
            {editModalOpen && (
                <EditDenominatorRelationModal
                    denominatorRelationToEdit={relation}
                    onSave={updateRelation}
                    onClose={closeModal}
                />
            )}
        </>
    )
}
EditRelationButton.propTypes = {
    relation: PropTypes.object,
}

/** Manages the "delete confirmation" modal and datastore mutation */
// TODO: verify that the relation to be deleted is not being used by other objects
const DeleteRelationButton = ({ relation }) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setConfirmationModalOpen(true), [])
    const closeModal = useCallback(() => setConfirmationModalOpen(false), [])

    const deleteRelation = useCallback(
        () =>
            dispatch({
                type: DELETE_DENOMINATOR_RELATION,
                payload: { code: relation.code },
            }),
        [dispatch, relation.code]
    )

    return (
        <>
            <Button small destructive onClick={openModal}>
                Delete
            </Button>
            {confirmationModalOpen && (
                <ConfirmationModal
                    title="Delete denominator relation"
                    text={`Are you sure you want to delete ${relation.name}?`}
                    action="Delete"
                    destructive
                    onClose={closeModal}
                    onConfirm={deleteRelation}
                />
            )}
        </>
    )
}
DeleteRelationButton.propTypes = {
    relation: PropTypes.object,
}

export function DenominatorRelationTableItem({
    configurations,
    denominatorRelation: relation,
}) {
    const denominatorAName = useMemo(
        () => getDenominatorNameByCode(configurations.denominators, relation.A),
        [configurations.denominators, relation.A]
    )
    const denominatorBName = useMemo(
        () => getDenominatorNameByCode(configurations.denominators, relation.B),
        [configurations.denominators, relation.B]
    )

    return (
        <TableRow>
            <TableCell>{relation.name}</TableCell>
            <TableCell>{denominatorAName}</TableCell>
            <TableCell>{denominatorBName}</TableCell>
            <TableCell>{relation.criteria}</TableCell>
            <TableCell>
                <ButtonStrip>
                    <EditRelationButton relation={relation} />
                    <DeleteRelationButton relation={relation} />
                </ButtonStrip>
            </TableCell>
        </TableRow>
    )
}
DenominatorRelationTableItem.propTypes = {
    configurations: PropTypes.object,
    denominatorRelation: PropTypes.object,
}
