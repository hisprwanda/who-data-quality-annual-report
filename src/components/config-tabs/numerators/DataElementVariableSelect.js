import { SingleSelectFieldFF, ReactFinalForm } from '@dhis2/ui'
import React, { useState, useEffect } from 'react'
import { TOTALS } from './constants.js'
import styles from './DataMappingForm.module.css'
import { useEngineQuery } from './useEngineQuery.js'

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
    const [options, setOptions] = useState([])

    // Depends on dataItem and dataElementType
    const dataItemField = useField('dataItem', {
        subscription: { value: true },
    })
    const dataItem = dataItemField.input.value
    const dataElementTypeField = useField('dataElementType', {
        subscription: { value: true },
    })
    const dataElementType = dataElementTypeField.input.value

    // Access onChange to be able to clear this field
    const dataElementOperandIDField = useField('dataElementOperandID', {
        subscription: {},
    })
    const onChange = dataElementOperandIDField.input.onChange

    useEffect(() => {
        // Clear the selection in this field if dataItem changes, even undefined
        onChange(undefined)

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
    }, [dataItem, dataElementType, fetch, onChange])

    if (loading) {
        return 'loading' // todo
    }
    if (error) {
        return 'error' // todo
    }

    return (
        <div className={styles.formRow}>
            <Field
                name="dataElementOperandID"
                component={SingleSelectFieldFF}
                options={options}
                label={'Variable for completeness'}
                placeholder={'Select variable'}
            />
        </div>
    )
}
