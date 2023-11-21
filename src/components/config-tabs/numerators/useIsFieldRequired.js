import i18n from '@dhis2/d2-i18n'
import { useCallback } from 'react'

const feedbackMessage = i18n.t('Please provide a value')

/**
 * A data mapping field is required if there isn't a previous mapping.
 * But if a new data item is selected, the rest of the data mapping form
 * becomes required
 *
 * Returns a validator function for use with react-final-form
 */
export const useDataMappingFieldValidator = () => {
    const validate = useCallback((value, allValues) => {
        const { prevDataID, dataItem } = allValues
        const isRequired = !prevDataID || Boolean(dataItem)

        if (!isRequired) {
            return // don't need to validate
        }

        if (Array.isArray(value)) {
            return value.length === 0 ? feedbackMessage : undefined
        }
        return value === undefined ? feedbackMessage : undefined
    }, [])

    return validate
}
