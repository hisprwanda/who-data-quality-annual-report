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
        const dx = rowData.dx.split('.')[0]
        const pe = rowData.pe
        const ou = rowData.ou

        if (!restructuredData[dx]) {
            restructuredData[dx] = {}
        }

        if (!restructuredData[dx][ou]) {
            restructuredData[dx][ou] = {}
        }

        if (!restructuredData[dx][ou][pe] && !isNaN(Number(rowData.value))) {
            restructuredData[dx][ou][pe] = Number(rowData.value)
        }
    }
    return restructuredData
}
