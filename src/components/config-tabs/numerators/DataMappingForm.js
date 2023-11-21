import {
    // rename this to not clash with Field from RFF
    Field as FieldContainer,
    RadioFieldFF,
    ReactFinalForm,
} from '@dhis2/ui'
import React from 'react'
import { DATA_ELEMENT, INDICATOR } from './constants.js'
import { DataSetSelect } from './DataElementDataSetSelect.js'
import { DataElementGroupSelect } from './DataElementGroupsSelect.js'
import { DataElementSelect } from './DataElementSelect.js'
import { DataElementTypeRadios } from './DataElementTypeRadios.js'
import { VariableSelect } from './DataElementVariableSelect.js'
import styles from './DataMappingForm.module.css'

const { Field } = ReactFinalForm

// todo: add this with the indicator item form
// eslint-disable-next-line no-unused-vars
const DataTypeRadios = () => {
    return (
        <div className={styles.formRow}>
            <FieldContainer label="Data type">
                <div className={styles.radiosContainer}>
                    <Field
                        name="dataType"
                        type="radio"
                        component={RadioFieldFF}
                        value={DATA_ELEMENT}
                        label={'Data element'}
                        initialValue={DATA_ELEMENT}
                    />
                    <Field
                        name="dataType"
                        type="radio"
                        component={RadioFieldFF}
                        value={INDICATOR}
                        label={'Indicator'}
                    />
                </div>
            </FieldContainer>
        </div>
    )
}

export const DataMappingFormSection = () => {
    // todo: use this to show either data element/indicator form
    // const dataTypeField = useField('dataType', {
    //     subscription: { value: true },
    //     // need to set the initial value here instead of on the <Field />
    //     // so the components below can render
    // })
    // const dataType = dataTypeField.input.value

    return (
        <div className={styles.mainContainer}>
            {/* currently hidden until Indicator form is implemented: */}
            {/* <DataTypeRadios /> */}

            <DataElementTypeRadios />
            <DataElementGroupSelect />
            <DataElementSelect />

            <DataSetSelect />

            <VariableSelect />
        </div>
    )
}
