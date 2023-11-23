import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    ButtonStrip,
    InputFieldFF,
    TextAreaFieldFF,
    MultiSelectFieldFF,
    CheckboxFieldFF,
    ReactFinalForm,
    hasValue,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useConfigurations, useDataItemNames } from '../../../utils/index.js'
import { TOTALS } from './constants.js'
import { DataMappingFormSection } from './DataMappingForm.js'

const { Form, Field, useField } = ReactFinalForm

const DEFAULT_FORM_VALUES = {
    dataElementType: TOTALS,
}


export function EditDenominatorModal({ denominatorDataToEdit, onSave, onClose }) {
    const configurations = useConfigurations()

    const denominatorGroupOptions = useMemo(
        () =>
            configurations.groups
                .map(({ displayName, code }) => ({
                    label: displayName,
                    value: code,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [configurations.groups]
    )

    const formInitialValues = useMemo(() => {
        if (!denominatorDataToEdit) {
            return DEFAULT_FORM_VALUES
        }

        // properties listed out here for clarity
        return {
            name: denominatorDataToEdit.name,
            definition: denominatorDataToEdit.definition,
            groups: denominatorDataToEdit.groups,
            core: denominatorDataToEdit.core,
            // not an editable field, but will be added to the form state
            // for convenience (some fields will be read-only)
            custom: denominatorDataToEdit.custom,
            // same (for other form logic like if fields are required)
            prevDataID: denominatorDataToEdit.prevDataID,
            ...DEFAULT_FORM_VALUES,
        }
    }, [denominatorDataToEdit])

    return (
        <Form
            onSubmit={(values) => {
                // todo: validate! 🥳
                // todo: data items required on creation, but not edit

                // Pick data from values
                // (some values like dataElementType are just for the form)
                let newDenominatorData = {
                    name: values.name,
                    definition: values.definition,
                    core: values.core,
                }
                if (values.dataItem?.id) {
                    // add these separately so we don't set 'undefined' for a
                    // denominator we're editing with a dataID already.
                    // if dataID is set, the other two should be required
                    newDenominatorData = {
                        ...newDenominatorData,
                        // note different form state structure:
                        dataID: values.dataItem.id,
                        dataSetID: values.dataSets.map(({ id }) => id),
                        dataElementOperandID: values.dataElementOperandID,
                    }
                }

                onSave({
                    newDenominatorData,
                    dataSetsContainingDenominator: values.dataSets,
                })
                onClose()
            }}
            initialValues={formInitialValues}
            // not subcribing to `values` prevents rerendering the entire form on every input change
            subscription={{ submitting: true }}
        >
            {({ handleSubmit }) => (
                <Modal onClose={onClose} position="middle">
                    <ModalTitle>
                        {(denominatorDataToEdit ? 'Edit' : 'Create') +
                            ' denominator'}
                    </ModalTitle>
                    <ModalContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>
                                        <Field
                                            name="type"
                                            component={InputFieldFF}
                                            placeholder="Denominator type"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Denominator</TableCell>
                                    <TableCell>
                                    <DataMappingFormSection />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Lowest available level	</TableCell>
                                    <TableCell>
                                        <Field
                                            name="level"
                                            component={InputFieldFF}
                                            placeholder="Select level"
                                            validate={hasValue}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button secondary onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                primary
                                type="submit"
                                onClick={handleSubmit}
                            >
                                {denominatorDataToEdit ? 'Save' : 'Create'}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </Form>
    )
}
EditDenominatorModal.propTypes = {
    denominatorDataToEdit: PropTypes.object,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}
