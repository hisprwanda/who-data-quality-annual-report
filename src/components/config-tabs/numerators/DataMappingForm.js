import { useDataEngine, useDataQuery } from '@dhis2/app-runtime'
import {
    // rename this to not clash with Field from RFF
    Field as FieldContainer,
    MultiSelectFieldFF,
    SingleSelectFieldFF,
    RadioFieldFF,
    ReactFinalForm,
} from '@dhis2/ui'
import React, { useState, useEffect, useMemo } from 'react'
import styles from './DataMappingForm.module.css'

const { Field, useField } = ReactFinalForm

// Data item types
const DATA_ELEMENT = 'dataElement'
const INDICATOR = 'indicator'

// Data element types
const TOTALS = 'totals'
const DETAILS = 'details'

const DataElementTypeRadios = () => {
    return (
        <div className={styles.formRow}>
            <FieldContainer label="Data element type">
                <div className={styles.radiosContainer}>
                    <Field
                        name="dataElementType"
                        type="radio"
                        component={RadioFieldFF}
                        value={TOTALS}
                        label={'Totals'}
                        initialValue={TOTALS}
                    />
                    <Field
                        name="dataElementType"
                        type="radio"
                        component={RadioFieldFF}
                        value={DETAILS}
                        label={'Details'}
                    />
                </div>
            </FieldContainer>
        </div>
    )
}

const DataTypeRadios = () => {
    return (
        <div className={styles.formRow}>
            <FieldContainer label="Data type">
                <div className={styles.radiosContainer}>
                    <Field
                        name="dataType"
                        type="radio"
                        component={RadioFieldFF}
                        value={DATA_ELEMENT}
                        label={'Data element'}
                        initialValue={DATA_ELEMENT}
                    />
                    <Field
                        name="dataType"
                        type="radio"
                        component={RadioFieldFF}
                        value={INDICATOR}
                        label={'Indicator'}
                    />
                </div>
            </FieldContainer>
        </div>
    )
}

const DATA_ELEMENT_GROUPS_QUERY = {
    reponse: {
        resource: 'dataElementGroups',
        params: { paging: false },
    },
}
const DataElementGroupSelect = () => {
    const { loading, error, data } = useDataQuery(DATA_ELEMENT_GROUPS_QUERY)

    const dataElementGroupOptions = useMemo(
        () =>
            !data
                ? []
                : data.reponse.dataElementGroups.map(({ id, displayName }) => ({
                      label: displayName,
                      value: id,
                  })),
        [data]
    )

    if (loading) {
        return 'loading'
    }
    if (error) {
        console.error(error)
        return 'error'
    }

    return (
        <div className={styles.formRow}>
            <Field
                name="dataElementGroupID"
                component={SingleSelectFieldFF}
                options={dataElementGroupOptions}
                label={'Data element group'}
                placeholder={'Select data element group'}
                filterable
            />
        </div>
    )
}

const useEngineQuery = () => {
    const engine = useDataEngine()
    const [data, setData] = useState()
    const [loading, setLoading] = useState()
    const [error, setError] = useState()

    const fetch = React.useCallback(
        async (query, variables) => {
            setLoading(true)
            setError(false)
            try {
                const data = await engine.query(query, { variables })
                setData(data)
                setLoading(false)
                return data
            } catch (err) {
                setError(err)
                setLoading(false)
                throw err // won't crash the app; can be useful to catch
            }
        },
        [engine]
    )

    return { data, loading, error, fetch }
}

const DATA_ELEMENT_TOTALS_QUERY = {
    response: {
        resource: 'dataElementGroups',
        id: ({ id }) => id,
        params: { fields: 'dataElements[displayName,id]' },
    },
}
const mapDataElementTotalsResponseToOptions = (data) => {
    console.log({ data })
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
    console.log({ data })
    return data.response.dataElementOperands
        .map(({ id, displayName }) => ({
            label: displayName,
            value: id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
}

const DataElementSelect = () => {
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
    const dataIDField = useField('dataID', { subscription: {} })
    const onChange = dataIDField.input.onChange

    useEffect(() => {
        // Clear the selection in this field
        onChange(undefined)

        if (!dataElementGroupID) {
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

    if (loading) {
        return 'loading' // todo
    }
    if (error) {
        return 'error' // todo
    }

    return (
        <div className={styles.formRow}>
            <Field
                name="dataID"
                component={SingleSelectFieldFF}
                options={options}
                label={'Data element'}
                placeholder={'Select data element'}
                filterable
            />
        </div>
    )
}

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

const DataSetSelect = () => {
    // need info: dataItemType, (dataElementType), dataElement/indicator
    const { loading, error, data, refetch } = useDataQuery(
        DATA_SETS_FROM_DATA_ELEMENT_QUERY,
        {
            lazy: true,
        }
    )
    // Depends on dataID value (which handles both dataElementTypes)
    const dataIDField = useField('dataID', { subscription: { value: true } })
    const dataID = dataIDField.input.value

    // Get the onChange handler to be able to clear this field
    const dataSetIDField = useField('dataSetID', { subscription: {} })
    const onChange = dataSetIDField.input.onChange

    useEffect(() => {
        if (dataID) {
            refetch({ id: dataID })
        }
        // Clear the selection in this field if dataID changes, even undefined
        onChange(undefined)
    }, [dataID, refetch, onChange])

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

const VARIABLES_QUERY = {
    response: {
        resource: 'dataElementOperands',
        params: ({ id }) => ({
            fields: 'displayName,id',
            filter: `dataElement.id:eq:${id}`,
            paging: 'false',
        }),
    },
}
const VariableSelect = () => {
    const { loading, error, data, refetch } = useDataQuery(VARIABLES_QUERY, {
        lazy: true,
    })
    const {
        input: { value: dataID },
    } = useField('dataID', { subscription: { value: true } })
    const {
        input: { onChange },
    } = useField('dataElementOperandID', { subscription: {} })

    useEffect(() => {
        if (dataID) {
            refetch({ id: dataID })
        }
        // Clear the selection in this field if dataID changes, even undefined
        onChange(undefined)
    }, [dataID, refetch, onChange])

    const dataElementOperandOptions = useMemo(() => {
        if (!data) {
            return []
        }
        return data.response.dataElementOperands.map(({ id, displayName }) => ({
            label: displayName,
            value: id,
        }))
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
                name="dataElementOperandID"
                component={SingleSelectFieldFF}
                options={dataElementOperandOptions}
                label={'Variable for completeness'}
                placeholder={'Select variable'}
            />
        </div>
    )
}

export const DataMappingFormSection = () => {
    const dataTypeField = useField('dataType', {
        subscription: { value: true },
        // need to set the initial value here instead of on the <Field />
        // so the components below can render
        initialValue: DATA_ELEMENT,
    })
    const dataType = dataTypeField.input.value

    return (
        <div className={styles.mainContainer}>
            <DataTypeRadios />

            {dataType === DATA_ELEMENT && (
                <>
                    <DataElementTypeRadios />
                    <DataElementGroupSelect />
                    <DataElementSelect />
                </>
            )}
            {dataType === INDICATOR && <p>Indicator form</p>}

            <DataSetSelect />

            <VariableSelect />
        </div>
    )
}
