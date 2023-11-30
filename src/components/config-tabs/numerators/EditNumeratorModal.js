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
import React, { useMemo } from 'react'
import { useConfigurations, useDataItemNames } from '../../../utils/index.js'
import { DATA_ELEMENT, TOTALS } from './constants.js'
import { DataMappingFormSection } from './DataMappingForm.js'
import styles from './EditNumeratorModal.module.css'

const { Form, Field, useField } = ReactFinalForm

const DEFAULT_FORM_VALUES = {
    // Controls field visibility:
    dataType: DATA_ELEMENT,
    dataElementType: TOTALS,
}

const CurrentMappingInfo = () => {
    // subscription not needed because it won't be changing
    const prevDataIDField = useField('prevDataID')
    const prevDataID = prevDataIDField.input.value
    const dataItemNames = useDataItemNames()

    if (!prevDataID) {
        return null
    }

    const dataItemName = dataItemNames.get(prevDataID)
    return (
        <div
            className={styles.currentMappingInfo}
        >{`This numerator is currently mapped to "${dataItemName}"`}</div>
    )
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
    const dataItemNames = useDataItemNames()

    const numeratorGroupOptions = useMemo(
        () =>
            configurations.groups
                .map(({ name, code }) => ({
                    label: name,
                    value: code,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [configurations.groups]
    )

    const formInitialValues = useMemo(() => {
        if (!numeratorDataToEdit) {
            return DEFAULT_FORM_VALUES
        }

        // todo: get numerator by code, then process into initial values

        const dataItem = {
            id: numeratorDataToEdit.prevDataID,
            displayName: dataItemNames.get(numeratorDataToEdit.prevDataID),
        }

        const dataSets = Array.isArray(numeratorDataToEdit.dataSetID)
            ? numeratorDataToEdit.dataSetID.map((id) => ({
                  id,
                  displayName: configurations.dataSets.find(
                      (ds) => ds.id === id
                  ).name,
              }))
            : [
                  {
                      id: numeratorDataToEdit.dataSetID,
                      displayName: configurations.dataSets.find(
                          (ds) => ds.id === numeratorDataToEdit.dataSetID
                      ).name,
                  },
              ]

        // properties listed out here for clarity
        return {
            name: numeratorDataToEdit.name,
            definition: numeratorDataToEdit.definition,
            groups: numeratorDataToEdit.groups,
            core: numeratorDataToEdit.core,
            // not an editable field, but will be added to the form state
            // for convenience (some fields will be read-only)
            custom: numeratorDataToEdit.custom,
            // same (for other form logic like if fields are required)
            prevDataID: numeratorDataToEdit.prevDataID,
            // data mapping
            dataItem,
            dataSets,
            // todo: add dataElementOperand
            ...DEFAULT_FORM_VALUES,
        }
    }, [numeratorDataToEdit, dataItemNames, configurations.dataSets])

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
            initialValues={formInitialValues}
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

                        <CurrentMappingInfo />

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
