// generate a new numerator code
export const generateNumeratorCode = (numerators) => {
    if (numerators.length == 0) {
        return 'C' + '1'
    }
    const lastCode = numerators[numerators.length - 1].code
    const lastNumber = parseInt(lastCode.slice(1))

    const newCodeNumber = lastNumber + 1
    const newCode = 'C' + newCodeNumber

    return newCode
}

// TODO: setup the global context to get the stored configurations
export const getConfigObjectsForAnalytics = (configurations, groupCode) => {
    // return an empty array if the groupcode is not provided
    if (!groupCode) {
        return {}
    }

    // Find the group with the given code
    const group = configurations.groups?.find((g) => g.code === groupCode)
    if (!group) {
        // Return an empty array if the group is not found
        return {}
    }

    // Get members of the group
    const members = group.members

    // Initialize a Set to store unique dataset IDs
    const uniqueDatasetIDs = new Set()

    // Filter numerators with dataID not null and in the group's members
    const numeratorsInGroup = configurations.numerators.filter((numerator) => {
        return (
            members.includes(numerator.code) &&
            numerator.dataID !== null &&
            numerator.dataSetID !== null
        )
    })

    // Map each numerator's datasetID, which may be an array
    numeratorsInGroup.forEach((numerator) => {
        if (Array.isArray(numerator.dataSetID)) {
            numerator.dataSetID.forEach((id) => {
                uniqueDatasetIDs.add(id)
            })
        } else {
            uniqueDatasetIDs.add(numerator.dataSetID)
        }
    })

    // Create an object to index datasets by their IDs
    const indexedNumerators = {}
    numeratorsInGroup.forEach((numerator) => {
        indexedNumerators[numerator.dataID] = numerator
    })

    // Convert the Set to an array to match dataset IDs
    const allDatasetIDs = [...uniqueDatasetIDs]

    // Filter datasets whose "id" matches the dataset IDs
    const datasets = configurations.dataSets.filter((dataset) => {
        return allDatasetIDs.includes(dataset.id)
    })

    // Create an object to index datasets by their IDs
    const indexedDatasets = {}

    datasets.forEach((dataset) => {
        indexedDatasets[dataset.id] = dataset
    })

    const configsObj = {
        dataElementsAndIndicators: indexedNumerators,
        dataSets: indexedDatasets,
    }
    return configsObj
}

// gets a list of retions in which the reporting rate score was lower than the threshold
const getRegionsWithLowScore = (filterd_datasets, key) => {
    const dataset = filterd_datasets[key]
    if (!dataset) {
        return [] // Return an empty array if the key is not found
    }

    const regionsWithLowScore = dataset
        .filter((entry) => parseFloat(entry.score) < entry.threshold)
        .map((entry) => entry.orgUnitLevelsOrGroups)

    return regionsWithLowScore
}

// returns a JSON formatted object from the table-like format from analytics
const getJsonObjectsFormatFromTableFormat = ({
    headers,
    rows,
    metaData,
    mappedConfigurations,
    calculatingFor,
}) => {
    const restructuredData = {}

    for (const row of rows) {
        const rowData = {}
        const ouHeaderIndex = headers.map((header) => header.name).indexOf('ou')
        const dsNameIndex = headers.map((header) => header.name).indexOf('dx')

        for (let i = 0; i < headers.length; i++) {
            const header = headers[i]
            const columnName = header.name
            const columnValue = row[i]
            // Add the key-value pair to the row data object
            rowData[columnName] = columnValue
        }

        //
        rowData['orgUnitLevelsOrGroups'] =
            metaData.items[row[ouHeaderIndex]].name
        rowData['dataset_name'] =
            metaData.items[row[dsNameIndex]].name +
            (calculatingFor == 'completeness' ? '' : ' on time')
        const currentDataSetId = row[0].split('.')[0]
        if (calculatingFor == 'completeness') {
            rowData['threshold'] =
                mappedConfigurations.dataSets[currentDataSetId].threshold
        } else if (calculatingFor == 'timeliness') {
            rowData['threshold'] =
                mappedConfigurations.dataSets[
                    currentDataSetId
                ].timelinessThreshold
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
            dataset_name: rowData.dataset_name,
            orgUnitLevelsOrGroups: rowData.orgUnitLevelsOrGroups,
            ou: rowData.ou,
            score: rowData.value,
            threshold: rowData.threshold,
        })
    }
    return restructuredData
}

