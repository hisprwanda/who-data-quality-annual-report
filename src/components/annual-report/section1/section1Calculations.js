import {
    getForecastValue,
    getMean,
    getRoundedValue,
} from '../utils/mathService.js'
import { convertAnalyticsResponseToObject, getVal } from '../utils/utils.js'

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
    periodsIDs,
}) => {
    // calculate the boundaries (range) with this overall score and threshold
    const { trend, comparisonFromConfig } = overallDataset

    const comparisonBase =
        comparisonFromConfig === 'ou' ? overallDataset.score : 1
    const leftBoundary = comparisonBase * (1 - overallDataset.threshold / 100)
    const rightBoundary = comparisonBase * (1 + overallDataset.threshold / 100)

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
        let reference = 0
        const comparisonPeriods = periodsIDs.filter((pe) => pe !== period)

        const points = comparisonPeriods
            .map((year, index) => {
                return [
                    comparisonPeriods.length - index - 1,
                    parseFloat(
                        currentDataset?.[year]?.find(
                            (item) => item.ou === region.id
                        )?.score
                    ),
                ]
            })
            .filter((point) => !isNaN(point[1]))

        if (trend === 'constant') {
            // reference is average for 'constant' trend
            const yearValues = points.map((point) => point[1])
            reference = getMean(yearValues)
        } else {
            // otherwise the reference is the forecast value
            reference = Math.max(
                getForecastValue({
                    pointsArray: points,
                    forecastX: comparisonPeriods.length,
                }),
                0
            )
        }

        const currentYearValue = parseFloat(
            currentDataset?.[period]?.find((item) => item.ou === region.id)
                ?.score
        )

        const finalRegionScore = (currentYearValue / reference) * 100
        if (
            finalRegionScore < leftBoundary ||
            finalRegionScore > rightBoundary
        ) {
            regionsWithDivergentScore.push(region.name)
        }
    })
    return regionsWithDivergentScore
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
            rowData.comparisonFromConfig = comparison

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
                comparisonFromConfig: rowData.comparisonFromConfig,
                threshold: rowData.threshold,
                score: rowData.value,
                orgUnitLevelsOrGroups: rowData.orgUnitLevelsOrGroups,
                ou: rowData.ou,
            })
        }
    }
    return restructuredData
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

const filterDataByProvidedPeriodConsistency = (
    dataToFilter,
    period,
    periodsIDs
) => {
    // Restructure the JSON object
    const restructuredObject = {}

    for (const datasetId in dataToFilter) {
        const dataset = dataToFilter[datasetId]
        const trend = dataset?.[period]?.[0]?.trend ?? 'constant'

        // Initialize the reference value for different periods
        let reference = 0

        // get points for each year (index and value, filtering out null values (including current year))
        const comparisonPeriods = periodsIDs.filter((pe) => pe !== period)
        const points = comparisonPeriods
            .map((year, index) => {
                return [
                    comparisonPeriods.length - index - 1,
                    parseFloat(dataset[year]?.[0]?.score),
                ]
            })
            .filter((point) => !isNaN(point[1]))

        if (trend === 'constant') {
            // reference is average for 'constant' trend
            const yearValues = points.map((point) => point[1])
            reference = getMean(yearValues)
        } else {
            // otherwise the reference is the forecast value
            reference = Math.max(
                getForecastValue({
                    pointsArray: points,
                    forecastX: comparisonPeriods.length,
                }),
                0
            )
        }

        const currentYearValue = dataset?.[period]?.[0]?.score

        // the function to calculate the score using the previous chosen years
        // TODO: remember to cater for devide by zero or decide whether the user is allowed to choose 0 comparison years
        const theScore = (currentYearValue / reference) * 100

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
        regionsWithLowScore.sort()
        const dataset = filteredData_overall[key]
        const dataset_levels = filteredData_levels[key] // a corresponding dataset in the reporting rates by ou level

        // Calculate "divergentRegionsCount" and "divergentRegionsPercent"
        const divergentRegionsCount = regionsWithLowScore?.length
        const totalRegionsCount = dataset_levels?.length

        // in case no region was under the threshold, the divergent % will remain zero
        let divergentRegionsPercent = 0
        if (totalRegionsCount > 0) {
            divergentRegionsPercent = getRoundedValue(
                (divergentRegionsCount / totalRegionsCount) * 100,
                1
            )
        }

        // Add the new properties to the dataset
        dataset.forEach((entry) => {
            entry.divergentRegionsCount = divergentRegionsCount
            entry.divergentRegionsPercent = divergentRegionsPercent
            entry.orgUnitLevelsOrGroups = regionsWithLowScore
        })
    }
    const flattenedData = Object.values(filteredData_overall).map(
        (item) => item[0]
    )
    flattenedData.sort((a, b) =>
        a?.dataset_name?.localeCompare(b?.dataset_name)
    )
    return flattenedData
}

