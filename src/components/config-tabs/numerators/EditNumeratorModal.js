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
import React, { useMemo, useCallback } from 'react'
import {
    useConfigurations,
    useDataItemNames,
    useDefaultCocID,
} from '../../../utils/index.js'
import { getNumeratorMemberGroups } from '../../../utils/numeratorsMetadataData.js'
import { LoadingSpinner } from '../../loading-spinner/LoadingSpinner.js'
import { DATA_ELEMENT, DETAILS, INDICATOR, TOTALS } from './constants.js'
import { DataMappingFormSection } from './DataMappingForm.js'
import styles from './EditNumeratorModal.module.css'

const { Form, Field, useField } = ReactFinalForm

const DEFAULT_FORM_VALUES = {
    // Controls field visibility:
    dataType: DATA_ELEMENT,
    dataElementType: TOTALS,
}

const CurrentMappingInfo = () => {
    const {
        meta: { initial: initialDataItem },
    } = useField('prevDataItem', { subscription: { initial: true } })

    if (!initialDataItem) {
        return null
    }

    return (
        <div
            className={styles.currentMappingInfo}
        >{`This numerator is currently mapped to "${initialDataItem.displayName}"`}</div>
    )
}

const mapDataSetIDToFormItem = (id, configurations) => {
    const dataSet = configurations.dataSets.find((ds) => ds.id === id)
    return {
        id,
        // this includes a fallback: the dataSet SHOULD be found, but showing
        // the ID can be helpful during dev and debugging
        displayName: dataSet?.name || `dataSetID:${id}`,
    }
}

const getDataMappingFormValues = ({
    numeratorToEdit,
    dataItemNames,
    configurations,
    defaultCocID,
}) => {
    const { dataID, dataSetID, dataElementOperandID } = numeratorToEdit

    if (!dataID) {
        // the numerator isn't mapped yet
        return DEFAULT_FORM_VALUES
    }

    // If this is a data element, the dataID and dataElementOperand ID will
    // share the dataElement ID. Otherwise, it's an indicator
    const dataType =
        dataID.substring(0, 11) === dataElementOperandID.substring(0, 11)
            ? DATA_ELEMENT
            : INDICATOR

    // both data elements and indicators will want to know the data item name
    const dataItem = dataID
        ? { id: dataID, displayName: dataItemNames.get(dataID) }
        : null

    if (dataType === INDICATOR) {
        // todo: support indicator mapping too (RWDQA-80)
        return {
            // used for "Currently mapped to: " line:
            prevDataItem: dataItem,
            ...DEFAULT_FORM_VALUES,
        }
    }

    // Handle data element mapping:
    const dataElementType = /\w{11}\.\w{11}/.test(dataID) ? DETAILS : TOTALS

    let dataSets = null
    if (dataSetID && dataSetID.length > 0) {
        // dataSetID could be an array or a string
        if (Array.isArray(dataSetID)) {
            dataSets = dataSetID.map((id) =>
                mapDataSetIDToFormItem(id, configurations)
            )
        } else {
            // note that this still returns an array
            dataSets = [mapDataSetIDToFormItem(dataSetID, configurations)]
        }
    }

    // legacy configurations sometimes have DE operand IDs with the default
    // COC ID, which can be problematic
    const resolvedDataElementOperandID = dataElementOperandID.endsWith(
        defaultCocID
    )
        ? dataElementOperandID.substring(0, 11)
        : dataElementOperandID

    return {
        dataType,
        dataElementType,
        dataItemGroupID: numeratorToEdit.dataItemGroupID,
        dataItem,
        prevDataItem: dataItem,
        dataSets,
        dataElementOperandID: resolvedDataElementOperandID,
    }
}

/**
 * If `numeratorCode`, is provided, this will behave in "update" mode:
 * - the fields will be prefilled with the values of that relation
 * - some text in the modal will refer to editing/updating
 * - the data store mutation will be an "update" action on that numerator
 * Otherwise, this will behave in "add new" mode:
 * - the fields will be empty
 * - text in the modal will refer to creating/adding new
 * - the data store mutation will create a new numerator object
 */
export function EditNumeratorModal({ numeratorCode, onSave, onClose }) {
    const configurations = useConfigurations()
    const dataItemNames = useDataItemNames()
    const { defaultCocID, loading } = useDefaultCocID()

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

    const numeratorToEdit = useMemo(
        () =>
            numeratorCode
                ? configurations.numerators.find(
                      (n) => n.code === numeratorCode
                  )
                : null,
        [numeratorCode, configurations]
    )

    const formInitialValues = useMemo(() => {
        if (!numeratorToEdit || !defaultCocID) {
            return DEFAULT_FORM_VALUES
        }

        // process the `numerator` config object into form values
        const groups = getNumeratorMemberGroups(
            configurations,
            numeratorToEdit.code
        ).map((group) => group.code)

        const dataMappingValues = getDataMappingFormValues({
            numeratorToEdit,
            dataItemNames,
            configurations,
            defaultCocID,
        })

        return {
            name: numeratorToEdit.name,
            definition: numeratorToEdit.definition,
            groups,
            core: numeratorToEdit.core,
            ...dataMappingValues,
        }
    }, [numeratorToEdit, dataItemNames, configurations, defaultCocID])

    const onSubmit = useCallback(
        (values) => {
            // Map form values to numerator data
            const newNumeratorData = {
                name: values.name,
                definition: values.definition,
                core: values.core,
                dataItemGroupID: values.dataItemGroupID,
                // note different form state structure:
                dataID: values.dataItem.id,
                dataSetID: values.dataSets.map(({ id }) => id),
                dataElementOperandID: values.dataElementOperandID,
            }

            onSave({
                newNumeratorData,
                groupsContainingNumerator: values.groups,
                dataSetsContainingNumerator: values.dataSets,
            })
            onClose()
        },
        [onSave, onClose]
    )

    // defaultCocID will have fetched upon opening the configurations page,
    // so it shouldn't usually be loading at this point
    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <Form
            onSubmit={onSubmit}
            initialValues={formInitialValues}
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
                                            // a validator util from UI -- basically 'required'
                                            validate={hasValue}
                                            // read-only if editing a built-in numerator
                                            disabled={
                                                numeratorToEdit &&
                                                !numeratorToEdit.custom
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
                                                numeratorToEdit &&
                                                !numeratorToEdit.custom
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
    numeratorCode: PropTypes.string,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}
