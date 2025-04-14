import i18n from '@dhis2/d2-i18n'
import { useAlert } from '@dhis2/app-runtime'
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
    MultiSelectFieldFF,
    ReactFinalForm,
    hasValue,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { useConfigurations } from '../../../utils/index.js'

const { Form, Field } = ReactFinalForm

const DEFAULT_FORM_VALUES = {
    name: undefined,
    members: [],
}

export function EditGroupModal({ groupToEdit, onSave, onClose }) {
    const configurations = useConfigurations()
    const { show } = useAlert(({ message }) => message, { critical: true })

    const membersOptions = React.useMemo(
        () =>
            configurations.numerators
                .map(({ name, code }) => ({
                    label: name,
                    value: code,
                }))
                .sort((a, b) => a.label?.localeCompare(b.label)), // sort alphabetically
        [configurations.numerators]
    )

    /**
     * Returns true if the newName is unique accross groups names & false if not
     */
    const validateUniqueGroupName = useCallback(
        (newName) => {
            // check if there are any groups
            if (!configurations.groups || configurations.groups.length === 0) {
                return true
            }
            // check if the new group name is unique
            const existingGroup = configurations.groups.find(
                (group) => group.name.toLowerCase() === newName.toLowerCase()
            )
            if (existingGroup) {
                return false
            }
            return true
        },
        [configurations.groups]
    )

    return (
        <Form
            onSubmit={(values) => {
                if (onSave) {
                    // validate that the group name is unique while creating or editing group
                    // (if we are editing an existing group, we need to check if the groupToEdit name has been changed, if so, we need to check if the new name is unique)
                    if (!groupToEdit || groupToEdit.name !== values.name) {
                        if (validateUniqueGroupName(values.name)) {
                            onSave(values)
                        } else {
                            // warn the user that the group name is not unique
                            const message = i18n.t(
                                'A group with the name {{name}} already exists. Please choose a different name.',
                                {
                                    name: values.name,
                                }
                            )
                            show({ message })
                        }
                    } else {
                        onSave(values)
                    }
                } else {
                    alert('todo')
                }
                onClose()
            }}
            initialValues={groupToEdit || DEFAULT_FORM_VALUES}
            // not subcribing to `values` prevents rerendering the entire form on every input change
            subscription={{ submitting: true }}
        >
            {({ handleSubmit }) => (
                <Modal onClose={onClose} position="middle">
                    <ModalTitle>
                        {(groupToEdit ? i18n.t('Edit') : i18n.t('Create')) +
                            i18n.t(' Group')}
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
                                            autoComplete="off"
                                            validate={hasValue}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        {i18n.t('Group Members')}
                                    </TableCell>
                                    <TableCell>
                                        <Field
                                            name="members"
                                            component={MultiSelectFieldFF}
                                            options={membersOptions}
                                            placeholder={i18n.t(
                                                'Select numerators'
                                            )}
                                            filterable
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
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
                                {groupToEdit
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

EditGroupModal.propTypes = {
    groupToEdit: PropTypes.object,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}
