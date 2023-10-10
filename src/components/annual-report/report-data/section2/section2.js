import * as mappedConfigurations from './mappedConfigurations.json'
import { getForecastValue, getMean, getStats } from './mathService.js'
import * as section2Response from './sample_response_section2.json'
import {
    getJsonObjectsFormatFromTableFormatSection2,
    getJsonObjectsFormatFromTableFormat,
} from './utils.js'

// format response

const getStatsForSubOrganisationUnitLevelOrGroup = (valuesArray) =>
    getStats(valuesArray)

const getRowInformation = ({
    dx,
    counts,
    formattedResponse,
    thresholdKey,
    countsKey,
    divergentSubOrgUnits,
}) => ({
    indicator: formattedResponse[dx].name,
    threshold: formattedResponse[dx][thresholdKey],
    overallScore:
        counts.totalValidValues === 0
            ? 0
            : (counts[countsKey] / counts.totalValidValues) * 100,
    divergentScores: {
        number: divergentSubOrgUnits[countsKey].length,
        percentage:
            counts.totalValidValues === 0
                ? 0
                : divergentSubOrgUnits[countsKey].length /
                  counts.totalValidValues,
        names: divergentSubOrgUnits[countsKey].sort().join(', '),
    },
})

const calculateSections2a2b2c = ({ formattedResponse }) => {
    const results = {
        section2a: [],
        section2b: [],
        section2c: [],
    }

    for (const dx in formattedResponse) {
        const counts = {
            totalValidValues: 0,
            extremeOutliers: 0,
            moderateOutliers: 0,
            modifiedZOutliers: 0,
            orgUnitLevelsOrGroup: Object.keys(
                formattedResponse[dx].orgUnitLevelsOrGroups
            ).length,
        }
        const divergentSubOrgUnits = {
            extremeOutliers: [],
            moderateOutliers: [],
            modifiedZOutliers: [],
        }
        for (const ou in formattedResponse[dx].orgUnitLevelsOrGroups) {
            const ouData = formattedResponse[dx].orgUnitLevelsOrGroups[ou]
            const validValues = ouData.periodValues.filter(
                (val) => !isNaN(Number(val))
            )

            const stats = getStatsForSubOrganisationUnitLevelOrGroup({
                valuesArray: validValues,
                extremeOutlier: formattedResponse[dx].extremeOutlier,
                moderateOutlier: formattedResponse[dx].moderateOutlier,
                modifiedZOutlier: formattedResponse[dx].modifiedZOutlier,
            })

            counts.totalValidValues += stats.count
            counts.extremeOutliers += stats.extremeOutliers
            counts.moderateOutliers += stats.moderateOutliers
            counts.modifiedZOutliers += stats.modifiedZOutliers

            if (stats.extremeOuliers > 0) {
                divergentSubOrgUnits.extremeOutliers.push(
                    ouData.orgUnitLevelsOrGroupName
                )
            }

            // must be at least 2 outliers for moderate/modifiedZ to be considered divergent
            if (stats.moderateOutliers > 1) {
                divergentSubOrgUnits.moderateOutliers.push(
                    ouData.orgUnitLevelsOrGroupName
                )
            }
            if (stats.modifiedZOutliers > 1) {
                divergentSubOrgUnits.modifiedZOutliers.push(
                    ouData.orgUnitLevelsOrGroupName
                )
            }
        }

        // now push results to row
        results.section2a.push(
            getRowInformation({
                dx,
                counts,
                formattedResponse,
                thresholdKey: 'extremeOutlier',
                countsKey: 'extremeOutliers',
                divergentSubOrgUnits,
            })
        )
        results.section2b.push(
            getRowInformation({
                dx,
                counts,
                formattedResponse,
                thresholdKey: 'moderateOutlier',
                countsKey: 'moderateOutliers',
                divergentSubOrgUnits,
            })
        )
        results.section2c.push(
            getRowInformation({
                dx,
                counts,
                formattedResponse,
                thresholdKey: 'modifiedZOutlier',
                countsKey: 'modifiedZOutliers',
                divergentSubOrgUnits,
            })
        )
    }
    return results
}

const get2dScore = ({
    ou,
    trend,
    dxResponse,
    currentPeriod,
    comparisonPeriods,
}) => {
    const currentPeriodValue = Number(
        dxResponse?.[currentPeriod]?.filter((e) => e.ou === ou)?.[0]?.value
    )

    // need to keep relative distance for forecast (hence points)
    const comparisonPeriodPoints = comparisonPeriods
        .map((pe) =>
            Number(dxResponse?.[pe]?.filter((e) => e.ou === ou)?.[0]?.value)
        )
        .map((val, index) => [index, val])
        .filter((point) => !isNaN(point[1]))

    if (trend === 'constant') {
        const comparisonPeriodValues = comparisonPeriodPoints.map(
            (point) => point[1]
        )
        return (currentPeriodValue / getMean(comparisonPeriodValues)) * 100
    }
    // else forecast
    return getForecastValue({
        pointsArray: comparisonPeriodPoints,
        forecastX: comparisonPeriods.length,
    })
}

