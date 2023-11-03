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
import PropTypes from 'prop-types'
import React, { useState, useCallback } from 'react'
import {
    useConfigurations,
    useUpdateConfigurations,
} from '../../../utils/configurations/configurationsContext.js'
import { getNextAvailableCode } from '../../../utils/getNextAvailableCode.js'
import { EditNumeratorRelationModal } from './EditNumeratorRelationModal.js'
import { NumeratorRelationTableItem } from './NumeratorRelationTableItem.js'

const AddNumeratorRelationButton = ({ configurations }) => {
    const [addNewModalOpen, setAddNewModalOpen] = useState(false)
    const updateConfigurations = useUpdateConfigurations()

    const openModal = useCallback(() => setAddNewModalOpen(true), [])
    const closeModal = useCallback(() => setAddNewModalOpen(false), [])

    // todo: abstract to reducer
    const addNewNumeratorRelation = useCallback(
        (newNumeratorRelation) => {
            const prevNumeratorRelations = configurations.numeratorRelations
            const nextAvailableCode = getNextAvailableCode(
                prevNumeratorRelations,
                'R'
            )
            newNumeratorRelation.code = nextAvailableCode
            const newConfigurations = {
                ...configurations,
                numeratorRelations: [
                    ...prevNumeratorRelations,
                    newNumeratorRelation,
                ],
            }
            updateConfigurations(newConfigurations)
        },
        [configurations, updateConfigurations]
    )

    return (
        <>
            <Button primary icon={<IconAdd16 />} onClick={openModal}>
                Add Numerator Relation
            </Button>
            {addNewModalOpen && (
                <EditNumeratorRelationModal
                    configurations={configurations}
                    onSave={addNewNumeratorRelation}
                    onClose={closeModal}
                />
            )}
        </>
    )
}
AddNumeratorRelationButton.propTypes = { configurations: PropTypes.object }

export const NumeratorRelations = () => {
    const configurations = useConfigurations()
    const relations = configurations.numeratorRelations

    return (
        <div>
            <p>Numerator Relations</p>
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
                                <AddNumeratorRelationButton
                                    configurations={configurations}
                                />
                            </ButtonStrip>
                        </TableCell>
                    </TableRow>
                </TableFoot>
            </Table>
        </div>
    )
}
