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
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import relationTypes from '../../../data/relationTypes.json'
import { useConfigurations } from '../../../utils/index.js'

const { Form, Field } = ReactFinalForm

const DEFAULT_FORM_VALUES = {
    name: undefined,
    type: undefined,
    A: undefined,
    B: undefined,
    criteria: 0,
}

const RELATION_TYPE_OPTIONS = relationTypes.map((type) => ({
    label: type.displayName,
    value: type.code,
}))

/**
 * If `numeratorRelationToEdit`, is provided, this will behave in "update" mode:
 * - the fields will be prefilled with the values of that relation
 * - some text in the modal will refer to editing/updating
 * - the data store mutation will be an "update" action on that relation (todo)
 * Otherwise, this will behave in "add new" mode:
 * - the fields will be empty
 * - text in the modal will refer to creating/adding new
 * - the data store mutation will create a new numeratorRelation object (todo)
 */
export function EditNumeratorRelationModal({
    numeratorRelationToEdit,
    onSave,
    onClose,
}) {
    const configurations = useConfigurations()
    const numeratorOptions = React.useMemo(() => {
        const numeratorsWithDataIds = configurations.numerators
            .filter((numerator) => numerator.dataID != null)
            // sort is okay because filter() creates a copy
            .sort((a, b) => a.name.localeCompare(b.name))
        return numeratorsWithDataIds.map(({ name, code }) => ({
            label: name,
            value: code,
        }))
    }, [configurations.numerators])

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
            initialValues={numeratorRelationToEdit || DEFAULT_FORM_VALUES}
            // not subcribing to `values` prevents rerendering the entire form on every input change
            subscription={{ submitting: true }}
        >
            {({ handleSubmit }) => (
                <Modal onClose={onClose} position="middle">
                    <ModalTitle>
                        {(numeratorRelationToEdit ? 'Edit' : 'Create') +
                            ' numerator relation'}
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
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>
                                        <Field
                                            name="type"
                                            component={SingleSelectFieldFF}
                                            options={RELATION_TYPE_OPTIONS}
                                            placeholder="Select relation type"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Numerator A</TableCell>
                                    <TableCell>
                                        <Field
                                            name="A"
                                            component={SingleSelectFieldFF}
                                            options={numeratorOptions}
                                            placeholder="Select numerator A"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Numerator B</TableCell>
                                    <TableCell>
                                        <Field
                                            name="B"
                                            component={SingleSelectFieldFF}
                                            options={numeratorOptions}
                                            placeholder="Select numerator B"
                                        />
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
                                {numeratorRelationToEdit ? 'Save' : 'Create'}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </Form>
    )
}
EditNumeratorRelationModal.propTypes = {
    numeratorRelationToEdit: PropTypes.object,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}
