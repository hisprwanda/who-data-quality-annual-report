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
 * - the data store mutation will be an "update" action on that relation, (todo)
 * - some text in the modal will refer to editing/updating
 * Otherwise, this will behave in "add new" mode:
 * - the fields will be empty (todo)
 * - the data store mutation will create a new numeratorRelation object (todo)
 * - text in the modal will refer to creating/adding new (todo)
 */
export function EditNumeratorRelationModal({
    numeratorRelationToEdit,
    configurations,
    onClose,
}) {
    const numeratorOptions = React.useMemo(() => {
        const numeratorsWithDataIds = configurations.numerators.filter(
            (numerator) => numerator.dataID != null
        )
        return numeratorsWithDataIds.map(({ name, code }) => ({
            label: name,
            value: code,
        }))
    }, [configurations.numerators])

    return (
        <Form
            onSubmit={(...submitProps) => {
                alert('todo')
                console.log({ submitProps })
            }}
            initialValues={numeratorRelationToEdit || DEFAULT_FORM_VALUES}
            // not subcribing to `values` prevents rerendering the entire form on every input change
            subscription={{ submitting: true }}
        >
            {({ handleSubmit }) => (
                <Modal onClose={onClose} position="middle">
                    <ModalTitle>Numerator relation</ModalTitle>
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
                                Save
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </Form>
    )
}
EditNumeratorRelationModal.propTypes = {
    configurations: PropTypes.object,
    numeratorRelationToEdit: PropTypes.object,
    onClose: PropTypes.func,
}
