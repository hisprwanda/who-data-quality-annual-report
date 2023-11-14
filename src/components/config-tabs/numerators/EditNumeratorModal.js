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
    // SingleSelectFieldFF,
    TextAreaFieldFF,
    MultiSelectFieldFF,
    CheckboxFieldFF,
    ReactFinalForm,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useConfigurations } from '../../../utils/index.js'
import { DataMappingFormSection } from './DataMappingForm.js'

const { Form, Field } = ReactFinalForm

const DEFAULT_NUMERATOR_VALUES = {
    // edited in this form:
    name: undefined,
    definition: undefined,
    core: false,
    dataID: undefined,
    dataElementOperandID: undefined,
    dataSetID: [],
}

/**
 * If `numeratorToEdit`, is provided, this will behave in "update" mode:
 * - the fields will be prefilled with the values of that relation
 * - some text in the modal will refer to editing/updating
 * - the data store mutation will be an "update" action on that numerator
 * Otherwise, this will behave in "add new" mode:
 * - the fields will be empty
 * - text in the modal will refer to creating/adding new
 * - the data store mutation will create a new numerator object
 */
export function EditNumeratorModal({ numeratorToEdit, onSave, onClose }) {
    const configurations = useConfigurations()

    const numeratorGroupOptions = React.useMemo(
        () =>
            configurations.groups
                .map(({ displayName, code }) => ({
                    label: displayName,
                    value: code,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [configurations.groups]
    )

    return (
        <Form
            onSubmit={(values, form) => {
                // Pick data from values -- some values are just for the form
                const newNumeratorData = {
                    name: values.name,
                    definition: values.definition,
                    core: values.core,
                    dataID: values.dataItem.id, // note different structure here
                    dataSetId: values.dataSetID,
                    dataElementOperandID: values.dataElementOperandID,
                }

                // todo: validate! 🥳
                console.log('onSubmit', { values, form })
                if (onSave) {
                    onSave({
                        newNumeratorData,
                        groupsContainingNumerator: values.groups,
                    })
                } else {
                    alert('todo')
                }
                onClose()
            }}
            initialValues={numeratorToEdit || DEFAULT_NUMERATOR_VALUES}
            // not subcribing to `values` prevents rerendering the entire form on every input change
            subscription={{ submitting: true }}
        >
            {({ handleSubmit }) => (
                <Modal onClose={onClose} position="middle">
                    <ModalTitle>
                        {(numeratorToEdit ? 'Edit' : 'Create') + ' numerator'}
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
                                            placeholder="Numerator name"
                                            autoComplete="off"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Definition</TableCell>
                                    <TableCell>
                                        <Field
                                            name="definition"
                                            component={TextAreaFieldFF}
                                            placeholder="Numerator definition"
                                            rows="2"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Groups</TableCell>
                                    <TableCell>
                                        <Field
                                            name="groups"
                                            component={MultiSelectFieldFF}
                                            options={numeratorGroupOptions}
                                            placeholder="Select numerator groups"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Core</TableCell>
                                    <TableCell>
                                        <Field
                                            name="core"
                                            component={CheckboxFieldFF}
                                            type="checkbox"
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <DataMappingFormSection />
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
                                {numeratorToEdit ? 'Save' : 'Create'}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </Form>
    )
}
EditNumeratorModal.propTypes = {
    numeratorToEdit: PropTypes.object,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}
