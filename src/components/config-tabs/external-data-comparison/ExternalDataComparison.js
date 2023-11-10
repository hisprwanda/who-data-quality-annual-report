import {
    Button,
    ButtonStrip,
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
import React, { useState, useEffect } from 'react'
import { getDenominatorRelations } from '../../../utils/denominatorsMetadataData.js'
import { getNumeratorDataElement } from '../../../utils/numeratorsMetadataData.js'
import {UpdateExternalDataComparisonModel} from './UpdateExternalDataComparisonModel.js'

export const ExternalDataComparison = ({ toggleState, configurations }) => {
    const [relations, setRelations] = useState(null)
    const [updateModalOpen, setUpdateModalOpen] = useState(false)

    useEffect(() => {
        setRelations(configurations.externalRelations)
    }, [configurations])

    return (
        <div
            className={
                toggleState === 7 ? 'content  active-content' : 'content'
            }
        >
            <p>
                {`Please identify external (survey) data that can be used for
                comparison with routine data, e.g. ANC coverage, immunisation
                coverage etc. The "external data" should refer to calculated
                survey result (e.g. a percentage), whilst the numerator and
                denominator refer to the raw data`}
            </p>
            <hr />

            <div className="ExternalDataContainer">
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>Name</TableCellHead>
                            <TableCellHead>
                                Survey/external indicator
                            </TableCellHead>
                            <TableCellHead>
                                Routine data numerator
                            </TableCellHead>
                            <TableCellHead>
                                Routine data denominator
                            </TableCellHead>
                            <TableCellHead>Criteria</TableCellHead>
                            {/* TODO: have dhis2 metadata objects you will neen into a context api objt */}
                            <TableCellHead>Level</TableCellHead>
                            <TableCellHead>Actions</TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {relations ? (
                            relations.map((relation, key) => (
                                <TableRow key={key}>
                                    <TableCell>{relation.name}</TableCell>
                                    <TableCell>
                                        {getNumeratorDataElement(
                                            configurations,
                                            relation.externalData
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {getDenominatorRelations(
                                            configurations.numerators,
                                            relation.numerator
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {getDenominatorRelations(
                                            configurations.denominators,
                                            relation.denominator
                                        )}
                                    </TableCell>
                                    <TableCell>{relation.criteria}%</TableCell>
                                    <TableCell>District</TableCell>
                                    <TableCell>
                                        <ButtonStrip>
                                            <Button
                                                small
                                                name="Primary button"
                                                onClick={() =>
                                                    setUpdateModalOpen(true)
                                                }
                                                basic
                                                button
                                                value="default"
                                                icon={<IconEdit16 />}
                                            >
                                                {' '}
                                                Edit
                                            </Button>
                                            <Button
                                                small
                                                name="Primary button"
                                                onClick={() =>
                                                    console.log('deleting...')
                                                }
                                                destructive
                                                button
                                                value="default"
                                                icon={<IconDelete16 />}
                                            >
                                                {' '}
                                                Delete
                                            </Button>
                                        </ButtonStrip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell></TableCell>
                            </TableRow>
                        )}
                        {/* Add button */}

                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                                <Button
                                    name="Primary button"
                                    onClick={() => setUpdateModalOpen(true)}
                                    primary
                                    button
                                    value="default"
                                    icon={<IconAdd16 />}
                                >
                                    {' '}
                                    Add Comparison
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            {updateModalOpen && (
                <UpdateExternalDataComparisonModel
                    externalDataToUpdate={[]}
                    onSave={() => console.log('saving...')}
                    onClose={() => setUpdateModalOpen(false)}
                />
            )}
        </div>
    )
}

ExternalDataComparison.propTypes = {
    configurations: PropTypes.object,
    toggleState: PropTypes.string,
}
