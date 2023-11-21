import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    Table,
    TableBody,
    TableRow,
    TableCell,
    InputFieldFF,
    ReactFinalForm,
    ButtonStrip,
    hasValue,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { DataMappingFormSection } from './DataMappingForm.js'
const { Form, Field } = ReactFinalForm

const DEFAULT_FORM_VALUES = {
    name: '',
    criteria: '10',
    dataType: 'dataElements',
    externalData: '',
    numerator: '',
    denominator: '',
    level: '',
}

export const EditExternalDataComparisonModel = ({
    externalRelationToEdit,
    onSave,
    onClose,
}) => {
    return (
        <Form
            onSubmit={(values, form) => {
                console.log('submitting2...', { values, form })
                if (onSave) {
                    onSave({
                        name: values.name,
                        criteria: values.criteria,
                        numerator: values.numerator,
                        denominator: values.denominator,
                        level: values.level,
                        externalData: values.dataItem.id,
                        dataType:
                            values.dataType === 'dataElement'
                                ? 'dataElements'
                                : 'indicators',
                    })
                } else {
                    alert('todo')
                }
                onClose()
            }}
            initialValues={externalRelationToEdit || DEFAULT_FORM_VALUES}
            subscription={{ submitting: true }}
        >
            {({ handleSubmit }) => (
                <Modal onClose={onClose} position="middle">
                    <ModalTitle>
                        {(externalRelationToEdit ? 'Edit' : 'Add') +
                            ' external data relation'}
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
                                            placeholder="Relation name"
                                            autoComplete="off"
                                            validate={hasValue}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <DataMappingFormSection />

                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <p>Threshold (+/- %)</p>
                                    </TableCell>
                                    <TableCell>
                                        <Field
                                            name="criteria"
                                            component={InputFieldFF}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <p>
                            <strong>Threshold</strong> denotes the % difference
                            between external and routine data that is accepted.
                        </p>
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button secondary onClick={onClose}>
                                {' '}
                                Cancel{' '}
                            </Button>
                            <Button
                                primary
                                type="submit"
                                onClick={() => {
                                    handleSubmit()
                                }}
                            >
                                {externalRelationToEdit ? 'Save' : 'Create'}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </Form>
    )
}

EditExternalDataComparisonModel.propTypes = {
    externalRelationToEdit: PropTypes.object,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}
