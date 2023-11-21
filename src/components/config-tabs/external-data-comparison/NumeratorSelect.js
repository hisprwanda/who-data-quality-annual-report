import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelectFieldFF, ReactFinalForm } from '@dhis2/ui'
import React, { useMemo } from 'react'
import styles from './DataMappingForm.module.css'
import { useConfigurations, useDataItemNames } from '../../../utils'

const { Field } = ReactFinalForm



export const NumeratorSelect = ({name, label, placeholder}) => {
    const configurations = useConfigurations()

        // filter numerators that have data IDs & sort alphabetically
        const numeratorOptions = React.useMemo(() => {
            const numeratorsWithDataIds = configurations.numerators
                .filter((numerator) => numerator.dataID != null)
                .sort((a, b) => a.name.localeCompare(b.name))
            return numeratorsWithDataIds.map(({ name, code }) => ({
                label: name,
                value: code,
            }))
        }, [configurations.numerators])
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
                name='numerator'
                component={SingleSelectFieldFF}
                options={numeratorOptions || []}
                label={'Numerators'} 
                placeholder='Select a numerator'
                filterable
            />
        </div>
    )
}
