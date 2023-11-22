import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
    IconAdd16,
    ButtonStrip,
    TableFoot,
} from '@dhis2/ui'
import React, { useState, useCallback } from 'react'
import {
    useConfigurations,
    useConfigurationsDispatch,
    CREATE_NUMERATOR_RELATION,
} from '../../../utils/index.js'
import { EditNumeratorRelationModal } from './EditNumeratorRelationModal.js'
import { NumeratorRelationTableItem } from './NumeratorRelationTableItem.js'

const AddNumeratorRelationButton = () => {
    const [addNewModalOpen, setAddNewModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setAddNewModalOpen(true), [])
    const closeModal = useCallback(() => setAddNewModalOpen(false), [])

    const addNewNumeratorRelation = useCallback(
        (newNumeratorRelation) =>
            dispatch({
                type: CREATE_NUMERATOR_RELATION,
                payload: { newNumeratorRelation },
            }),
        [dispatch]
    )

    return (
        <>
            <Button primary icon={<IconAdd16 />} onClick={openModal}>
                Add Numerator Relation
            </Button>
            {addNewModalOpen && (
                <EditNumeratorRelationModal
                    onSave={addNewNumeratorRelation}
                    onClose={closeModal}
                />
            )}
        </>
    )
}

export const NumeratorRelations = () => {
    const configurations = useConfigurations()
    const relations = configurations.numeratorRelations

    return (
        <div>
            <hr />
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Name</TableCellHead>
                        <TableCellHead>Numerator A</TableCellHead>
                        <TableCellHead>Numerator B</TableCellHead>
                        <TableCellHead>Type</TableCellHead>
                        <TableCellHead>Threshold (%)</TableCellHead>
                        <TableCellHead>Threshold explanation</TableCellHead>
                        <TableCellHead>Description</TableCellHead>
                        <TableCellHead>Actions</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {relations ? (
                        relations.map((relation) => (
                            <NumeratorRelationTableItem
                                numeratorRelation={relation}
                                configurations={configurations}
                                key={relation.code}
                            />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell>No numerator relations found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFoot>
                    <TableRow>
                        <TableCell colSpan="8">
                            <ButtonStrip end>
                                <AddNumeratorRelationButton />
                            </ButtonStrip>
                        </TableCell>
                    </TableRow>
                </TableFoot>
            </Table>
        </div>
    )
}
