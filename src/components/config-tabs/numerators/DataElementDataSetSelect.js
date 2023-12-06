import { useDataQuery } from '@dhis2/app-runtime'
import { MultiSelectFieldFF, ReactFinalForm } from '@dhis2/ui'
import React, { useEffect, useMemo, useCallback } from 'react'
import styles from './DataMappingForm.module.css'
import { useDataMappingFieldValidator } from './useIsFieldRequired.js'

const { Field, useField } = ReactFinalForm

// This query actually works for either a data element or a
// data element operand ID
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
/**
 * returns { selectOptions, dataSetLookup }, where selectOptions are
 * { label, value } objects for a Select UI component, and dataSetLookup
 * is a map of the dataSet objects keyed by ID (useful for the
 * parse/format trick in the component below)
 */
const parseDataSetsResponse = (response) => {
    // if the data element response has a `dataSets` property, use that
    const dataSetLookup = new Map()
    if (response.dataSets) {
        const selectOptions = response.dataSets.map((dataSet) => {
            // as a side-effect, populated the dataSetLookup
            dataSetLookup.set(dataSet.id, dataSet)
            return {
                label: dataSet.displayName,
                value: dataSet.id,
            }
        })
        return { selectOptions, dataSetLookup }
    }

    // otherwise, assemble a list of data sets based on dataSetElements
    response.dataSetElements.forEach(({ dataSet }) => {
        // set directly in the map to avoid duplicates
        dataSetLookup.set(dataSet.id, dataSet)
    })
    const selectOptions = []
    dataSetLookup.forEach((dataSet, id) => {
        selectOptions.push({ label: dataSet.displayName, value: id })
    })
    selectOptions.sort((a, b) => a.label.localeCompare(b.label))

    return { selectOptions, dataSetLookup }
}

const getInitialOptions = (initialDataSets) => {
    if (!initialDataSets) {
        return null
    }
    return initialDataSets.map(({ id, displayName }) => ({
        label: displayName,
        value: id,
    }))
}

export const DataSetSelect = () => {
    const { loading, error, data, refetch } = useDataQuery(
        DATA_SETS_FROM_DATA_ELEMENT_QUERY,
        {
            lazy: true,
        }
    )
    const validate = useDataMappingFieldValidator()

    // Depends on dataItem value (which handles both dataElementTypes)
    const dataItemField = useField('dataItem', {
        subscription: { modified: true, value: true },
    })
    const dataItem = dataItemField.input.value
    const dataItemModified = dataItemField.meta.modified

    // Get the onChange handler to be able to clear this field
    const dataSetsField = useField('dataSets', {
        subscription: { initial: true },
    })
    const onChange = dataSetsField.input.onChange
    const initialDataSets = dataSetsField.meta.initial

    useEffect(() => {
        if (dataItem) {
            refetch({ id: dataItem.id })
        }
        // Clear the selection in this field if dataItem changes (but not
        // if unmodified, so that initial values aren't immediately cleared)
        if (dataItemModified) {
            onChange(undefined)
        }
    }, [dataItem, dataItemModified, refetch, onChange])

    const { selectOptions, dataSetLookup } = useMemo(() => {
        if (!data) {
            // if there is an initial value for dataSets, add those to the options
            // so they can be selected before the fetch completes
            const options = getInitialOptions(initialDataSets)
            return { selectOptions: options, dataSetLookup: new Map() }
        }
        return parseDataSetsResponse(data.response)
    }, [data, initialDataSets])

    // Because we want the whole dataSet object in the form state, but the
    // Select UI component can only handle strings as values, we use the
    // 'format/parse' trick we also use in the DataElementSelect
    const format = useCallback((dataSets) => dataSets?.map(({ id }) => id), [])
    const parse = useCallback(
        (dataSetIDs) => dataSetIDs.map((id) => dataSetLookup.get(id)),
        [dataSetLookup]
    )

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
        return 'Select data sets'
    }, [dataItem.id, loading, error])

    return (
        <div className={styles.formRow}>
            <Field
                name="dataSets"
                component={MultiSelectFieldFF}
                options={selectOptions || []}
                format={format}
                parse={parse}
                validate={validate}
                label={'Data sets for completeness'}
                placeholder={placeholderText}
                // sometimes data elements aren't associated with any data
                // sets though 🤔
                disabled={
                    !dataItem || loading || Boolean(error) || !selectOptions
                }
            />
        </div>
    )
}
