import i18n from '@dhis2/d2-i18n'
import {
    // rename this to not clash with Field from RFF
    Field as FieldContainer,
    RadioFieldFF,
    ReactFinalForm,
} from '@dhis2/ui'
import React from 'react'
import { DETAILS, TOTALS } from './constants.js'
import styles from './DataMappingForm.module.css'

const { Field } = ReactFinalForm

export const DataElementTypeRadios = () => {
    return (
        <div className={styles.formRow}>
            <FieldContainer label={i18n.t('Data element type')}>
                <div className={styles.radiosContainer}>
                    <Field
                        name="dataElementType"
                        type="radio"
                        component={RadioFieldFF}
                        value={TOTALS}
                        label={i18n.t('Totals')}
                    />
                    <Field
                        name="dataElementType"
                        type="radio"
                        component={RadioFieldFF}
                        value={DETAILS}
                        label={i18n.t('Details')}
                    />
                </div>
            </FieldContainer>
        </div>
    )
}
