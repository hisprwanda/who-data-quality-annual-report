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

const getRegionsWithLowScoreForConsistencyOfDataset = ({
    reporting_rate_by_org_unit_level_formatted,
    datasetID,
    overallDataset,
    regions,
    period,
}) => {
    // calculate the boundaries (range) with this overall score and threshold
    const leftBoundary =
        Math.round(
            overallDataset.score * (1 - overallDataset.threshold / 100) * 100
        ) / 100
    const rightBoundary =
        Math.round(
            overallDataset.score * (1 + overallDataset.threshold / 100) * 100
        ) / 100

    const years = Object.keys(
        reporting_rate_by_org_unit_level_formatted[datasetID]
    )
    const currentDataset = reporting_rate_by_org_unit_level_formatted[datasetID]

    /* PROCEDURES  :
        // as soon as u're here, u're deeling with one dataset in levels data, 
        // so get it with the datasetID passed
        // Find a way to get regions with their ids in an object like: 
            const regions = [
                {
                    "id": "mPpiH4dNz9C",
                    "name": "Region A"
                },
                {
                    "id": "iQx6Edf0Xib",
                    "name": "Region B"
                },
                {
                    "id": "yeGIr7J6nX7",
                    "name": "Region C"
                },
                {
                    "id": "tmIma8xiccz",
                    "name": "Region D"
                }
            ]

        // Also get a list of years: USE Object.keys(dataset)
        // Then do, for each region, loop through years objects and get the score for where the ou === to current region id and add it to a variable
        // to calculare the  get the score for overall and pass it to this function in this loop  for (const key in filteredData_overall) 
        // calculate the boundaries (range) with this overall score 
        // repeat everywher then when u get this u can' do the percentages as for other sections 

    */
    const regionsWithDivergentScore = []
    regions.forEach((region) => {
        let regionScore = null
        years.forEach((year) => {
            if (year !== period) {
                const score = parseFloat(
                    currentDataset[year].find((item) => item.ou === region.id)
                        .score
                )
                regionScore += score
            }
        })
        // perform calculations to decide whether a region is between the boundaries
        const chosenPeriodScore = parseFloat(
            currentDataset[period].find((item) => item.ou === region.id).score
        )

        // devide by number of the previous regions which is (years - 1)
        // TODO: remember to cater for devide by zero or decide whether the user is allowed to choose 0 comparison years
        const finalRegionScore =
            (chosenPeriodScore / (regionScore / (years.length - 1))) * 100
        if (
            finalRegionScore < leftBoundary ||
            finalRegionScore > rightBoundary
        ) {
            regionsWithDivergentScore.push(region.name)
        }
    })
    return regionsWithDivergentScore
}

const getRegionsWithLowScoreCompletenessOfIndicator = (
    dataValuesByLevel,
    expectedReportsByLevel,
    indicatorObjects
) => {
    if (!indicatorObjects) {
        return [] // Return an empty array if the key is not found
    }

    // TODO: variables naming in this function could be improved
    const regionsWithLowScore = []
    indicatorObjects.forEach((object) => {
        const correspondingDatasetID = object.correspondingDatasetID
        const ou = object.ou

        if (expectedReportsByLevel[correspondingDatasetID]) {
            const matchingDataset = expectedReportsByLevel[
                correspondingDatasetID
            ].find((dataset) => dataset.ou === ou)
            if (matchingDataset) {
                const score = matchingDataset.score
                const reportingPercentage = (object.actualValues / score) * 100

                if (reportingPercentage < object.threshold) {
                    regionsWithLowScore.push(object.orgUnitLevelsOrGroups)
                }
            } else {
                console.log(
                    `No matching dataset found for Region: ${object.orgUnitLevelsOrGroups}`
                )
            }
        } else {
            console.log(`No dataset found for ID: ${correspondingDatasetID}`)
        }
    })

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
        rowData['dataset_name'] = metaData.items[row[dsNameIndex]].name
        const currentDataSetId = row[dsNameIndex].split('.')[0]
        
        // adding thresholds where they are not
        if (calculatingFor == 'section1A') {
            rowData['threshold'] =
                mappedConfigurations.dataSets[currentDataSetId].threshold
        } else if (calculatingFor == 'section1B') {
            rowData['threshold'] =
                mappedConfigurations.dataSets[
                    currentDataSetId
                ].timelinessThreshold
        } else if (calculatingFor == 'section1D') {
            const comparison =
                mappedConfigurations.dataSets[currentDataSetId].comparison
            const trend = mappedConfigurations.dataSets[currentDataSetId].trend
            rowData['threshold'] =
                mappedConfigurations.dataSets[
                    currentDataSetId
                ].consistencyThreshold
            rowData['trend'] = trend

            if (comparison === 'th' && trend === 'constant') {
                rowData['comparison'] = 'Current vs average'
            } else if (comparison === 'th') {
                rowData['comparison'] = 'Current vs forecast'
            } else if (comparison == 'ou') {
                rowData['comparison'] = metaData.items[row[ouHeaderIndex]].name
            }
        }

        const dx = rowData.dx.split('.')[0]
        const pe = rowData.pe

        if (!restructuredData[dx]) {
            restructuredData[dx] = {}
        }

        if (!restructuredData[dx][pe]) {
            restructuredData[dx][pe] = []
        }
        if (
            calculatingFor == 'section1A' ||
            calculatingFor == 'section1B' ||
            calculatingFor == 'section1C'
        ) {
            restructuredData[dx][pe].push({
                dataset_name: rowData.dataset_name,
                orgUnitLevelsOrGroups: rowData.orgUnitLevelsOrGroups,
                ou: rowData.ou,
                score: rowData.value,
                threshold: rowData.threshold,
            })
        } else if (calculatingFor == 'section1D') {
            restructuredData[dx][pe].push({
                dataset_name: rowData.dataset_name,
                trend: rowData.trend,
                comparison: rowData.comparison,
                threshold: rowData.threshold,
                score: rowData.value,
                orgUnitLevelsOrGroups: rowData.orgUnitLevelsOrGroups,
                ou: rowData.ou,
            })
        }
    }
    return restructuredData
}

