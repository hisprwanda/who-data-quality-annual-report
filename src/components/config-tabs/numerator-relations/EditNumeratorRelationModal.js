import i18n from '@dhis2/d2-i18n'
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
 * - the data store mutation will be an "update" action on that relation
 * Otherwise, this will behave in "add new" mode:
 * - the fields will be empty
 * - text in the modal will refer to creating/adding new
 * - the data store mutation will create a new numeratorRelation object
 */
export function EditNumeratorRelationModal({
    numeratorRelationToEdit,
    onSave,
    onClose,
}) {
    const configurations = useConfigurations()
    const numeratorOptions = React.useMemo(() => {
        const numeratorsWithDataIds = [...configurations.numerators].sort(
            (a, b) => a.name?.localeCompare(b.name)
        )
        return numeratorsWithDataIds.map(({ name, code }) => ({
            label: name,
            value: code,
        }))
    }, [configurations.numerators])

    return (
        <Form
            onSubmit={(values) => {
                // todo: validate! 🥳
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
                        {(numeratorRelationToEdit
                            ? i18n.t('Edit')
                            : i18n.t('Create')) + i18n.t(' numerator relation')}
                    </ModalTitle>
                    <ModalContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{i18n.t('Name')}</TableCell>
                                    <TableCell>
                                        <Field
                                            name="name"
                                            component={InputFieldFF}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>{i18n.t('Type')}</TableCell>
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
                                    <TableCell>
                                        {i18n.t('Numerator A')}
                                    </TableCell>
                                    <TableCell>
                                        <Field
                                            name="A"
                                            component={SingleSelectFieldFF}
                                            options={numeratorOptions}
                                            placeholder={i18n.t(
                                                'Select numerator A'
                                            )}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        {i18n.t('Numerator B')}
                                    </TableCell>
                                    <TableCell>
                                        <Field
                                            name="B"
                                            component={SingleSelectFieldFF}
                                            options={numeratorOptions}
                                            placeholder={i18n.t(
                                                'Select numerator B'
                                            )}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        {i18n.t('Threshold (+/-) %')}
                                    </TableCell>
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
                            {i18n.t(
                                'Threshold denotes the % difference from national figure that is accepted for a sub-national unit.'
                            )}
                        </p>
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button secondary onClick={onClose}>
                                {i18n.t('Cancel')}
                            </Button>
                            <Button
                                primary
                                type="submit"
                                onClick={() => {
                                    handleSubmit()
                                }}
                            >
                                {numeratorRelationToEdit
                                    ? i18n.t('Save')
                                    : i18n.t('Create')}
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
