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
    IconAdd16,
} from '@dhis2/ui'
import React, { useState, useCallback } from 'react'
import {
    CREATE_DENOMINATOR,
    useConfigurations,
    useConfigurationsDispatch,
} from '../../../utils/index.js'
import { DenominatorTableItem } from './DenominatorTableItem.js'
import { EditDenominatorModal } from './EditDenominatorModal.js'

const AddNewDenominatorButton = () => {
    const [addNewModalOpen, setAddNewModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setAddNewModalOpen(true), [])
    const closeModal = useCallback(() => setAddNewModalOpen(false), [])

    const addNewDenominatorRelation = useCallback(
        ({ newDenominatorData }) => {
            dispatch({
                type: CREATE_DENOMINATOR,
                payload: {
                    newDenominatorData,
                },
            })
        },
        [dispatch]
    )

    return (
        <>
            <Button primary icon={<IconAdd16 />} onClick={openModal}>
                Add denominator
            </Button>
            {addNewModalOpen && (
                <EditDenominatorModal
                    onSave={addNewDenominatorRelation}
                    onClose={closeModal}
                />
            )}
        </>
    )
}

export const Denominators = () => {
    const configurations = useConfigurations()

    return (
        <div>
            <p>
                Please map alternative denominators for comparison, for example
                denominiators from the National Bureau of Statistics with
                denominators used by health programmes.
            </p>
            <hr />

            <div className="denominatorsContainer">
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>
                                {' '}
                                Data element/indicator{' '}
                            </TableCellHead>
                            <TableCellHead>Type</TableCellHead>
                            <TableCellHead>Actions</TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {configurations.denominators.map((denominator) => (
                            <DenominatorTableItem
                                denominator={denominator}
                                key={denominator.code}
                            />
                        ))}

                        {/* Add button */}

                        <TableRow>
                            <TableCell colSpan="3">
                                <ButtonStrip end>
                                    <AddNewDenominatorButton />
                                </ButtonStrip>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
