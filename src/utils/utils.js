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

export const getReportSectionsData = (
    reportQueryResponse,
    mappedConfigurations
) => {
    if (!reportQueryResponse || !mappedConfigurations) {
        return {}
    }

    const reportSectionsData = {
        section1: {
            section1A: [
                getCompletenessOfFacilityReporting(
                    reportQueryResponse.reporting_rate_over_all_org_units,
                    reportQueryResponse.reporting_rate_by_org_unit_level
                ), // list of objects for every dataset selected (regarding completeness)
            ],
        },
        section2: {
            section2A: [
                getTimelinessOfFacilityReporting(
                    reportQueryResponse.reporting_timeliness_over_all_org_units,
                    reportQueryResponse.reporting_timeliness_by_org_unit_level
                ), // list of objects for every dataset selected (regarding timeliness)
            ],
        },
    }
}

const getCompletenessOfFacilityReporting = (
    reporting_rate_over_all_org_units,
    reporting_rate_by_org_unit_level
) => {
    // perform data manupulation
    const completenessOfFacilityReporting = {
        Section1: {
            SubsectionA: [
                {
                    name: 'HMIS - Reporting rate',
                    threshold: '90%',
                    score: '96.1%',
                    divergentRegionsCount: 1,
                    divergentRegionsPercent: '25%',
                    Name: 'Region A',
                },
            ],
        },
    }

    // Extract key data from the analytics response
    const headers = reporting_rate_over_all_org_units.headers
    const rows = reporting_rate_over_all_org_units.rows
    const metaData = reporting_rate_over_all_org_units.metaData

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
            rowData['region'] = metaData.items[row[1]].name
            rowData['dataset_name'] = metaData.items[row[0]].name
        }

        // Use a unique identifier as the key in the transformed data object
        const uniqueIdentifier = row.join('_') // You can choose a better identifier if available
        transformedData[uniqueIdentifier] = rowData
    }

    // The resulting transformed data object will have keys based on header names
    //   console.log('transformed reporting rates:', transformedData);

    const restructuredData = {}

    for (const key in transformedData) {
        const entry = transformedData[key]
        const dx = entry.dx
        const pe = entry.pe

        if (!restructuredData[dx]) {
            restructuredData[dx] = {}
        }

        if (!restructuredData[dx][pe]) {
            restructuredData[dx][pe] = []
        }

        restructuredData[dx][pe].push({
            dataset_name: entry.dataset_name,
            region: entry.region,
            ou: entry.ou,
            score: entry.value,
            threshold: '90%',
        })
    }

    console.log('restructured data:', restructuredData)
}

const getTimelinessOfFacilityReporting = (
    reporting_timeliness_over_all_org_units,
    reporting_timeliness_by_org_unit_level
) => {
    // perform data manupulation
    const completenessOfFacilityReporting = {
        Section1: {
            SubsectionA: [
                {
                    name: 'HMIS - Reporting rate',
                    threshold: '90%',
                    score: '96.1%',
                    divergentRegionsCount: 1,
                    divergentRegionsPercent: '25%',
                    Name: 'Region A',
                },
            ],
        },
    }
}