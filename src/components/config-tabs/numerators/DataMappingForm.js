import {
    // rename this to not clash with Field from RFF
    Field as FieldContainer,
    RadioFieldFF,
    ReactFinalForm,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { DATA_ELEMENT, INDICATOR } from './constants.js'
import { DataSetSelect } from './DataElementDataSetSelect.js'
import { DataElementGroupSelect } from './DataElementGroupsSelect.js'
import { DataElementSelect } from './DataElementSelect.js'
import { DataElementTypeRadios } from './DataElementTypeRadios.js'
import { VariableSelect } from './DataElementVariableSelect.js'
import styles from './DataMappingForm.module.css'

const { Field, useField } = ReactFinalForm

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

export const DataMappingFormSection = ({ required }) => {
    const dataTypeField = useField('dataType', {
        subscription: { value: true },
        // need to set the initial value here instead of on the <Field />
        // so the components below can render
        initialValue: DATA_ELEMENT,
    })
    const dataType = dataTypeField.input.value

    console.log('todo', { required })

    return (
        <div className={styles.mainContainer}>
            <DataTypeRadios />

            {dataType === DATA_ELEMENT && (
                <>
                    <DataElementTypeRadios />
                    <DataElementGroupSelect />
                    <DataElementSelect />
                </>
            )}
            {dataType === INDICATOR && <p>Indicator form</p>}

            <DataSetSelect />

            <VariableSelect />
        </div>
    )
}
DataMappingFormSection.propTypes = { required: PropTypes.bool }
