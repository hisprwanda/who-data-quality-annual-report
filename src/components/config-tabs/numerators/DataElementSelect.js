import {
    // rename this to not clash with Field from RFF
    SingleSelectFieldFF,
    ReactFinalForm,
    hasValue
} from '@dhis2/ui'
import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { TOTALS } from './constants.js'
import styles from './DataMappingForm.module.css'
import { useEngineQuery } from './useEngineQuery.js'

const { Field, useField } = ReactFinalForm

const DATA_ELEMENT_TOTALS_QUERY = {
    response: {
        resource: 'dataElementGroups',
        id: ({ id }) => id,
        params: { fields: 'dataElements[displayName,id]' },
    },
}

const DATA_ELEMENT_DETAILS_QUERY = {
    response: {
        resource: 'dataElementOperands',
        params: ({ id }) => ({
            fields: 'displayName,id,dataElementId,optionComboId',
            filter: `dataElement.dataElementGroups.id:eq:${id}`,
            paging: false,
        }),
    },
}

const mapMetadataItemsToOptions = (items) =>
    items
        .map(({ id, displayName }) => ({
            label: displayName,
            value: id,
        }))
        .sort((a, b) => a.label?.localeCompare(b.label))

export const DataElementSelect = () => {
    const { fetch, loading, error } = useEngineQuery()

    // Depends on 1. dataElementType and 2. dataItemGroupID
    const dataElementTypeField = useField('dataElementType', {
        subscription: { value: true },
    })
    const dataItemGroupIDField = useField('dataItemGroupID', {
        subscription: { modified: true, value: true },
    })
    const dataElementType = dataElementTypeField.input.value
    const dataItemGroupID = dataItemGroupIDField.input.value
    const dataItemGroupIDModified = dataItemGroupIDField.meta.modified

    // Some utils for this field: onChange and initial value
    const dataItemField = useField('dataItem', {
        subscription: { initial: true },
    })
    const onChange = dataItemField.input.onChange
    const initialOptions = dataItemField.meta.initial
        ? mapMetadataItemsToOptions([dataItemField.meta.initial])
        : null

    const [options, setOptions] = useState(initialOptions)

    useEffect(() => {
        // Clear this field if the data element group has changed
        if (dataItemGroupIDModified) {
            onChange(undefined)
            setOptions(null)
        }

        // If no group is selected, don't need to fetch
        if (!dataItemGroupID) {
            return
        }

        if (dataElementType === TOTALS) {
            fetch(DATA_ELEMENT_TOTALS_QUERY, { id: dataItemGroupID }).then(
                (data) => {
                    const newOptions = mapMetadataItemsToOptions(
                        data.response.dataElements
                    )
                    setOptions(newOptions)
                }
            )
        } else {
            fetch(DATA_ELEMENT_DETAILS_QUERY, { id: dataItemGroupID }).then(
                (data) => {
                    const newOptions = mapMetadataItemsToOptions(
                        data.response.dataElementOperands
                    )
                    setOptions(newOptions)
                }
            )
        }

        // rerun this if dataElementType or dataItemGroupID change
    }, [
        dataElementType,
        dataItemGroupID,
        dataItemGroupIDModified,
        fetch,
        onChange,
    ])

    // Using `format` and `parse` here is a weird trick: we want to add
    // `dataItem={ id, displayName }` to the form state so that it can be
    // shared with "Variable for completeness", but the UI component can only
    // handle strings as the `value` prop. So we pass it a string, and convert
    // it back to an object on change
    const format = useCallback((dataItem) => dataItem?.id, [])
    // This could be optimized with a look-up object, but it's not a very
    // high-traffic operation
    const parse = useCallback(
        (id) => {
            const { label, value } = options.find(
                (option) => option.value === id
            )
            return { id: value, displayName: label }
        },
        [options]
    )

    const placeholderText = useMemo(() => {
        if (loading) {
            return 'Loading...'
        }
        if (error) {
            return 'An error occurred'
        }
        if (!dataItemGroupID) {
            return 'Select a data element group first'
        }
        return 'Select data element'
    }, [dataItemGroupID, loading, error])

    return (
        <div className={styles.formRow}>
            <Field
                // Final Form options
                name="dataItem"
                component={SingleSelectFieldFF}
                format={format}
                parse={parse}
                validate={hasValue}
                // DHIS2 UI options
                options={options || []}
                label={'Data element'}
                placeholder={placeholderText}
                filterable
                disabled={loading || Boolean(error) || !options}
            />
        </div>
    )
}