// get the data for section 1D
const getConsistencyOfDatasetCompletenessData = ({
    allOrgUnitsData,
    byOrgUnitLevelData,
    mappedConfigurations,
    period,
    calculatingFor,
    periodsIDs,
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
        period,
        periodsIDs
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
                periodsIDs,
            })
        regionsWithLowScore.sort()

        // Calculate "divergentRegionsCount" and "divergentRegionsPercent"
        const divergentRegionsCount = regionsWithLowScore?.length
        const totalRegionsCount = regions?.length

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

    const flattenedData = Object.values(filteredData_overall).map(
        (item) => item[0]
    )
    flattenedData.sort((a, b) =>
        a?.dataset_name?.localeCompare(b?.dataset_name)
    )
    return flattenedData
}

// get chart info for section 1
const getSection1dChartInfo = ({ allOrgUnitsData, periodsIDs, ou }) => {
    // the periods are from most recent to oldest; we want to present data in the reverse
    const periods = [...periodsIDs]
    periods.reverse()

    const chartInfo = {
        x: periods,
        values: [],
    }

    const formattedData = convertAnalyticsResponseToObject({
        ...allOrgUnitsData,
    })

    for (const dx in formattedData) {
        const points = periods.map(
            (pe) => getVal({ response: formattedData, dx, ou, pe }) ?? null
        )

        // if all points are null: skip; otherwise, add
        if (points.some((val) => val !== null)) {
            chartInfo.values.push({
                name: allOrgUnitsData.metaData?.items?.[dx]?.name ?? '',
                points,
            })
        }
    }

    chartInfo.values.sort((a, b) => a.name.localeCompare(b.name))

    return chartInfo
}

const getExpectedValues = ({ numerator, response, pe, ou }) => {
    return numerator.dataSetID.reduce((totalExpected, dsUID) => {
        totalExpected += Number(
            getVal({ response, dx: dsUID + '.EXPECTED_REPORTS', ou, pe }) ?? 0
        )
        return totalExpected
    }, 0)
}

const getActualValue1C = ({ response, dx, pe, ou }) => {
    return getVal({ response, dx, ou, pe })
}