// Function to find the numerator
const findNumerator = (numerators, dataElementID) => {
    return (
        numerators[dataElementID] ||
        Object.values(numerators).find((item) => {
            const parts = item.dataElementOperandID.split('.')
            return parts.length > 1 && parts[0] === dataElementID
        })
    )
}

const filterDataByProvidedPeriod = (dataToFilter, period) => {
    const filteredData = {}
    for (const dx in dataToFilter) {
        if (dataToFilter[dx][period]) {
            filteredData[dx] = dataToFilter[dx][period]
        }
    }
    return filteredData
}

const filterDataByProvidedPeriodConsistency = (dataToFilter, period) => {
    // Restructure the JSON object
    const restructuredObject = {}

    for (const datasetId in dataToFilter) {
        const dataset = dataToFilter[datasetId]
        const years = Object.keys(dataset)

        // Initialize the total score for different periods
        let totalScore = 0

        // Loop through the years exclude the current one
        years.forEach((year) => {
            if (year !== period) {
                const score = parseFloat(dataset[year][0].score)
                totalScore += score
            }
        })

        // the function to calculate the score using the previous chosen years
        // TODO: remember to cater for devide by zero or decide whether the user is allowed to choose 0 comparison years
        const theScore =
            (dataset[period][0].score / (totalScore / (years.length - 1))) * 100

        // Create the currentYear object
        const currentYear = [
            {
                ...dataset[period][0],
                score: theScore.toFixed(1),
            },
        ]

        restructuredObject[datasetId] = currentYear
    }

    return restructuredObject
}

