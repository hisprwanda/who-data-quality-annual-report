import i18n from '@dhis2/d2-i18n'
import { getRoundedValue } from './mathService.js'

export const formatVal = (
    val,
    { noRounding, roundTo, includePercentage } = {
        noRounding: false,
        roundTo: 1,
        includePercentage: false,
    }
) => {
    if (val === undefined || val === null) {
        return i18n.t('Not available')
    }
    if (isNaN(val) || !isFinite(val)) {
        return i18n.t('Cannot be calculated')
    }
    if (noRounding) {
        return `${String(val)}${includePercentage ? '%' : ''}`
    }
    return `${String(getRoundedValue(val, roundTo))}${
        includePercentage ? '%' : ''
    }`
}

export const getVal = ({ response, dx, ou, pe }) => {
    const val = response?.[dx]?.[ou]?.[pe]
    if (typeof val !== 'object') {
        return val
    }
    return undefined
}

export const getValCO = ({ response, dx, ou, pe, co }) => {
    return response?.[dx]?.[ou]?.[pe]?.[co]
}

export const sortArrayAfterIndex1 = (unsortedArray) => {
    const unsortedItems = unsortedArray.slice(0, 1)
    const sortedItems = unsortedArray.slice(1)
    sortedItems.sort((a, b) => a.name.localeCompare(b.name))
    return [...unsortedItems, ...sortedItems]
}

const getRowData = ({ headers, row }) => {
    const rowData = {}
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i]
        const columnName = header.name
        const columnValue = row[i]
        // Add the key-value pair to the row data object
        rowData[columnName] = columnValue
    }
    return rowData
}

export const convertAnalyticsResponseToObject = ({ headers, rows }) => {
    const restructuredData = {}

    for (const row of rows) {
        const rowData = getRowData({ headers, row })
        const dx = rowData.dx
        const pe = rowData.pe
        const ou = rowData.ou
        const co = rowData.co

        if (!restructuredData[dx]) {
            restructuredData[dx] = {}
        }

        if (!restructuredData[dx][ou]) {
            restructuredData[dx][ou] = {}
        }

        if (!restructuredData[dx][ou][pe]) {
            if (co) {
                restructuredData[dx][ou][pe] = {}
            } else {
                restructuredData[dx][ou][pe] = undefined // must be undefined to prevent calculation errors with null
            }
        }

        if (!isNaN(Number(rowData.value))) {
            if (co) {
                restructuredData[dx][ou][pe][co] = Number(rowData.value)
            } else {
                restructuredData[dx][ou][pe] = Number(rowData.value)
            }
        }
    }
    return restructuredData
}
