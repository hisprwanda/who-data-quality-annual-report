import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelectFieldFF, ReactFinalForm } from '@dhis2/ui'
import React, { useMemo } from 'react'
import styles from './DataMappingForm.module.css'
import { useConfigurations, useDataItemNames } from '../../../utils'

const { Field } = ReactFinalForm



export const DenominatorSelect = () => {
    const configurations = useConfigurations()

        // filter denominators that have data IDs & sort alphabetically

        const denominatorOptions = React.useMemo(() => {
            const denominatorsWithDataIds = configurations.denominators
                .filter((denominator) => denominator.dataID != null)
                .sort((a, b) => a.name.localeCompare(b.name))
            return denominatorsWithDataIds.map(({ name, code }) => ({
                label: name,
                value: code,
            }))
        }, [configurations.denominators])
    

    return (
        <div className={styles.formRow}>
            <Field
                name={"denominator"} 
                label={'Denominators'} 
                placeholder="Select a denominator"
                component={SingleSelectFieldFF}
                options={denominatorOptions || []}
                filterable
            />
        </div>
    )
}
