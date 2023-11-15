import {
    // rename this to not clash with Field from RFF
    SingleSelectFieldFF,
    ReactFinalForm,
} from '@dhis2/ui'
import React, { useCallback, useState, useEffect } from 'react'
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
const mapDataElementTotalsResponseToOptions = (data) => {
    return data.response.dataElements
        .map(({ id, displayName }) => ({
            label: displayName,
            value: id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
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
const mapDataElementDetailsResponseToOptions = (data) => {
    return data.response.dataElementOperands
        .map(({ id, displayName }) => ({
            label: displayName,
            value: id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
}

export const DataElementSelect = () => {
    const { fetch, loading, error } = useEngineQuery()
    const [options, setOptions] = useState([])

    // Depends on 1. dataElementType and 2. dataElementGroupID
    const dataElementTypeField = useField('dataElementType', {
        subscription: { value: true },
    })
    const dataElementGroupIDField = useField('dataElementGroupID', {
        subscription: { value: true },
    })
    const dataElementType = dataElementTypeField.input.value
    const dataElementGroupID = dataElementGroupIDField.input.value

    // Get the onChange handler to be able to clear this field
    const dataItemField = useField('dataItem', { subscription: {} })
    const onChange = dataItemField.input.onChange

    useEffect(() => {
        // Clear the selection in this field
        onChange(undefined)

        if (!dataElementGroupID) {
            // todo: setOptions([])?
            return
        }

        if (dataElementType === TOTALS) {
            fetch(DATA_ELEMENT_TOTALS_QUERY, { id: dataElementGroupID }).then(
                (data) => {
                    const newOptions =
                        mapDataElementTotalsResponseToOptions(data)
                    setOptions(newOptions)
                }
            )
        } else {
            fetch(DATA_ELEMENT_DETAILS_QUERY, { id: dataElementGroupID }).then(
                (data) => {
                    const newOptions =
                        mapDataElementDetailsResponseToOptions(data)
                    setOptions(newOptions)
                }
            )
        }

        // rerun this if dataElementType or dataElementGroupID change
    }, [dataElementType, dataElementGroupID, fetch, onChange])

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

    if (loading) {
        return 'loading' // todo
    }
    if (error) {
        return 'error' // todo
    }

    return (
        <div className={styles.formRow}>
            <Field
                name="dataItem"
                component={SingleSelectFieldFF}
                format={format}
                parse={parse}
                options={options}
                label={'Data element'}
                placeholder={'Select data element'}
                filterable
            />
        </div>
    )
}
