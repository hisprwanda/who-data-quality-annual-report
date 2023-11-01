import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
    IconDelete16,
    IconEdit16,
    IconAdd16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    getNumeratorNameByCode,
    getRelationType,
} from '../../../utils/numeratorsMetadataData.js'
import { EditNumeratorRelationModal } from './EditNumeratorRelationModal.js'

export const NumeratorRelations = ({ configurations }) => {
    const [isModalHidden, setIsModalHidden] = useState(true)

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
                        relations.map((relation, key) => (
                            <TableRow key={key}>
                                <TableCell>{relation.name}</TableCell>
                                <TableCell>
                                    {getNumeratorNameByCode(
                                        configurations.numerators,
                                        relation.A
                                    )}
                                </TableCell>
                                <TableCell>
                                    {getNumeratorNameByCode(
                                        configurations.numerators,
                                        relation.B
                                    )}
                                </TableCell>
                                <TableCell>
                                    {getRelationType(relation.type).displayName}
                                </TableCell>
                                <TableCell>{relation.criteria}</TableCell>
                                <TableCell>
                                    {
                                        getRelationType(relation.type)
                                            .thresholdDescription
                                    }
                                </TableCell>
                                <TableCell>
                                    {getRelationType(relation.type).description}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        name="Primary button"
                                        onClick={() => setIsModalHidden(false)}
                                        basic
                                        button
                                        value="default"
                                        icon={<IconEdit16 />}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        name="Primary button"
                                        onClick={() => console.log('It works!')}
                                        destructive
                                        button
                                        value="default"
                                        icon={<IconDelete16 />}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell>No numerator relations found.</TableCell>
                        </TableRow>
                    )}
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                            <Button
                                name="Primary button"
                                onClick={() => setIsModalHidden(false)}
                                primary
                                button
                                value="default"
                                icon={<IconAdd16 />}
                            >
                                Add Numerator Relation
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <EditNumeratorRelationModal
                onClose={() => setIsModalHidden(true)}
                hide={isModalHidden}
                configurations={configurations}
            />
        </div>
    )
}

NumeratorRelations.propTypes = {
    configurations: PropTypes.object,
}
