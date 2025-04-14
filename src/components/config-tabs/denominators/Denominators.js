import i18n from '@dhis2/d2-i18n'
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
                {i18n.t('Add denominator')}
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
                {i18n.t(
                    'Please map alternative denominators for comparison, for example denominiators from the National Bureau of Statistics with denominators used by health programmes.'
                )}
            </p>
            <hr />

            <div>
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>{i18n.t('Name')}</TableCellHead>
                            <TableCellHead>{i18n.t('Type')}</TableCellHead>
                            <TableCellHead>{i18n.t('Actions')}</TableCellHead>
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
