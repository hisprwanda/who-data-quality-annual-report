import * as mappedConfigurations from './mappedConfigurations.json'
import {
    getForecastValue,
    getMean,
    getStats,
    getRoundedValue,
} from './mathService.js'
import { numeratorRelations } from './numeratorRelations.js'
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
            : getRoundedValue(
                  (counts[countsKey] / counts.totalValidValues) * 100,
                  1
              ),
    divergentScores: {
        number: divergentSubOrgUnits[countsKey].length,
        percentage:
            counts.orgUnitLevelsOrGroup === 0
                ? 0
                : getRoundedValue(
                      (divergentSubOrgUnits[countsKey].length /
                          counts.orgUnitLevelsOrGroup) *
                          100,
                      1
                  ),
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
    currentPeriod,
    comparisonPeriods,
}) => {
    const results = {
        section2d: [],
    }

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
            overallScore: getRoundedValue(overallScore, 1),
            divergentSubOrgUnits: {
                number: divergentSubOrgUnits.length,
                percent: getRoundedValue(
                    (divergentSubOrgUnits.length /
                        orgUnitsByLevelOrGroup.length) *
                        100,
                    1
                ),
                names: divergentSubOrgUnits.sort().join(', '),
            },
        })
    }
    return results
}

const RELATIONSHIP_NAMES = {
    eq: 'A ≈ B',
    do: 'Dropout rate',
    aGTb: 'A > B',
    level: 'Level across organisation units',
}

const get2eScore = ({ A, B, type }) => {
    if (type === 'do') {
        if (A === B) {
            return 0
        }
        return (A - B) / A
    }
    return A / B
}

const get2eVal = ({ response, dx, ou, pe }) => {
    if (ou) {
        return response[dx]?.[pe]?.find((el) => el.ou === ou)?.value
    }
    return response[dx]?.[pe]?.[0]?.value
}

const isDivergent2e = ({ type, score, overallScore, criteria }) => {
    if (type === 'do') {
        return score < 0
    }
    if (type === 'aGTb') {
        return score < 1 - criteria / 100
    }
    if (type === 'eq') {
        return score < 1 - criteria / 100 || score > 1 + criteria / 100
    }
    if (type === 'level') {
        return (
            score < (1 + criteria / 100) * overallScore ||
            score > (1 + criteria / 100) * overallScore
        )
    }
    return false
}

const calculateSection2e = ({
    overallResponse,
    levelOrGroupResponse,
    orgUnitsByLevelOrGroup,
    numeratorRelations,
    currentPeriod,
    metadata,
}) => {
    const results = {
        section2e: [],
    }
    for (const numeratorRelation of numeratorRelations) {
        const overallScore = get2eScore({
            A: get2eVal({
                response: overallResponse,
                dx: numeratorRelation.A,
                pe: currentPeriod,
            }),
            B: get2eVal({
                response: overallResponse,
                dx: numeratorRelation.B,
                pe: currentPeriod,
            }),
            type: numeratorRelation.type,
        })

        const divergentSubOrgUnits = []
        for (const subOrgUnit of orgUnitsByLevelOrGroup) {
            const subOrgUnitName = metadata[subOrgUnit]
            const subOrgUnitScore = get2eScore({
                A: get2eVal({
                    response: levelOrGroupResponse,
                    ou: subOrgUnit,
                    dx: numeratorRelation.A,
                    pe: currentPeriod,
                }),
                B: get2eVal({
                    response: levelOrGroupResponse,
                    ou: subOrgUnit,
                    dx: numeratorRelation.B,
                    pe: currentPeriod,
                }),
                type: numeratorRelation.type,
            })
            if (
                isDivergent2e({
                    score: subOrgUnitScore,
                    type: numeratorRelation.type,
                    criteria: numeratorRelation.criteria,
                    overallScore,
                })
            ) {
                divergentSubOrgUnits.push(subOrgUnitName)
            }
        }

        results.section2e.push({
            title: numeratorRelation.name,
            A: metadata[numeratorRelation.A]?.name,
            B: metadata[numeratorRelation.B]?.name,
            expectedRelationship: RELATIONSHIP_NAMES[numeratorRelation.type],
            qualityThreshold:
                numeratorRelation.type === 'do'
                    ? 'Not negative'
                    : numeratorRelation.criteria,
            overallScore: getRoundedValue(overallScore * 100, 1),
            divergentSubOrgUnits: {
                number: divergentSubOrgUnits.length,
                percentage: getRoundedValue(
                    (divergentSubOrgUnits.length /
                        orgUnitsByLevelOrGroup.length) *
                        100,
                    1
                ),
            },
        })
    }

    return results
}

const RESPONSE_NAME = 'data_detail_by_reporting_period'
const OVERALL_ORG_UNIT = 'data_over_all_org_units'
const LEVEL_OR_GROUP = 'data_by_org_unit_level'
const OVERALL_ORG_UNIT_SECTION_2E = 'numerator_relations_over_all_org_units'
const LEVEL_OR_GROUP_SECTION_2E = 'numerator_relations_org_unit_level'

export const calculateSection2 = ({ section2Response }) => {
    const formattedResponse2a2b2c = section2Response[RESPONSE_NAME].reduce(
        (mergedFormatted, indResponse) => {
            return {
                ...mergedFormatted,
                ...getJsonObjectsFormatFromTableFormatSection2({
                    ...indResponse,
                    mappedConfigurations,
                }),
            }
        },
        {}
    )

    // periods will come from response when finalized
    const periods = ['2022', '2021', '2020', '2019']
    // periods assumed to be in reverse order (current period first)
    const currentPeriod = periods[0]
    const comparisonPeriods = periods.slice(1)

    // Subsections 2a-2c
    const sections2a2b2c = calculateSections2a2b2c({
        formattedResponse: formattedResponse2a2b2c,
    })

    // Subsection 2d
    const formattedResponse2dOverall = getJsonObjectsFormatFromTableFormat({
        ...section2Response[OVERALL_ORG_UNIT],
        mappedConfigurations,
        calculatingFor: 'data',
        currentPeriod,
        comparisonPeriods,
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
        currentPeriod,
        comparisonPeriods,
    })

    // subsection 2e

    const formattedResponse2eOverall = getJsonObjectsFormatFromTableFormat({
        ...section2Response[OVERALL_ORG_UNIT_SECTION_2E],
        mappedConfigurations,
        calculatingFor: 'numerator_relation',
    })
    const formattedResponse2eLevelOrGroup = getJsonObjectsFormatFromTableFormat(
        {
            ...section2Response[LEVEL_OR_GROUP_SECTION_2E],
            mappedConfigurations,
            calculatingFor: 'numerator_relation',
        }
    )

    const section2e = calculateSection2e({
        overallResponse: {
            ...formattedResponse2eOverall,
            ...formattedResponse2dOverall,
        },
        levelOrGroupResponse: {
            ...formattedResponse2eLevelOrGroup,
            ...formattedResponse2dLevelOrGroup,
        },
        orgUnitsByLevelOrGroup,
        numeratorRelations,
        currentPeriod,
        metadata: section2Response[LEVEL_OR_GROUP_SECTION_2E].metaData.items,
    })

    // return formatted information for report
    return {
        ...sections2a2b2c,
        ...section2d,
        ...section2e,
    }
}
