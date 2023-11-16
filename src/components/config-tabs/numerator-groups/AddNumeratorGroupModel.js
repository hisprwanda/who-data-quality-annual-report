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
    ReactFinalForm,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
const { Form, Field } = ReactFinalForm

const DEFAULT_FORM_VALUES = {
    name: undefined,
    displayName: undefined,
    members: [],
}

export function AddNumeratorGroupModel({ onSave, onClose }) {
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
            initialValues={DEFAULT_FORM_VALUES}
            // not subcribing to `values` prevents rerendering the entire form on every input change
            subscription={{ submitting: true }}
        >
            {({ handleSubmit }) => (
                <Modal onClose={onClose} position="middle">
                    <ModalTitle>Create a new numerator group</ModalTitle>
                    <ModalContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>
                                        <Field
                                            name="name"
                                            component={InputFieldFF}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Display Name</TableCell>
                                    <TableCell>
                                        <Field
                                            name="displayName"
                                            component={InputFieldFF}
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
                                onClick={() => {
                                    handleSubmit()
                                }}
                            >
                                Create
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </Form>
    )
}
AddNumeratorGroupModel.propTypes = {
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}
