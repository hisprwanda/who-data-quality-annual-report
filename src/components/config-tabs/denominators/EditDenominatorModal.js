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
    ReactFinalForm,
    hasValue,
    InputFieldFF,
    SingleSelectFieldFF,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import denominatorTypes from '../../../data/denominatorTypes.json'
import { DataMappingFormSection } from './DataMappingForm.js'
import { OrgUnitLevelSelect } from './OrgUnitLevelSelect.js'

const { Form, Field } = ReactFinalForm

const DEFAULT_FORM_VALUES = {
    dataElementType: 'totals',
}

export function EditDenominatorModal({
    denominatorDataToEdit,
    onSave,
    onClose,
}) {
    return (
        <Form
            onSubmit={(values) => {
                // Pick data from values
                // (some values like dataElementType are just for the form)
                let newDenominatorData = {
                    name: values.name,
                    lowLevel: values.level,
                    type: values.type,
                }
                if (values.dataItem?.id) {
                    // add this separately so we don't set 'undefined' for a
                    // denominator we're editing with a dataID already.
                    newDenominatorData = {
                        ...newDenominatorData,
                        // note different form state structure:
                        dataID: values.dataItem.id,
                    }
                }

                onSave({
                    newDenominatorData,
                })
                onClose()
            }}
            initialValues={denominatorDataToEdit || DEFAULT_FORM_VALUES}
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
                                    <TableCell>Name</TableCell>
                                    <TableCell>
                                        <Field
                                            name="name"
                                            component={InputFieldFF}
                                            autoComplete="off"
                                            placeholder="Denominator name"
                                            validate={hasValue}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>
                                        <Field
                                            name="type"
                                            component={SingleSelectFieldFF}
                                            options={denominatorTypes}
                                            placeholder="Select denominator type"
                                            validate={hasValue}
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
                                    <TableCell>
                                        Lowest available level{' '}
                                    </TableCell>
                                    <TableCell>
                                        <OrgUnitLevelSelect />
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
