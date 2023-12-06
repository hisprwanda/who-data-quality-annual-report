import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelectFieldFF, ReactFinalForm } from '@dhis2/ui'
import React, { useMemo } from 'react'
import styles from './DataMappingForm.module.css'

const { Field, useField } = ReactFinalForm

const DATA_ELEMENT_GROUPS_QUERY = {
    reponse: {
        resource: 'dataElementGroups',
        params: { paging: false },
    },
}

export const DataElementGroupSelect = () => {
    const { loading, error, data } = useDataQuery(DATA_ELEMENT_GROUPS_QUERY)

    const dataItemGroupIDField = useField('dataItemGroupID', {
        subscription: { initial: true },
    })
    const initialValue = dataItemGroupIDField.meta.initial

    const dataElementGroupOptions = useMemo(() => {
        if (data) {
            return data.reponse.dataElementGroups.map(
                ({ id, displayName }) => ({
                    label: displayName,
                    value: id,
                })
            )
        } else if (initialValue) {
            // This isn't always expected if there's a numeratorToEdit, but it
            // isn't necessary. Data sets and variable for completeness can
            // still be edited
            return [{ value: initialValue, label: 'Loading group name...' }]
        }
        return null
    }, [data, initialValue])

    const placeholderText = useMemo(() => {
        if (error) {
            return 'An error occurred'
        }
        return 'Select data element group'
    }, [error])

    return (
        <div className={styles.formRow}>
            <Field
                name="dataItemGroupID"
                component={SingleSelectFieldFF}
                options={dataElementGroupOptions || []}
                label={'Data element group'}
                placeholder={placeholderText}
                loading={loading}
                disabled={Boolean(error)}
                filterable
            />
        </div>
    )
}
