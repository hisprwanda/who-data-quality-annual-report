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
    TextAreaFieldFF,
    MultiSelectFieldFF,
    CheckboxFieldFF,
    ReactFinalForm,
    hasValue,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useConfigurations, useMetadataNames } from '../../../utils/index.js'
import { DataMappingFormSection } from './DataMappingForm.js'
import styles from './EditNumeratorModal.module.css'

const { Form, Field } = ReactFinalForm

const DEFAULT_NUMERATOR_VALUES = {
    // edited in this form:
    name: undefined,
    definition: undefined,
    core: false,
    dataID: undefined, // todo: this and dataElementID don't actually get edited
    dataSetID: [], // todo: -- they use dataItem and dataSets in form state instead
    dataElementOperandID: undefined,
}

const CurrentMappingInfo = ({ dataID }) => {
    const metadataNames = useMetadataNames()
    const dataItemName = metadataNames.get(dataID)

    return (
        <div
            className={styles.currentMappingInfo}
        >{`This numerator is currently mapped to "${dataItemName}"`}</div>
    )
}
CurrentMappingInfo.propTypes = {
    dataID: PropTypes.string,
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
export function EditNumeratorModal({ numeratorDataToEdit, onSave, onClose }) {
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
            onSubmit={(values) => {
                // todo: validate! 🥳
                // todo: data items required on creation, but not edit

                // Pick data from values
                // (some values like dataElementType are just for the form)
                let newNumeratorData = {
                    name: values.name,
                    definition: values.definition,
                    core: values.core,
                }
                if (values.dataItem?.id) {
                    // add these separately so we don't set 'undefined' for a
                    // numerator we're editing with a dataID already.
                    // if dataID is set, the other two should be required
                    newNumeratorData = {
                        ...newNumeratorData,
                        // note different form state structure:
                        dataID: values.dataItem.id,
                        dataSetID: values.dataSets.map(({ id }) => id),
                        dataElementOperandID: values.dataElementOperandID,
                    }
                }

                onSave({
                    newNumeratorData,
                    groupsContainingNumerator: values.groups,
                    dataSetsContainingNumerator: values.dataSets,
                })
                onClose()
            }}
            initialValues={numeratorDataToEdit || DEFAULT_NUMERATOR_VALUES}
            // not subcribing to `values` prevents rerendering the entire form on every input change
            subscription={{ submitting: true }}
        >
            {({ handleSubmit }) => (
                <Modal onClose={onClose} position="middle">
                    <ModalTitle>
                        {(numeratorDataToEdit ? 'Edit' : 'Create') +
                            ' numerator'}
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
                                            // a validator util from UI -- basically 'required'
                                            validate={hasValue}
                                            // read-only if editing a built-in numerator
                                            disabled={
                                                numeratorDataToEdit &&
                                                !numeratorDataToEdit.custom
                                            }
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
                                            rows={2}
                                            disabled={
                                                numeratorDataToEdit &&
                                                !numeratorDataToEdit.custom
                                            }
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

                        {numeratorDataToEdit?.dataID && (
                            <CurrentMappingInfo
                                dataID={numeratorDataToEdit.dataID}
                            />
                        )}

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
                                onClick={handleSubmit}
                            >
                                {numeratorDataToEdit ? 'Save' : 'Create'}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </Form>
    )
}
EditNumeratorModal.propTypes = {
    numeratorDataToEdit: PropTypes.object,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}
