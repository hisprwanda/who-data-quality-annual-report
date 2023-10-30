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

// returns a JSON formatted object from the table-like format from analytics
export const getJsonObjectsFormatFromTableFormat = ({
    headers,
    rows,
    metaData,
    mappedConfiguration,
    calculatingFor,
}) => {
    const restructuredData = {}
    const ouHeaderIndex = headers.map((header) => header.name).indexOf('ou')
    const dsNameIndex = headers.map((header) => header.name).indexOf('dx')

    for (const row of rows) {
        const rowData = getRowData({ headers, row })

        //
        rowData['orgUnitLevelsOrGroups'] =
            metaData.items[row[ouHeaderIndex]].name
        rowData['dataset_name'] =
            metaData.items[row[dsNameIndex]].name +
            (calculatingFor == 'completeness' ? '' : ' on time')
        const currentDataSetId = row[0].split('.')[0]
        if (calculatingFor == 'completeness') {
            rowData['threshold'] =
                mappedConfiguration.dataSets[currentDataSetId].threshold
        } else if (calculatingFor == 'timeliness') {
            rowData['threshold'] =
                mappedConfiguration.dataSets[
                    currentDataSetId
                ].timelinessThreshold
        } else if (calculatingFor === 'data') {
            rowData.consistency =
                mappedConfiguration.dataElementsAndIndicators[
                    currentDataSetId
                ].consistency
            rowData.trend =
                mappedConfiguration.dataElementsAndIndicators[
                    currentDataSetId
                ].trend
            rowData.comparison =
                mappedConfiguration.dataElementsAndIndicators[
                    currentDataSetId
                ].comparison
        }

        const dx = rowData.dx.split('.')[0]
        const pe = rowData.pe

        if (!restructuredData[dx]) {
            restructuredData[dx] = {}
        }

        if (!restructuredData[dx][pe]) {
            restructuredData[dx][pe] = []
        }

        restructuredData[dx][pe].push({
            ...rowData,
        })
    }
    return restructuredData
}

const MODIFIED_Z_OUTLIER = 3.5

// returns a JSON formatted object from the table-like format from analytics
export const getJsonObjectsFormatFromTableFormatSection2 = ({
    headers,
    rows,
    metaData,
    mappedConfiguration,
}) => {
    const restructuredData = {}
    const ouHeaderIndex = headers.map((header) => header.name).indexOf('ou')
    const dsNameIndex = headers.map((header) => header.name).indexOf('dx')

    for (const row of rows) {
        const rowData = getRowData({ headers, row })
        rowData['orgUnitLevelsOrGroups'] =
            metaData.items[row[ouHeaderIndex]].name

        const dx = rowData.dx
        const ou = rowData.ou

        if (!restructuredData[dx]) {
            restructuredData[dx] = {
                orgUnitLevelsOrGroups: {},
                extremeOutlier:
                    mappedConfiguration.dataElementsAndIndicators[dx]
                        .extremeOutlier,
                moderateOutlier:
                    mappedConfiguration.dataElementsAndIndicators[dx]
                        .moderateOutlier,
                modifiedZOutlier: MODIFIED_Z_OUTLIER,
                name: metaData.items[row[dsNameIndex]].name,
            }
        }

        if (!restructuredData[dx].orgUnitLevelsOrGroups[ou]) {
            restructuredData[dx].orgUnitLevelsOrGroups[ou] = {
                dataset_name: rowData.dataset_name,
                orgUnitLevelsOrGroupName: rowData.orgUnitLevelsOrGroups,
                ou: rowData.ou,
                periodValues: [],
            }
        }

        restructuredData[dx].orgUnitLevelsOrGroups[ou].periodValues.push(
            rowData.value
        )
    }

    return restructuredData
}
