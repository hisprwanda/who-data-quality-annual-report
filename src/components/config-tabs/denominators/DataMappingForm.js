import {
    // rename this to not clash with Field from RFF
    Field as FieldContainer,
    RadioFieldFF,
    ReactFinalForm,
} from '@dhis2/ui'
import React from 'react'
import { DATA_ELEMENT, INDICATOR } from './constants.js'
import styles from './DataMappingForm.module.css'
import { DataElementTypeRadios } from '../numerators/DataElementTypeRadios.js'
import { DataElementGroupSelect } from '../numerators/DataElementGroupsSelect.js'
import { DataElementSelect } from '../numerators/DataElementSelect.js'

const { Field } = ReactFinalForm

export const DataMappingFormSection = () => {
    return (
        <div className={styles.mainContainer}>
            {/* currently hidden until Indicator form is implemented: */}
            {/* <DataTypeRadios /> */}

            <DataElementTypeRadios/>
            <DataElementGroupSelect/>
            <DataElementSelect />

        </div>
    )
}
