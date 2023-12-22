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
    SingleSelectFieldFF,
    ReactFinalForm,
    hasValue,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import relationTypes from '../../../data/denominatorTypes.json'
import DenominatorASelect from './DenominatorASelect.js'
import DenominatorBSelect from './DenominatorBSelect.js'

const { Form, Field } = ReactFinalForm

const DEFAULT_FORM_VALUES = {
    name: undefined,
    type: undefined,
    A: undefined,
    B: undefined,
    criteria: 0,
}

export function EditDenominatorRelationModal({
    denominatorRelationToEdit,
    onSave,
    onClose,
}) {
    return (
        <Form
            onSubmit={(values, form) => {
                // todo: validate! 🥳
                console.log('onSubmit', { values, form })
                if (onSave) {
                    onSave(values)
                } else {
                    alert('todo')
                }
                onClose()
            }}
            initialValues={denominatorRelationToEdit || DEFAULT_FORM_VALUES}
            // not subcribing to `values` prevents rerendering the entire form on every input change
            subscription={{ submitting: true }}
        >
            {({ handleSubmit }) => (
                <Modal onClose={onClose} position="middle">
                    <ModalTitle>
                        {(denominatorRelationToEdit ? 'Edit' : 'Create') +
                            ' denominator relation'}
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
                                            options={relationTypes}
                                            placeholder="Select relation type"
                                            validate={hasValue}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Denominator A</TableCell>
                                    <TableCell>
                                        <DenominatorASelect />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Denominator B</TableCell>
                                    <TableCell>
                                        <DenominatorBSelect />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Threshold (+/-) %</TableCell>
                                    <TableCell>
                                        <Field
                                            name="criteria"
                                            component={InputFieldFF}
                                            subscription={{ value: true }}
                                            parse={(value) => Number(value)}
                                            format={(value) => String(value)}
                                            type="number"
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <p>
                            Threshold denotes the % difference from national
                            figure that is accepted for a sub-national unit.
                        </p>
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button secondary onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                primary
                                type="submit"
                                onClick={() => {
                                    handleSubmit()
                                }}
                            >
                                {denominatorRelationToEdit ? 'Save' : 'Create'}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </Form>
    )
}
EditDenominatorRelationModal.propTypes = {
    denominatorRelationToEdit: PropTypes.object,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}
