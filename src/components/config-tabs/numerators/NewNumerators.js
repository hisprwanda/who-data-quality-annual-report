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
import React, { useCallback, useState } from 'react'
import {
    CREATE_NUMERATOR,
    useConfigurations,
    useConfigurationsDispatch,
} from '../../../utils/index.js'
import { EditNumeratorModal } from './EditNumeratorModal.js'
import { NumeratorTableItem } from './NumeratorTableItem.js'

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
                    {configurations.numerators.map((numerator) => (
                        <NumeratorTableItem
                            numerator={numerator}
                            key={numerator.code}
                        />
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
