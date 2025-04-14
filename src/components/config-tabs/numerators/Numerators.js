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
import i18n from '@dhis2/d2-i18n'
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
        ({
            newNumeratorData,
            groupsContainingNumerator,
            dataSetsContainingNumerator,
        }) => {
            dispatch({
                type: CREATE_NUMERATOR,
                payload: {
                    newNumeratorData,
                    groupsContainingNumerator,
                    dataSetsContainingNumerator,
                },
            })
        },
        [dispatch]
    )

    return (
        <>
            <Button primary icon={<IconAdd16 />} onClick={openModal}>
                {i18n.t("Add numerator")}
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
                {i18n.t("Please map the reference numerators to the corresponding data element/indicator in this database.")}
            </p>
            <hr />

            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>{i18n.t("Group")}</TableCellHead>
                        <TableCellHead>{i18n.t("Reference numerator")}</TableCellHead>
                        <TableCellHead>{i18n.t("Core")}</TableCellHead>
                        <TableCellHead>{i18n.t("Data element/indicator")}</TableCellHead>
                        <TableCellHead>{i18n.t("Dataset")}</TableCellHead>
                        <TableCellHead>{i18n.t("Actions")}</TableCellHead>
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