const calculateSection2d = ({
    overallResponse,
    levelOrGroupResponse,
    orgUnitsByLevelOrGroup,
}) => {
    const results = {
        section2d: [],
    }
    // dummy variable for now (to come from selections)
    const periods = ['2019', '2020', '2021', '2022']
    const currentPeriod = periods.slice(-1)[0]
    const comparisonPeriods = periods.slice(0, -1)

    for (const dx in overallResponse) {
        // get overall score
        const currentPeriodData = overallResponse[dx]?.[currentPeriod][0]
        if (!currentPeriodData) {
            // break if current period data is missing
            return
        }
        const consistency = currentPeriodData.consistency
        const trend = currentPeriodData.trend
        const comparison = currentPeriodData.comparison
        const ou = currentPeriodData.ou

        // calculate overall score
        const overallScore = get2dScore({
            ou,
            trend,
            dxResponse: overallResponse[dx],
            currentPeriod,
            comparisonPeriods,
        })

        // then get divergent subOrgUnits
        const divergentSubOrgUnits = []
        orgUnitsByLevelOrGroup.forEach((subOrgUnit) => {
            const subOrgUnitScore = get2dScore({
                ou: subOrgUnit,
                trend,
                dxResponse: levelOrGroupResponse[dx],
                currentPeriod,
                comparisonPeriods,
            })
            const comparisonPoint = comparison === 'ou' ? overallScore : 100

            // subOrgUnit is divergent if it is outside of range +/- consistency
            if (
                subOrgUnitScore < comparisonPoint * (1 - consistency / 100) ||
                subOrgUnitScore > comparisonPoint * (1 + consistency / 100)
            ) {
                const orgUnitName = levelOrGroupResponse[dx][
                    currentPeriod
                ].find((e) => e.ou === subOrgUnit).orgUnitLevelsOrGroups
                divergentSubOrgUnits.push(orgUnitName)
            }
        })

        results.section2d.push({
            name: overallResponse[dx][currentPeriod][0].dataset_name,
            expectedTrend: trend === 'constant' ? 'Constant' : 'TBD',
            compareRegionTo:
                comparison === 'ou'
                    ? overallResponse[dx][currentPeriod][0]
                          .orgUnitLevelsOrGroups
                    : 'Current vs Forecast',
            qualityThreshold: consistency,
            overallScore,
            divergentRegions: {
                number: divergentSubOrgUnits.length,
                percent:
                    (divergentSubOrgUnits.length /
                        orgUnitsByLevelOrGroup.length) *
                    100,
                names: divergentSubOrgUnits.sort().join(', '),
            },
        })
    }
    return results
}

const RESPONSE_NAME = 'data_by_reporting_period'
const OVERALL_ORG_UNIT = 'data_over_all_org_units'
const LEVEL_OR_GROUP = 'data_by_org_unit_level'

export const calculateSection2 = () => {
    const formattedResponse2a2b2c = getJsonObjectsFormatFromTableFormatSection2(
        { ...section2Response[RESPONSE_NAME], mappedConfigurations }
    )

    // perform calculations

    // Subsections 2a-2c
    const sections2a2b2c = calculateSections2a2b2c({
        formattedResponse: formattedResponse2a2b2c,
    })

    // Subsection 2d
    const formattedResponse2dOverall = getJsonObjectsFormatFromTableFormat({
        ...section2Response[OVERALL_ORG_UNIT],
        mappedConfigurations,
        calculatingFor: 'data',
    })
    const formattedResponse2dLevelOrGroup = getJsonObjectsFormatFromTableFormat(
        {
            ...section2Response[LEVEL_OR_GROUP],
            mappedConfigurations,
            calculatingFor: 'data',
        }
    )
    const orgUnitsByLevelOrGroup =
        section2Response[LEVEL_OR_GROUP].metaData.dimensions.ou

    const section2d = calculateSection2d({
        overallResponse: formattedResponse2dOverall,
        levelOrGroupResponse: formattedResponse2dLevelOrGroup,
        orgUnitsByLevelOrGroup,
    })

    // subsection 2e (to do)

    // return formatted information for report
    return {
        ...sections2a2b2c,
        ...section2d,
    }
}
