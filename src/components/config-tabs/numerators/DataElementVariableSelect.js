import { SingleSelectFieldFF, ReactFinalForm } from '@dhis2/ui'
import React, { useState, useEffect, useMemo } from 'react'
import { useDataItemNames } from '../../../utils/index.js'
import { TOTALS } from './constants.js'
import styles from './DataMappingForm.module.css'
import { useEngineQuery } from './useEngineQuery.js'
import { useDataMappingFieldValidator } from './useIsFieldRequired.js'

const { Field, useField } = ReactFinalForm

export const VARIABLES_QUERY = {
    response: {
        resource: 'dataElementOperands',
        params: ({ id }) => ({
            fields: 'displayName,id',
            filter: `dataElement.id:eq:${id}`,
            paging: 'false',
        }),
    },
}
export const VariableSelect = () => {
    const { fetch, loading, error } = useEngineQuery()
    const dataItemNames = useDataItemNames()
    const validate = useDataMappingFieldValidator()

    // Depends on dataItem and dataElementType
    const dataItemField = useField('dataItem', {
        subscription: { value: true, modified: true },
    })
    const dataItem = dataItemField.input.value
    const dataItemModified = dataItemField.meta.modified
    const dataElementTypeField = useField('dataElementType', {
        subscription: { value: true, modified: true },
    })
    const dataElementType = dataElementTypeField.input.value
    const dataElementTypeModified = dataElementTypeField.meta.modified

    // Access onChange to be able to clear this field
    const dataElementOperandIDField = useField('dataElementOperandID', {
        subscription: { initial: true },
    })
    const onChange = dataElementOperandIDField.input.onChange
    const initialValue = dataElementOperandIDField.meta.initial

    const initialOptions = initialValue
        ? [{ value: initialValue, label: dataItemNames.get(initialValue) }]
        : null
    console.log({ initialOptions, dataItemNames })
    const [options, setOptions] = useState(initialOptions)

    useEffect(() => {
        // Clear the selection in this field if dataItem changes
        if (dataItemModified || dataElementTypeModified) {
            onChange(undefined)
            setOptions(null)
        }

        // If no dataItem is selected, don't need to do anything else
        // (this field will be disabled)
        if (!dataItem) {
            return
        }

        if (dataElementType === TOTALS) {
            // Get the operands for this data element
            fetch(VARIABLES_QUERY, { id: dataItem.id }).then((data) => {
                const newOptions = data.response.dataElementOperands.map(
                    ({ id, displayName }) => ({ label: displayName, value: id })
                )
                setOptions(newOptions)
            })
        } else {
            const { displayName, id } = dataItem
            setOptions([{ label: displayName, value: id }])
            // there's only one option; go ahead and set it
            onChange(id)
        }
    }, [
        dataItem,
        dataItemModified,
        dataElementType,
        dataElementTypeModified,
        fetch,
        onChange,
    ])

    const placeholderText = useMemo(() => {
        if (loading) {
            return 'Loading...'
        }
        if (error) {
            return 'An error occurred'
        }
        if (!dataItem.id) {
            return 'Select a data element first'
        }
        return 'Select variable'
    }, [dataItem.id, loading, error])

    return (
        <div className={styles.formRow}>
            <Field
                name="dataElementOperandID"
                component={SingleSelectFieldFF}
                validate={validate}
                options={options || []}
                label={'Variable for completeness'}
                placeholder={placeholderText}
                loading={loading}
                disabled={!dataItem || Boolean(error) || !options}
            />
        </div>
    )
}
