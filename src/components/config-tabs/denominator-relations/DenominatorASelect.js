import { SingleSelectFieldFF, ReactFinalForm, hasValue } from '@dhis2/ui'
import React from 'react'
import { filterDenominatorsByType } from '../../../utils/denominatorsMetadataData.js'
import { useConfigurations } from '../../../utils/index.js'

const { Field, useField } = ReactFinalForm

const DenominatorASelect = () => {
    const configurations = useConfigurations()
    const denominators = configurations.denominators
    // Depends on relation type
    const relationTypeField = useField('type', {
        subscription: { value: true },
    })

    const relationType = relationTypeField.input.value

    const denominatorOptions = React.useMemo(() => {
        return filterDenominatorsByType(denominators, relationType).map(
            ({ name, code }) => ({
                label: name,
                value: code,
            })
        )
    }, [denominators, relationType])

    return (
        <Field
            name="A"
            component={SingleSelectFieldFF}
            options={denominatorOptions}
            validate={hasValue}
            disabled={!relationType}
            placeholder={'Select denominator A'}
        />
    )
}

export default DenominatorASelect
