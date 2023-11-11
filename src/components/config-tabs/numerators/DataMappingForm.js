import { useDataQuery } from '@dhis2/app-runtime'
import {
    Field as FieldContainer,
    Radio,
    MultiSelectFieldFF,
    SingleSelectFieldFF,
    ReactFinalForm,
} from '@dhis2/ui'
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import styles from './DataMappingForm.module.css'

const { Field, useField } = ReactFinalForm

const DATA_ELEMENT_GROUPS_QUERY = {
    deGroupsResponse: {
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
                : data.deGroupsResponse.dataElementGroups.map(
                      ({ id, displayName }) => ({
                          label: displayName,
                          value: id,
                      })
                  ),
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
            onChange('')
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
            />
        </div>
    )
}

// Data item types
const DATA_ELEMENT = 'dataElement'
const INDICATOR = 'indicator'

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

            <div className={styles.formRow}>
                <Field
                    name="dataSetID"
                    component={MultiSelectFieldFF}
                    options={[
                        // todo
                        { label: 'A', value: 'A' },
                        { label: 'B', value: 'B' },
                    ]}
                    label={'Data sets for completeness'}
                    placeholder={'Select one more data sets'}
                />
            </div>

            <div className={styles.formRow}>
                <Field
                    name="dataElementOperandID"
                    component={SingleSelectFieldFF}
                    options={[
                        // todo
                        { label: 'A', value: 'A' },
                        { label: 'B', value: 'B' },
                    ]}
                    label={'Variable for completeness'}
                    placeholder={'Select variable'}
                />
            </div>
        </div>
    )
}
