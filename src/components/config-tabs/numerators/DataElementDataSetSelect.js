import { useDataQuery } from '@dhis2/app-runtime'
import {
    // rename this to not clash with Field from RFF
    MultiSelectFieldFF,
    ReactFinalForm,
} from '@dhis2/ui'
import React, { useEffect, useMemo } from 'react'
import styles from './DataMappingForm.module.css'

const { Field, useField } = ReactFinalForm

const DATA_SETS_FROM_DATA_ELEMENT_QUERY = {
    response: {
        resource: 'dataElements',
        id: ({ id }) => id,
        params: {
            fields:
                'dataSets[displayName,id,periodType],' +
                'dataSetElements[dataSet[displayName,id,periodType]',
        },
    },
}
const getSelectOptionsFromDataElement = (response) => {
    // if the data element response has a `dataSets` property, use that
    if (response.dataSets) {
        return response.dataSets.map(({ id, displayName }) => ({
            label: displayName,
            value: id,
        }))
    }

    // otherwise, assemble a list of data sets based on dataSetElements
    const dataSetMap = new Map()
    response.dataSetElements.forEach(({ dataSet: { id, displayName } }) => {
        // set in a map to avoid duplicates
        dataSetMap.set(id, displayName)
    })
    const selectOptions = []
    dataSetMap.forEach((displayName, id) => {
        selectOptions.push({ label: displayName, value: id })
    })
    selectOptions.sort((a, b) => a.label.localeCompare(b.label))
    return selectOptions
}

export const DataSetSelect = () => {
    const { loading, error, data, refetch } = useDataQuery(
        DATA_SETS_FROM_DATA_ELEMENT_QUERY,
        {
            lazy: true,
        }
    )
    // Depends on dataItem value (which handles both dataElementTypes)
    const dataItemField = useField('dataItem', {
        subscription: { value: true },
    })
    const dataItem = dataItemField.input.value

    // Get the onChange handler to be able to clear this field
    const dataSetIDField = useField('dataSetID', { subscription: {} })
    const onChange = dataSetIDField.input.onChange

    useEffect(() => {
        if (dataItem) {
            console.log({ dataItem })
            refetch({ id: dataItem.id })
        }
        // Clear the selection in this field if dataItem changes, even undefined
        onChange(undefined)
    }, [dataItem, refetch, onChange])

    const dataSetOptions = useMemo(() => {
        if (!data) {
            return []
        }
        return getSelectOptionsFromDataElement(data.response)
        // todo: disable if empty -- see "Data quality" DE group
    }, [data])

    if (loading) {
        return 'loading' // todo
    }
    if (error) {
        return 'error' // todo
    }

    return (
        <div className={styles.formRow}>
            <Field
                name="dataSetID"
                component={MultiSelectFieldFF}
                options={dataSetOptions}
                label={'Data sets for completeness'}
                placeholder={'Select data sets'}
            />
        </div>
    )
}
