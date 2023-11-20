import { TextArea, Field } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './InterpretationsField.module.css'

/**
 * A reusable field to add after each report section. Has some print styles
 * * If there's no text, it'll be hidden during print
 * * If there is text, the textarea itself will be hidden and a styled div 
 * will be shown because it looks better than the textarea
 * * It expects to be added to `grid` layouts, which are used for side-by-side
 * table and chart layouts in the report
 */
export const InterpretationsField = ({ className }) => {
    const [value, setValue] = useState()
    return (
        <Field
            label={'Interpretations'}
            className={cx(
                {
                    // If there is no text, don't show this field at all during print
                    [styles.hiddenInPrint]: value === '' || value === undefined,
                },
                styles.gridSpan2,
                className
            )}
        >
            <TextArea
                className={styles.hiddenInPrint}
                value={value}
                rows={3}
                onChange={({ value }) => setValue(value)}
            />

            <div className={styles.visibleInPrint}>{value}</div>
        </Field>
    )
}
InterpretationsField.propTypes = { className: PropTypes.string }
