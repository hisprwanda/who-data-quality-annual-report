import { SingleSelectFieldFF, ReactFinalForm } from '@dhis2/ui'
import React from 'react'
import { useConfigurations } from '../../../utils/index.js'
import styles from './DataMappingForm.module.css'

const { Field } = ReactFinalForm

export const DenominatorSelect = () => {
    const configurations = useConfigurations()

    // filter denominators that have data IDs & sort alphabetically

    const denominatorOptions = React.useMemo(() => {
        const denominatorsWithDataIds = [...configurations.denominators].sort(
            (a, b) => a.name?.localeCompare(b.name)
        )
        return denominatorsWithDataIds.map(({ name, code }) => ({
            label: name ?? code,
            value: code,
        }))
    }, [configurations.denominators])

    return (
        <div className={styles.formRow}>
            <Field
                name={'denominator'}
                label={'Denominators'}
                placeholder="Select a denominator"
                component={SingleSelectFieldFF}
                options={denominatorOptions || []}
                filterable
            />
        </div>
    )
}
