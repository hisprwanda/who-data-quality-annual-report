import i18n from '@dhis2/d2-i18n'
import { Button, TableCell, TableRow, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useMemo, useCallback } from 'react'
import {
    useConfigurationsDispatch,
    DELETE_NUMERATOR_RELATION,
    UPDATE_NUMERATOR_RELATION,
} from '../../../utils/index.js'
import {
    getNumeratorNameByCode,
    getRelationType,
} from '../../../utils/numeratorsMetadataData.js'
import { ConfirmationModal } from '../ConfirmationModal.js'
import { EditNumeratorRelationModal } from './EditNumeratorRelationModal.js'

/** Manages the "update form" modal and datastore mutation */
const EditRelationButton = ({ relation }) => {
    const [editModalOpen, setEditModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setEditModalOpen(true), [])
    const closeModal = useCallback(() => setEditModalOpen(false), [])

    const updateRelation = useCallback(
        (newRelationValues) => {
            dispatch({
                type: UPDATE_NUMERATOR_RELATION,
                payload: {
                    code: relation.code,
                    updatedNumeratorRelation: newRelationValues,
                },
            })
        },
        [dispatch, relation.code]
    )

    return (
        <>
            <Button small onClick={openModal}>
                {i18n.t('Edit')}
            </Button>
            {editModalOpen && (
                <EditNumeratorRelationModal
                    numeratorRelationToEdit={relation}
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
const DeleteRelationButton = ({ relation }) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setConfirmationModalOpen(true), [])
    const closeModal = useCallback(() => setConfirmationModalOpen(false), [])

    const deleteRelation = useCallback(
        () =>
            dispatch({
                type: DELETE_NUMERATOR_RELATION,
                payload: { code: relation.code },
            }),
        [dispatch, relation.code]
    )

    return (
        <>
            <Button small destructive onClick={openModal}>
                {i18n.t('Delete')}
            </Button>
            {confirmationModalOpen && (
                <ConfirmationModal
                    title={i18n.t('Delete numerator relation')}
                    text={i18n.t('Are you sure you want to delete', {
                        name: relation.name,
                    })}
                    action={i18n.t('Delete')}
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

export function NumeratorRelationTableItem({
    configurations,
    numeratorRelation: relation,
}) {
    // some of these values are hard to memoize effectively:
    // they depend on the large configurations object
    const numeratorAName = useMemo(
        () => getNumeratorNameByCode(configurations.numerators, relation.A),
        [configurations.numerators, relation.A]
    )
    const numeratorBName = useMemo(
        () => getNumeratorNameByCode(configurations.numerators, relation.B),
        [configurations.numerators, relation.B]
    )
    const relationType = useMemo(
        () => getRelationType(relation.type),
        [relation.type]
    )

    return (
        <TableRow>
            <TableCell>{relation.name}</TableCell>
            <TableCell>{numeratorAName}</TableCell>
            <TableCell>{numeratorBName}</TableCell>
            <TableCell>{relationType.displayName}</TableCell>
            <TableCell>{relation.criteria}</TableCell>
            <TableCell>{relationType.thresholdDescription}</TableCell>
            <TableCell>{relationType.description}</TableCell>
            <TableCell>
                <ButtonStrip>
                    <EditRelationButton relation={relation} />
                    <DeleteRelationButton relation={relation} />
                </ButtonStrip>
            </TableCell>
        </TableRow>
    )
}
NumeratorRelationTableItem.propTypes = {
    configurations: PropTypes.object,
    numeratorRelation: PropTypes.object,
}
