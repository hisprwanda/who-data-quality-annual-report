import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelectFieldFF, ReactFinalForm } from '@dhis2/ui'
import React, { useMemo } from 'react'
import styles from './DataMappingForm.module.css'

const { Field } = ReactFinalForm

const ORG_UNITS_LEVELS_QUERY = {
    orgUnitLevels: {
        resource: 'organisationUnitLevels',
        params: {
            paging: false,
            fields: ['id', 'displayName', 'level'],
            order: 'level:asc',
        },
    },
}

export const OrgUnitLevelSelect = () => {
    const { loading, error, data } = useDataQuery(ORG_UNITS_LEVELS_QUERY)

    const dataElementGroupOptions = useMemo(
        () =>
            data
                ? data.orgUnitLevels.organisationUnitLevels.map(
                      ({ level, displayName }) => ({
                          label: displayName,
                          value: level.toString(),
                      })
                  )
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
        return 'Select an org unit level'
    }, [loading, error])

    return (
        <div className={styles.formRow}>
            <Field
                name="level"
                component={SingleSelectFieldFF}
                options={dataElementGroupOptions || []}
                label={'Org unit levels'}
                placeholder={placeholderText}
                disabled={loading || error || !dataElementGroupOptions}
                filterable
                parse={(value) => Number(value)}
                format={(value) => (!value ? null : String(value))}
            />
        </div>
    )
}
