import { useDataQuery } from '@dhis2/app-runtime'
import {
    Field as FieldContainer,
    Radio,
    MultiSelectFieldFF,
    SingleSelectFieldFF,
    ReactFinalForm,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import styles from './DataMappingForm.module.css'

const { Field, useField } = ReactFinalForm

// Data item types
const DATA_ELEMENT = 'dataElement'
const INDICATOR = 'indicator'

const DATA_ELEMENT_GROUPS_QUERY = {
    reponse: {
        resource: 'dataElementGroups',
        params: { paging: false },
    },
}
const DataElementGroupSelect = () => {
    // TODO: This maybe doesn't need to use FF;
    // its value isn't saved in the final `numerator` object
    const { loading, error, data } = useDataQuery(DATA_ELEMENT_GROUPS_QUERY)

    const dataElementGroupOptions = React.useMemo(
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

const DATA_ELEMENT_GROUP_QUERY = {
    dataElementGroup: {
        resource: 'dataElementGroups',
        id: ({ id }) => id,
        params: { fields: 'dataElements[displayName,id]' },
    },
}
const DataElementSelect = () => {
    const { loading, error, data, refetch } = useDataQuery(
        DATA_ELEMENT_GROUP_QUERY,
        {
            lazy: true,
        }
    )
    const {
        input: { value: dataElementGroupID },
    } = useField('dataElementGroupID', {
        subscription: { value: true },
    })
    const {
        input: { onChange },
    } = useField('dataID', { subscription: {} })

    useEffect(() => {
        if (dataElementGroupID) {
            refetch({ id: dataElementGroupID })
            // Clear the selection in this field
            onChange(undefined)
        }
    }, [dataElementGroupID, refetch, onChange])

    const dataElementOptions = useMemo(
        () =>
            !data
                ? [] // todo: "Select a data element group"
                : data.dataElementGroup.dataElements
                      .map(({ id, displayName }) => ({
                          label: displayName,
                          value: id,
                      }))
                      .sort((a, b) => a.label.localeCompare(b.label)),
        [data]
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
                name="dataID"
                component={SingleSelectFieldFF}
                options={dataElementOptions}
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

const DataSetSelect = ({ dataItemType }) => {
    dataItemType // todo

    // todo: get data element from operand
    // need info: dataItemType, (dataElementType), dataElement/indicator
    const { loading, error, data, refetch } = useDataQuery(
        DATA_SETS_FROM_DATA_ELEMENT_QUERY,
        {
            lazy: true,
        }
    )
    const {
        input: { value: dataID },
    } = useField('dataID', { subscription: { value: true } })
    const {
        input: { onChange },
    } = useField('dataSetID', { subscription: {} })

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
        // todo: "Predictor value"? see "Data quality" DE group
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
DataSetSelect.propTypes = {
    dataItemType: PropTypes.oneOf([DATA_ELEMENT, INDICATOR]),
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
    const [dataItemType, setDataItemType] = useState(DATA_ELEMENT)

    const handleChange = useCallback(({ value }) => setDataItemType(value), [])

    return (
        <div className={styles.mainContainer}>
            <div className={styles.formRow}>
                <FieldContainer label="Data mapping">
                    <div className={styles.radiosContainer}>
                        <Radio
                            value={DATA_ELEMENT}
                            label="Data element"
                            checked={dataItemType === DATA_ELEMENT}
                            onChange={handleChange}
                        />
                        <Radio
                            value={INDICATOR}
                            label="Indicator"
                            checked={dataItemType === INDICATOR}
                            onChange={handleChange}
                        />
                    </div>
                </FieldContainer>
            </div>

            {dataItemType === DATA_ELEMENT && (
                <>
                    <DataElementGroupSelect />
                    <DataElementSelect />
                </>
            )}
            {dataItemType === INDICATOR && <p>Indicator form</p>}

            <DataSetSelect dataItemType={dataItemType} />

            <VariableSelect />
        </div>
    )
}
