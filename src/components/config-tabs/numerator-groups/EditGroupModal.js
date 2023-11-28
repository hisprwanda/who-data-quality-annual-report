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
import React from 'react'
import { validateUniqueConfigObjectName } from '../../../utils/configurations/validateUniqueConfigObjectName.js'
import { useConfigurations } from '../../../utils/index.js'

const { Form, Field } = ReactFinalForm

const DEFAULT_FORM_VALUES = {
    name: undefined,
    members: [],
}

export function EditGroupModal({ groupToEdit, onSave, onClose }) {
    const configurations = useConfigurations()
    const membersOptions = React.useMemo(
        () =>
            configurations.numerators
                .map(({ name, code }) => ({
                    label: name,
                    value: code,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)), // sort alphabetically
        [configurations.numerators]
    )

    return (
        <Form
            onSubmit={(values) => {
                if (onSave) {
                    // validate that the group name is unique while creating a new group
                    if (!groupToEdit) {
                        const isUnique = validateUniqueConfigObjectName(
                            values.name,
                            'groups',
                            configurations
                        )
                        if (isUnique) {
                            onSave(values)
                        } else {
                            alert('Group name is not unique')
                        }
                    } else {
                        // if we are not editing an existing group, no need to check if the name is unique
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
                        {(groupToEdit ? 'Edit' : 'Create') + ' Group'}
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
                                    <TableCell>Group Members</TableCell>
                                    <TableCell>
                                        <Field
                                            name="members"
                                            component={MultiSelectFieldFF}
                                            options={membersOptions}
                                            placeholder="Select numerators"
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
                                Cancel
                            </Button>
                            <Button
                                primary
                                type="submit"
                                onClick={() => {
                                    handleSubmit()
                                }}
                            >
                                {groupToEdit ? 'Save' : 'Create'}
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
