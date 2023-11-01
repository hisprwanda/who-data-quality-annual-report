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
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { NumeratorRelationTableItem } from './NumeratorRelationTableItem.js'

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
                    <TableRow>
                        <TableCell colSpan="8">
                            <ButtonStrip end>
                                <Button
                                    primary
                                    icon={<IconAdd16 />}
                                    onClick={() => alert('todo')}
                                >
                                    Add Numerator Relation
                                </Button>
                            </ButtonStrip>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

NumeratorRelations.propTypes = {
    configurations: PropTypes.object,
}
