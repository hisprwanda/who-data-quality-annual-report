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
import React, { useState } from 'react'
import { EditNumeratorRelationModal } from './EditNumeratorRelationModal.js'
import { NumeratorRelationTableItem } from './NumeratorRelationTableItem.js'

const NumeratorRelationTableFoot = ({ configurations }) => {
    const [addNewModalOpen, setAddNewModalOpen] = useState(false)

    return (
        <TableFoot>
            <TableRow>
                <TableCell colSpan="8">
                    <ButtonStrip end>
                        <Button
                            primary
                            icon={<IconAdd16 />}
                            onClick={() => setAddNewModalOpen(true)}
                        >
                            Add Numerator Relation
                        </Button>
                    </ButtonStrip>
                </TableCell>
            </TableRow>
            {addNewModalOpen && (
                <EditNumeratorRelationModal
                    configurations={configurations}
                    onClose={() => setAddNewModalOpen(false)}
                />
            )}
        </TableFoot>
    )
}
NumeratorRelationTableFoot.propTypes = { configurations: PropTypes.object }

export const NumeratorRelations = ({ configurations }) => {
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
                <NumeratorRelationTableFoot configurations={configurations} />
            </Table>
        </div>
    )
}

NumeratorRelations.propTypes = {
    configurations: PropTypes.object,
}
