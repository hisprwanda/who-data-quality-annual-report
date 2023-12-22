import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
    TableFoot,
    IconAdd16,
    ButtonStrip,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useCallback } from 'react'
import {
    CREATE_DENOMINATOR_RELATION,
    useConfigurations,
    useConfigurationsDispatch,
} from '../../../utils/index.js'
import { DenominatorRelationTableItem } from './DenominatorRelationTableItem.js'
import { EditDenominatorRelationModal } from './EditDenominatorRelationModal.js'

const AddDenominatorRelationButton = () => {
    const [addNewModalOpen, setAddNewModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setAddNewModalOpen(true), [])
    const closeModal = useCallback(() => setAddNewModalOpen(false), [])

    const addNewDenominatorRelation = useCallback(
        (newDenominatorRelationInfo) =>
            dispatch({
                type: CREATE_DENOMINATOR_RELATION,
                payload: { newDenominatorRelationInfo },
            }),
        [dispatch]
    )

    return (
        <>
            <Button primary icon={<IconAdd16 />} onClick={openModal}>
                Add Denominator Relation
            </Button>
            {addNewModalOpen && (
                <EditDenominatorRelationModal
                    onSave={addNewDenominatorRelation}
                    onClose={closeModal}
                />
            )}
        </>
    )
}

export const DenominatorRelations = ({ toggleState }) => {
    const configurations = useConfigurations()
    const relations = configurations.denominatorRelations

    return (
        <div
            className={
                toggleState === 6 ? 'content  active-content' : 'content'
            }
        >
            <p>
                Please map alternative denominators for comparison, for example
                denominiators from the National Bureau of Statistics with
                denominators used by health programmes.
            </p>
            <hr />
            <div className="denominatorRelationsContainer">
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>Name </TableCellHead>
                            <TableCellHead> Denominator A </TableCellHead>
                            <TableCellHead> Denominator B </TableCellHead>
                            <TableCellHead>Criteria</TableCellHead>
                            <TableCellHead>Actions</TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {relations ? (
                            relations.map((relation) => (
                                <DenominatorRelationTableItem
                                    denominatorRelation={relation}
                                    configurations={configurations}
                                    key={relation.code}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell>
                                    No denominator relations found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                    <TableFoot>
                        <TableRow>
                            <TableCell colSpan="8">
                                <ButtonStrip end>
                                    <AddDenominatorRelationButton />
                                </ButtonStrip>
                            </TableCell>
                        </TableRow>
                    </TableFoot>
                </Table>
            </div>
        </div>
    )
}

DenominatorRelations.propTypes = {
    toggleState: PropTypes.number,
}