const getFacilityReportingData = ({
    allOrgUnitsData,
    byOrgUnitLevelData,
    mappedConfigurations,
    period,
    calculatingFor,
}) => {
    // Extract key data from the analytics response
    const headers_overall = allOrgUnitsData.headers
    const rows_overall = allOrgUnitsData.rows
    const metaData_overall = allOrgUnitsData.metaData

    const headers_level = byOrgUnitLevelData.headers
    const rows_level = byOrgUnitLevelData.rows
    const metaData_level = byOrgUnitLevelData.metaData

    const reporting_rate_over_all_org_units_formatted =
        getJsonObjectsFormatFromTableFormat({
            headers: headers_overall,
            rows: rows_overall,
            metaData: metaData_overall,
            mappedConfigurations: mappedConfigurations,
            calculatingFor: calculatingFor,
        })
    const reporting_rate_by_org_unit_level_formatted =
        getJsonObjectsFormatFromTableFormat({
            headers: headers_level,
            rows: rows_level,
            metaData: metaData_level,
            mappedConfigurations: mappedConfigurations,
            calculatingFor: calculatingFor,
        })

    // filtering data (overall) by provided period
    const filteredData_overall = {}
    for (const dx in reporting_rate_over_all_org_units_formatted) {
        if (reporting_rate_over_all_org_units_formatted[dx][period]) {
            filteredData_overall[dx] =
                reporting_rate_over_all_org_units_formatted[dx][period]
        }
    }

    // filtering data (by orby provided period
    const filteredData_levels = {}
    for (const dx in reporting_rate_by_org_unit_level_formatted) {
        if (reporting_rate_by_org_unit_level_formatted[dx][period]) {
            filteredData_levels[dx] =
                reporting_rate_by_org_unit_level_formatted[dx][period]
        }
    }

    // updating the object with orgUnitLevelsOrGroups list, divergent count & divergent percentage
    for (const key in filteredData_overall) {
        const regionsWithLowScore = getRegionsWithLowScore(
            filteredData_levels,
            key
        )
        const dataset = filteredData_overall[key]
        const dataset_levels = filteredData_levels[key] // a corresponding dataset in the reporting rates by ou level

        // Calculate "divergentRegionsCount" and "divergentRegionsPercent"
        const divergentRegionsCount = regionsWithLowScore.length
        const totalRegionsCount = dataset_levels.length

        // in case no region was under the threshold, the divergent % will remain zero
        let divergentRegionsPercent = 0
        if (totalRegionsCount > 0) {
            divergentRegionsPercent =
                (divergentRegionsCount / totalRegionsCount) * 100
        }

        // Add the new properties to the dataset
        dataset.forEach((entry) => {
            entry.divergentRegionsCount = divergentRegionsCount
            entry.divergentRegionsPercent = divergentRegionsPercent
            entry.orgUnitLevelsOrGroups = regionsWithLowScore
        })
    }

    return filteredData_overall
}

// function to structure analytics responses into different report sections as json objects using mapped configurations and chosen period
export const getReportSectionsData = (
    reportQueryResponse,
    mappedConfigurations,
    period
) => {
    if (!reportQueryResponse || !mappedConfigurations) {
        return {}
    }

    const reportSectionsData = {
        section1: {
            section1A: [
                getFacilityReportingData({
                    allOrgUnitsData:
                        reportQueryResponse.reporting_rate_over_all_org_units,
                    byOrgUnitLevelData:
                        reportQueryResponse.reporting_rate_by_org_unit_level,
                    mappedConfigurations: mappedConfigurations,
                    period: period,
                    calculatingFor: 'completeness',
                }), // list of objects for every dataset selected (regarding completeness)
            ],
            section1B: [
                getFacilityReportingData({
                    allOrgUnitsData:
                        reportQueryResponse.reporting_rate_over_all_org_units,
                    byOrgUnitLevelData:
                        reportQueryResponse.reporting_rate_by_org_unit_level,
                    mappedConfigurations: mappedConfigurations,
                    period: period,
                    calculatingFor: 'timeliness',
                }), // list of objects for every dataset selected (regarding completeness)
            ],
        },
    }

    return reportSectionsData
}
