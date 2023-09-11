// import mappedConfigurations from '../data/sample_configuration_map.json'
// import reportQueryResponse from '../data/sample_response_section_1.json'

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
                getFacilityReportingData(
                    reportQueryResponse.reporting_rate_over_all_org_units,
                    reportQueryResponse.reporting_rate_by_org_unit_level,
                    mappedConfigurations,
                    period,
                    'completeness'
                ), // list of objects for every dataset selected (regarding completeness)
            ],
            section1B: [
                getFacilityReportingData(
                    reportQueryResponse.reporting_rate_over_all_org_units,
                    reportQueryResponse.reporting_rate_by_org_unit_level,
                    mappedConfigurations,
                    period,
                    'timeliness'
                ), // list of objects for every dataset selected (regarding completeness)
            ],
        },
    }

    return reportSectionsData
}

const getFacilityReportingData = (
    reporting_rate_over_all_org_units,
    reporting_rate_by_org_unit_level,
    mappedConfigurations,
    period,
    calculatingFor
) => {
    // Extract key data from the analytics response
    const headers_overall = reporting_rate_over_all_org_units.headers
    const rows_overall = reporting_rate_over_all_org_units.rows
    const metaData_overall = reporting_rate_over_all_org_units.metaData

    const headers_level = reporting_rate_by_org_unit_level.headers
    const rows_level = reporting_rate_by_org_unit_level.rows
    const metaData_level = reporting_rate_by_org_unit_level.metaData

    const reporting_rate_over_all_org_units_formatted =
        getJsonObjectsFormatFromTableFormat(
            headers_overall,
            rows_overall,
            metaData_overall,
            mappedConfigurations,
            calculatingFor
        )
    const reporting_rate_by_org_unit_level_formatted =
        getJsonObjectsFormatFromTableFormat(
            headers_level,
            rows_level,
            metaData_level,
            mappedConfigurations,
            calculatingFor
        )

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

    // updating the object with regions list, divergent count & divergent percentage
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
        const divergentRegionsPercent =
            (divergentRegionsCount / totalRegionsCount) * 100

        // Add the new properties to the dataset
        dataset.forEach((entry) => {
            entry.threshold = entry.threshold + '%'
            entry.divergentRegionsCount = divergentRegionsCount
            entry.divergentRegionsPercent = divergentRegionsPercent + '%'
            entry.regions = regionsWithLowScore
        })
    }

    return filteredData_overall
}

const getJsonObjectsFormatFromTableFormat = (
    headers,
    rows,
    metaData,
    mappedConfigurations,
    calculatingFor
) => {
    // object to store the  data transformed from tabular form to a regural json objects
    const transformedData = {}
    for (const row of rows) {
        const rowData = {}

        // loop through the "headers" array and map values to keys
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i]
            const columnName = header.name
            const columnValue = row[i]

            // Add the key-value pair to the row data object
            rowData[columnName] = columnValue

            // in the lines below we relly on the metadata object returned from DHIS2 analytics in which we query the definisions of some uids or values
            // i.e: row[1] = lZsCb6y0KDX which is a uid of the ou, hence use .name to retrieve its name in the metadata object
            rowData['regions'] = metaData.items[row[1]].name
            rowData['dataset_name'] =
                metaData.items[row[0]].name +
                (calculatingFor == 'completeness' ? '' : ' on time')
            const currentDataSetId = row[0].split('.')[0]
            if (calculatingFor == 'completeness') {
                rowData['threshold'] =
                    mappedConfigurations.dataSets[currentDataSetId].threshold // get the dataset id from the row which is split from a value like this 'rGDF7yDdhnj.REPORTING_RATE'
            } else if (calculatingFor == 'timeliness') {
                rowData['threshold'] =
                    mappedConfigurations.dataSets[
                        currentDataSetId
                    ].timelinessThreshold // get the dataset id from the row which is split from a value like this 'rGDF7yDdhnj.REPORTING_RATE'
            }
        }

        // Use a unique identifier as the key in the transformed data object
        const uniqueIdentifier = row.join('_') // You can choose a better identifier if available
        transformedData[uniqueIdentifier] = rowData
    }

    // structuring the transformed that by datasets and periods
    const restructuredData = {}

    for (const key in transformedData) {
        const entry = transformedData[key]
        const dx = entry.dx.split('.')[0]
        const pe = entry.pe

        if (!restructuredData[dx]) {
            restructuredData[dx] = {}
        }

        if (!restructuredData[dx][pe]) {
            restructuredData[dx][pe] = []
        }

        restructuredData[dx][pe].push({
            dataset_name: entry.dataset_name,
            regions: entry.regions,
            ou: entry.ou,
            score: entry.value,
            threshold: entry.threshold,
        })
    }

    return restructuredData
}

function getRegionsWithLowScore(filterd_datasets, key) {
    const dataset = filterd_datasets[key]
    if (!dataset) {
        return [] // Return an empty array if the key is not found
    }

    const regionsWithLowScore = dataset
        .filter((entry) => parseFloat(entry.score) < entry.threshold)
        .map((entry) => entry.regions)

    return regionsWithLowScore
}
