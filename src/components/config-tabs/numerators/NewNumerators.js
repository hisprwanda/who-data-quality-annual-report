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
import React, { useCallback, useState } from 'react'
import {
    CREATE_NUMERATOR,
    DELETE_NUMERATOR,
    useConfigurations,
    useConfigurationsDispatch,
} from '../../../utils/index.js'
import {
    getNumeratorDataElement,
    getNumeratorDataset,
    getNumeratorMemberGroups,
} from '../../../utils/numeratorsMetadataData.js'
import { EditNumeratorModal } from './EditNumeratorModal.js'

const AddNewNumeratorButton = () => {
    const [addNewModalOpen, setAddNewModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setAddNewModalOpen(true), [])
    const closeModal = useCallback(() => setAddNewModalOpen(false), [])

    const addNewNumeratorRelation = useCallback(
        ({ newNumeratorData, groupsContainingNumerator }) => {
            dispatch({
                type: CREATE_NUMERATOR,
                payload: {
                    newNumeratorData,
                    groupsContainingNumerator,
                },
            })
        },
        [dispatch]
    )

    return (
        <>
            <Button primary icon={<IconAdd16 />} onClick={openModal}>
                Add numerator
            </Button>
            {addNewModalOpen && (
                <EditNumeratorModal
                    onSave={addNewNumeratorRelation}
                    onClose={closeModal}
                />
            )}
        </>
    )
}

export const Numerators = () => {
    const configurations = useConfigurations()
    const { numerators } = configurations

    // todo: move to delete button when that's abstracted
    const dispatch = useConfigurationsDispatch()

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
                                        {numerator.custom ? (
                                            <Button
                                                small
                                                destructive
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            'Delete ' +
                                                                numerator.name +
                                                                '?'
                                                        )
                                                    ) {
                                                        dispatch({
                                                            type: DELETE_NUMERATOR,
                                                            payload: {
                                                                code: numerator.code,
                                                            },
                                                        })
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        ) : (
                                            <Button
                                                small
                                                onClick={() =>
                                                    alert('todo: clear')
                                                }
                                                disabled={isDisabled(
                                                    numerator.dataID,
                                                    numerator.dataSetID
                                                )}
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </ButtonStrip>
                                </TableCell>
                            </TableRow>
                        ))}
                    <TableRow>
                        <TableCell colSpan="99">
                            <ButtonStrip end>
                                <AddNewNumeratorButton />
                            </ButtonStrip>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}

Numerators.propTypes = {}
