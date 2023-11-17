import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelectFieldFF, ReactFinalForm } from '@dhis2/ui'
import React, { useMemo } from 'react'
import styles from './DataMappingForm.module.css'

const { Field } = ReactFinalForm

const DATA_ELEMENT_GROUPS_QUERY = {
    reponse: {
        resource: 'dataElementGroups',
        params: { paging: false },
    },
}

export const DataElementGroupSelect = () => {
    const { loading, error, data } = useDataQuery(DATA_ELEMENT_GROUPS_QUERY)

    const dataElementGroupOptions = useMemo(
        () =>
            data
                ? data.reponse.dataElementGroups.map(({ id, displayName }) => ({
                      label: displayName,
                      value: id,
                  }))
                : null,
        [data]
    )

    const placeholderText = useMemo(() => {
        if (loading) {
            return 'Loading...'
        }
        if (error) {
            return 'An error occurred'
        }
        return 'Select data element group'
    }, [loading, error])

    return (
        <div className={styles.formRow}>
            <Field
                name="dataElementGroupID"
                component={SingleSelectFieldFF}
                options={dataElementGroupOptions || []}
                label={'Data element group'}
                placeholder={placeholderText}
                disabled={loading || error || !dataElementGroupOptions}
                filterable
            />
        </div>
    )
}