const calculateSection1C = ({
    expected_reports_over_all_org_units,
    expected_reports_by_org_unit_level,
    count_of_data_values_over_all_org_units,
    count_of_data_values_by_org_unit_level,
    mappedConfigurations,
    period,
    overallOrgUnit,
}) => {
    const section1C = []

    // summarize expected reports
    const overall_expected_reports = convertAnalyticsResponseToObject({
        ...expected_reports_over_all_org_units,
    })
    const overall_counts = convertAnalyticsResponseToObject({
        ...count_of_data_values_over_all_org_units,
    })
    const by_level_expected_reports = convertAnalyticsResponseToObject({
        ...expected_reports_by_org_unit_level,
    })
    const by_level_counts = convertAnalyticsResponseToObject({
        ...count_of_data_values_by_org_unit_level,
    })

    const metadata = [
        expected_reports_over_all_org_units,
        expected_reports_by_org_unit_level,
        count_of_data_values_over_all_org_units,
        count_of_data_values_by_org_unit_level,
    ].reduce((allItems, resp) => {
        return { ...allItems, ...resp.metaData.items }
    }, {})

    const subOrgUnits =
        expected_reports_by_org_unit_level.metaData?.dimensions?.ou ?? []

    for (const de in mappedConfigurations.dataElementsAndIndicators) {
        //  get overall values
        const numerator = mappedConfigurations.dataElementsAndIndicators[de]
        const threshold = numerator.missing
        const dataElementOperand = numerator.dataElementOperandID

        const actualValues = getActualValue1C({
            response: overall_counts,
            pe: period,
            ou: overallOrgUnit,
            dx: dataElementOperand,
        })
        const expectedValues = getExpectedValues({
            response: overall_expected_reports,
            pe: period,
            ou: overallOrgUnit,
            numerator,
        })
        const overallScore = getRoundedValue(
            (actualValues / expectedValues) * 100,
            1
        )

        // then calculate sub units
        const divergentSubOrgUnits = []
        for (const subOrgUnit of subOrgUnits) {
            const actualSubOrgUnit = getActualValue1C({
                response: by_level_counts,
                pe: period,
                ou: subOrgUnit,
                dx: dataElementOperand,
            })
            const expectedSubOrgUnit = getExpectedValues({
                response: by_level_expected_reports,
                pe: period,
                ou: subOrgUnit,
                numerator,
            })
            const scoreSubOrgUnit = actualSubOrgUnit / expectedSubOrgUnit

            if (scoreSubOrgUnit * 100 < threshold) {
                divergentSubOrgUnits.push(subOrgUnit)
            }
        }

        section1C.push({
            threshold,
            expectedValues,
            actualValues,
            overallScore,
            indicator_name: metadata[dataElementOperand]?.name,
            orgUnitLevelsOrGroups: divergentSubOrgUnits
                .map((ouID) => metadata[ouID]?.name)
                .sort(),
            divergentRegionsCount: divergentSubOrgUnits.length,
            divergentRegionsPercent: subOrgUnits.length
                ? getRoundedValue(
                      (divergentSubOrgUnits.length / subOrgUnits.length) * 100,
                      1
                  )
                : 0,
        })
    }

    section1C.sort((a, b) =>
        a?.indicator_name?.localeCompare(b?.indicator_name)
    )
    return section1C
}

// function to structure analytics responses into different report sections as json objects using mapped configurations and chosen period
export const calculateSection1 = ({
    reportQueryResponse,
    mappedConfigurations,
    period,
    periodsIDs,
    overallOrgUnit,
}) => {
    if (!reportQueryResponse || !mappedConfigurations) {
        return {}
    }

    return {
        section1A: getFacilityReportingData({
            allOrgUnitsData:
                reportQueryResponse.reporting_rate_over_all_org_units,
            byOrgUnitLevelData:
                reportQueryResponse.reporting_rate_by_org_unit_level,
            mappedConfigurations: mappedConfigurations,
            period: period,
            calculatingFor: 'section1A',
        }), // list of objects for every dataset selected (regarding completeness)
        section1B: getFacilityReportingData({
            allOrgUnitsData:
                reportQueryResponse.reporting_rate_over_all_org_units,
            byOrgUnitLevelData:
                reportQueryResponse.reporting_rate_by_org_unit_level,
            mappedConfigurations: mappedConfigurations,
            period: period,
            calculatingFor: 'section1B',
        }),
        section1C: calculateSection1C({
            expected_reports_over_all_org_units:
                reportQueryResponse.expected_reports_over_all_org_units,
            expected_reports_by_org_unit_level:
                reportQueryResponse.expected_reports_by_org_unit_level,
            count_of_data_values_over_all_org_units:
                reportQueryResponse.count_of_data_values_over_all_org_units,
            count_of_data_values_by_org_unit_level:
                reportQueryResponse.count_of_data_values_by_org_unit_level,
            mappedConfigurations,
            period: period,
            overallOrgUnit,
        }),
        section1D: getConsistencyOfDatasetCompletenessData({
            allOrgUnitsData:
                reportQueryResponse.reporting_rate_over_all_org_units,
            byOrgUnitLevelData:
                reportQueryResponse.reporting_rate_by_org_unit_level,
            mappedConfigurations: mappedConfigurations,
            period: period,
            calculatingFor: 'section1D',
            periodsIDs,
        }), // list of objects for Consistency of dataset completeness over time
        chartInfo: getSection1dChartInfo({
            allOrgUnitsData:
                reportQueryResponse.reporting_rate_over_all_org_units,
            periodsIDs,
            ou: overallOrgUnit,
        }),
    }
}
