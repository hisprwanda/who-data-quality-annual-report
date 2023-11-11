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
import { Chip } from '@dhis2/ui-core'
// import PropTypes from 'prop-types'
import React /* useState, useEffect */ from 'react'
import { useConfigurations } from '../../../utils/index.js'
import {
    getNumeratorDataElement,
    getNumeratorDataset,
    getNumeratorMemberGroups,
} from '../../../utils/numeratorsMetadataData.js'

export const Numerators = () => {
    const configurations = useConfigurations()
    const { numerators } = configurations

    // FIXME: this is running every time a tab is switched find why and fix
    const isDisabled = (dataID, dataSetID) => {
        const element = configurations.denominators.find(
            (element) => element.dataID == dataID
        )
        const dataset = configurations.dataSets.find(
            (dataset) => dataset.id == dataSetID
        )

        if (element || dataset) {
            // console.log('elemnt and dataset ', element + ' ' +dataset);
            return false
        } else {
            return true
        }
    }

    return (
        <>
            <p>
                Please map the reference numerators to the corresponding data
                element/indicator in this database.
            </p>
            <hr />

            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Group</TableCellHead>
                        <TableCellHead>Reference numerator</TableCellHead>
                        <TableCellHead>Core</TableCellHead>
                        <TableCellHead>Data element/indicator</TableCellHead>
                        <TableCellHead>Dataset</TableCellHead>
                        <TableCellHead>Actions</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {numerators &&
                        numerators.map((numerator, key) => (
                            <TableRow key={key}>
                                <TableCell>
                                    {getNumeratorMemberGroups(
                                        configurations,
                                        numerator.code
                                    ).map((group, key) => (
                                        <Chip key={key} dense>
                                            {group.displayName}
                                        </Chip>
                                    ))}
                                </TableCell>
                                <TableCell>{numerator.name}</TableCell>
                                <TableCell>
                                    {numerator.core ? '✔️' : ''}
                                </TableCell>
                                <TableCell>
                                    {getNumeratorDataElement(
                                        numerators,
                                        numerator.dataID
                                    )}
                                </TableCell>
                                <TableCell>
                                    {getNumeratorDataset(
                                        configurations,
                                        numerator.dataSetID
                                    )}
                                </TableCell>
                                <TableCell>
                                    <ButtonStrip end>
                                        <Button
                                            small
                                            onClick={() => alert('todo: edit')}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            small
                                            onClick={() =>
                                                alert('todo: clear or delete')
                                            }
                                            disabled={isDisabled(
                                                numerator.dataID,
                                                numerator.dataSetID
                                            )}
                                        >
                                            Clear
                                        </Button>
                                    </ButtonStrip>
                                </TableCell>
                            </TableRow>
                        ))}
                    <TableRow>
                        <TableCell colSpan="99">
                            <ButtonStrip end>
                                <Button
                                    onClick={() => console.log('todo')}
                                    icon={<IconAdd16 />}
                                    primary
                                >
                                    Add new numerator
                                </Button>
                            </ButtonStrip>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}

Numerators.propTypes = {}