// returns a JSON formatted object from the table-like format from analytics
const getJsonObjectsFormatFromTableFormat_DataValues = ({
    headers,
    rows,
    metaData,
    mappedConfigurations,
    expected_overall,
    period,
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

        rowData['orgUnitLevelsOrGroups'] =
            metaData.items[row[ouHeaderIndex]].name
        rowData['indicator_name'] = metaData.items[row[dsNameIndex]].name
        const currentElementOrIndicatorUID = row[0].split('.')[0]
        const currentNumerator = findNumerator(
            mappedConfigurations.dataElementsAndIndicators,
            currentElementOrIndicatorUID
        )

        const dx = rowData.dx.split('.')[0]
        const pe = rowData.pe

        if (!restructuredData[dx]) {
            restructuredData[dx] = {}
        }

        if (!restructuredData[dx][pe]) {
            restructuredData[dx][pe] = []
        }
        // const expectedValues = getExpectedValues(currentNumerator.dataSetID, expected_overall, period )
        const expectedValues =
            expected_overall[currentNumerator.dataSetID][period][0].score

        //TODO: most values here are not needed while working on count_of_data_values_by_org_unit_level, will find a suitable condition to ignore them
        //construct the object for each
        restructuredData[dx][pe].push({
            threshold: currentNumerator.missing, // get this from missing value calculate these above in rows
            expectedValues: parseFloat(expectedValues),
            actualValues: parseInt(rowData.value),
            overallScore: parseFloat(
                ((rowData.value / expectedValues) * 100).toFixed(1)
            ),
            indicator_name: rowData.indicator_name,
            orgUnitLevelsOrGroups: rowData.orgUnitLevelsOrGroups,
            correspondingDatasetID: currentNumerator.dataSetID,
            ou: rowData.ou,
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

    const reporting_rate_over_all_org_units_formatted =
        getJsonObjectsFormatFromTableFormat({
            ...allOrgUnitsData,
            mappedConfigurations,
            calculatingFor,
        })

    const reporting_rate_by_org_unit_level_formatted =
        getJsonObjectsFormatFromTableFormat({
            ...byOrgUnitLevelData,
            mappedConfigurations,
            calculatingFor,
        })

    // filtering data (overall) by provided period
    const filteredData_overall = filterDataByProvidedPeriod(
        reporting_rate_over_all_org_units_formatted,
        period
    )

    // filtering data (levels) by provided period
    const filteredData_levels = filterDataByProvidedPeriod(
        reporting_rate_by_org_unit_level_formatted,
        period
    )

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
    const flattenedData = Object.values(filteredData_overall).map(item => item[0]);
    return flattenedData
}

// get the data for section 1C
const getCompletenessOfIndicatorData = ({
    expected_reports_over_all_org_units,
    expected_reports_by_org_unit_level,
    count_of_data_values_over_all_org_units,
    count_of_data_values_by_org_unit_level,
    mappedConfigurations,
    period,
}) => {
    
    // exptected reports overll org units
    const expected_reports_over_all_org_units_formatted =
        getJsonObjectsFormatFromTableFormat({
            ...expected_reports_over_all_org_units,
            mappedConfigurations: mappedConfigurations,
            calculatingFor: 'section1C',
        })

    // exptected reports by org unit level
    const expected_reports_by_org_unit_level_formatted =
        getJsonObjectsFormatFromTableFormat({
            ...expected_reports_by_org_unit_level,
            mappedConfigurations: mappedConfigurations,
            calculatingFor: 'section1C',
        })

    // data values
    const count_of_data_values_over_all_org_units_formatted =
        getJsonObjectsFormatFromTableFormat_DataValues({
            ...count_of_data_values_over_all_org_units,
            mappedConfigurations: mappedConfigurations,
            expected_overall: expected_reports_over_all_org_units_formatted,
            period: period,
        })

    // data values by org unit levels
    // TODO: for this the expected_reports_over_all_org_units_formatted is not neccessary improve this (will find a way to remove it without harming the code's working)
    const count_of_data_values_by_org_unit_level_formatted =
        getJsonObjectsFormatFromTableFormat_DataValues({
            ...count_of_data_values_by_org_unit_level,
            mappedConfigurations: mappedConfigurations,
            expected_overall: expected_reports_over_all_org_units_formatted,
            period: period,
        })

    // filtering data (levels) by provided period
    const filteredCountOfDataValues = filterDataByProvidedPeriod(
        count_of_data_values_over_all_org_units_formatted,
        period
    )

    const filteredExpectedReportsByOrgUnitLevel = filterDataByProvidedPeriod(
        expected_reports_by_org_unit_level_formatted,
        period
    )

    const filteredCountOfDataValuesByOrgUnitLevel = filterDataByProvidedPeriod(
        count_of_data_values_by_org_unit_level_formatted,
        period
    )

    for (const key in filteredCountOfDataValues) {
        const indicatorObjectsByLevels =
            filteredCountOfDataValuesByOrgUnitLevel[key]
        const currentOverAllIndicator = filteredCountOfDataValues[key]

        /*
            PROCEDURE:
            here data used are from 
                -count_of_data_values_by_org_unit_level
                -expected_reports_by_org_unit_level
            
            loop through the list of data element count_of_data_values_by_org_unit_level (format these data first if necessary)
            for each data element decide for a region in which it appears in
            
            %age is found by (count of a data elment for that region / expected report for that region ) *100
            
            ie: 

            [
                "YAAmrY2RPbZ",
                "iQx6Edf0Xib",
                "2022",
                "807.0"
            ],

            here above, we have 807 reports for yaamr data element (pnc visi) for region iQx6Edf0Xib (region b)

            to know what we expected, take that data elemtn id and search in configurations to find the dataset it corresponds to 
            YAAmrY2RPbZ corresponds to YmRjo8j3F3M (datasetID)
            the look into expected_reports_by_org_unit_level for this found dataset on the same perion iQx6Edf0Xib
        
            wer found: 
            [
                "YmRjo8j3F3M.EXPECTED_REPORTS",
                "iQx6Edf0Xib",
                "2022",
                "1224.0"
            ],

            from here we had 807 and we expected 1224
            so (807/1224)*100 = 66%
            this is below 90 so it gets added to the region with divergent scores
            */

        const regionsWithLowScore =
            getRegionsWithLowScoreCompletenessOfIndicator(
                filteredCountOfDataValuesByOrgUnitLevel,
                filteredExpectedReportsByOrgUnitLevel,
                indicatorObjectsByLevels
            ).sort()
        // console.log(`regions for ${key}: ${regionsWithLowScore}`)

        // Calculate "divergentRegionsCount" and "divergentRegionsPercent"
        const divergentRegionsCount = regionsWithLowScore.length
        const totalRegionsCount = indicatorObjectsByLevels.length

        // in case no region was under the threshold, the divergent % will remain zero
        let divergentRegionsPercent = 0
        if (totalRegionsCount > 0) {
            divergentRegionsPercent =
                (divergentRegionsCount / totalRegionsCount) * 100
        }

        // Add the new properties to the currentOverAllIndicator
        currentOverAllIndicator.forEach((entry) => {
            entry.divergentRegionsCount = divergentRegionsCount
            entry.divergentRegionsPercent = divergentRegionsPercent
            entry.orgUnitLevelsOrGroups = regionsWithLowScore
        })
    }

    const flattenedData = Object.values(filteredCountOfDataValues).map(item => item[0]);
    return flattenedData
}

// get the data for section 1D
const getConsistencyOfDatasetCompletenessData = ({
    allOrgUnitsData,
    byOrgUnitLevelData,
    mappedConfigurations,
    period,
    calculatingFor,
}) => {

    const reporting_rate_over_all_org_units_formatted =
        getJsonObjectsFormatFromTableFormat({
            ...allOrgUnitsData,
            mappedConfigurations: mappedConfigurations,
            calculatingFor: calculatingFor,
        })

    const reporting_rate_by_org_unit_level_formatted =
        getJsonObjectsFormatFromTableFormat({
            ...byOrgUnitLevelData,
            mappedConfigurations: mappedConfigurations,
            calculatingFor: calculatingFor,
        })

    // filtering data (overall) by provided period
    const filteredData_overall = filterDataByProvidedPeriodConsistency(
        reporting_rate_over_all_org_units_formatted,
        period
    )

    // get available regions to calculate for
    const regions = byOrgUnitLevelData.metaData.dimensions.ou.map((id) => ({
        id,
        name: byOrgUnitLevelData.metaData.items[id].name,
    }))

    // updating the object with orgUnitLevelsOrGroups list, divergent count & divergent percentage
    for (const datasetID in filteredData_overall) {
        const dataset = filteredData_overall[datasetID]
        const regionsWithLowScore =
            getRegionsWithLowScoreForConsistencyOfDataset({
                reporting_rate_by_org_unit_level_formatted:
                    reporting_rate_by_org_unit_level_formatted,
                datasetID: datasetID,
                overallDataset: dataset[0],
                regions: regions,
                period: period,
            })

        // Calculate "divergentRegionsCount" and "divergentRegionsPercent"
        const divergentRegionsCount = regionsWithLowScore.length
        const totalRegionsCount = regions.length

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

    const flattenedData = Object.values(filteredData_overall).map(item => item[0]);
    return flattenedData
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
            section1A: 
                getFacilityReportingData({
                    allOrgUnitsData:
                        reportQueryResponse.reporting_rate_over_all_org_units,
                    byOrgUnitLevelData:
                        reportQueryResponse.reporting_rate_by_org_unit_level,
                    mappedConfigurations: mappedConfigurations,
                    period: period,
                    calculatingFor: 'section1A',
                }), // list of objects for every dataset selected (regarding completeness)
            section1B:
                getFacilityReportingData({
                    allOrgUnitsData:
                        reportQueryResponse.reporting_rate_over_all_org_units,
                    byOrgUnitLevelData:
                        reportQueryResponse.reporting_rate_by_org_unit_level,
                    mappedConfigurations: mappedConfigurations,
                    period: period,
                    calculatingFor: 'section1B',
                }), // list of objects for every dataset selected (regarding completeness)
            section1C:
                getCompletenessOfIndicatorData({
                    expected_reports_over_all_org_units:
                        reportQueryResponse.expected_reports_over_all_org_units,
                    expected_reports_by_org_unit_level:
                        reportQueryResponse.expected_reports_by_org_unit_level,
                    count_of_data_values_over_all_org_units:
                        reportQueryResponse.count_of_data_values_over_all_org_units,
                    count_of_data_values_by_org_unit_level:
                        reportQueryResponse.count_of_data_values_by_org_unit_level,
                    reporting_timeliness_by_org_unit_level:
                        reportQueryResponse.reporting_timeliness_by_org_unit_level,
                    mappedConfigurations: mappedConfigurations,
                    period: period,
                }),
            section1D:
                getConsistencyOfDatasetCompletenessData({
                    allOrgUnitsData:
                        reportQueryResponse.reporting_rate_over_all_org_units,
                    byOrgUnitLevelData:
                        reportQueryResponse.reporting_rate_by_org_unit_level,
                    mappedConfigurations: mappedConfigurations,
                    period: period,
                    calculatingFor: 'section1D',
                }), // list of objects for Consistency of dataset completeness over time
        },
    }

    return reportSectionsData
}
