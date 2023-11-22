import { SingleSelectFieldFF, ReactFinalForm } from '@dhis2/ui'
import React from 'react'
import { useConfigurations } from '../../../utils/index.js'
import styles from './DataMappingForm.module.css'

const { Field } = ReactFinalForm

export const NumeratorSelect = () => {
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

    return (
        <div className={styles.formRow}>
            <Field
                name="numerator"
                component={SingleSelectFieldFF}
                options={numeratorOptions || []}
                label={'Numerators'}
                placeholder="Select a numerator"
                filterable
            />
        </div>
    )
}
