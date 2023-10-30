import {
    getForecastValue,
    getMean,
    getStats,
    getRoundedValue,
} from './mathService.js'
import { getJsonObjectsFormatFromTableFormat } from './utils.js'
import { convertAnalyticsResponseToObject } from '../utils/utils.js'

const MODIFIED_Z_OUTLIER = 3.5
const DEFAULT_EXTREME_OUTLIER = 3
const DEFAULT_MODERATE_OUTLIER = 2

// format response
const getRowInformation = ({
    dxInfo,
    dxID,
    counts,
    thresholdKey,
    countsKey,
    divergentSubOrgUnits,
    metadata,
}) => ({
    indicator: metadata[dxID]?.name,
    threshold: dxInfo?.[thresholdKey],
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
        names: divergentSubOrgUnits[countsKey]
            .map((ou) => metadata?.[ou]?.name)
            .sort()
            .join(', '),
    },
})

const calculateSections2a2b2c = ({
    formattedResponse,
    subOrgUnitIDs,
    metadata,
    mappedConfiguration,
}) => {
    const results = {
        section2a: [],
        section2b: [],
        section2c: [],
    }

    for (const dx in formattedResponse) {
        const dxInfo = mappedConfiguration.dataElementsAndIndicators?.[dx]
        const counts = {
            totalValidValues: 0,
            extremeOutliers: 0,
            moderateOutliers: 0,
            modifiedZOutliers: 0,
            orgUnitLevelsOrGroup: subOrgUnitIDs.length,
        }
        const divergentSubOrgUnits = {
            extremeOutliers: [],
            moderateOutliers: [],
            modifiedZOutliers: [],
        }
        for (const ou in formattedResponse[dx]) {
            const ouData = formattedResponse[dx][ou]
            const validValues = Object.values(ouData).filter(
                (val) => !isNaN(Number(val))
            )

            const stats = getStats({
                valuesArray: validValues,
                extremeOutlier:
                    dxInfo?.extremeOutlier || DEFAULT_EXTREME_OUTLIER,
                moderateOutlier:
                    dxInfo?.moderateOutlier || DEFAULT_MODERATE_OUTLIER,
                modifiedZOutlier: MODIFIED_Z_OUTLIER, // this is not definable by configuration
            })

            counts.totalValidValues += stats.count
            counts.extremeOutliers += stats.extremeOutliers
            counts.moderateOutliers += stats.moderateOutliers
            counts.modifiedZOutliers += stats.modifiedZOutliers

            if (stats.extremeOuliers > 0) {
                divergentSubOrgUnits.extremeOutliers.push(ou)
            }

            // must be at least 2 outliers for moderate/modifiedZ to be considered divergent
            if (stats.moderateOutliers > 1) {
                divergentSubOrgUnits.moderateOutliers.push(ou)
            }
            if (stats.modifiedZOutliers > 1) {
                divergentSubOrgUnits.modifiedZOutliers.push(ou)
            }
        }

        // now push results to row
        results.section2a.push(
            getRowInformation({
                dxInfo,
                dxID: dx,
                counts,
                thresholdKey: 'extremeOutlier',
                countsKey: 'extremeOutliers',
                divergentSubOrgUnits,
                metadata,
            })
        )
        results.section2b.push(
            getRowInformation({
                dxInfo,
                dxID: dx,
                counts,
                formattedResponse,
                thresholdKey: 'moderateOutlier',
                countsKey: 'moderateOutliers',
                divergentSubOrgUnits,
                metadata,
            })
        )
        results.section2c.push(
            getRowInformation({
                dxInfo,
                dxID: dx,
                counts,
                formattedResponse,
                thresholdKey: 'modifiedZOutlier',
                countsKey: 'modifiedZOutliers',
                divergentSubOrgUnits,
                metadata,
            })
        )
    }
    return results
}

const get2dScore = ({
    ou,
    trend,
    dxResponse,
    currentPeriodID,
    comparisonPeriods,
}) => {
    const currentPeriodValue = Number(
        dxResponse?.[currentPeriodID]?.filter((e) => e.ou === ou)?.[0]?.value
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
    currentPeriodID,
    comparisonPeriods,
}) => {
    const results = {
        section2d: [],
    }

    for (const dx in overallResponse) {
        // get overall score
        const currentPeriodData = overallResponse[dx]?.[currentPeriodID][0]
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
            currentPeriodID,
            comparisonPeriods,
        })

        // then get divergent subOrgUnits
        const divergentSubOrgUnits = []
        orgUnitsByLevelOrGroup.forEach((subOrgUnit) => {
            const subOrgUnitScore = get2dScore({
                ou: subOrgUnit,
                trend,
                dxResponse: levelOrGroupResponse[dx],
                currentPeriodID,
                comparisonPeriods,
            })
            const comparisonPoint = comparison === 'ou' ? overallScore : 100

            // subOrgUnit is divergent if it is outside of range +/- consistency
            if (
                subOrgUnitScore < comparisonPoint * (1 - consistency / 100) ||
                subOrgUnitScore > comparisonPoint * (1 + consistency / 100)
            ) {
                const orgUnitName = levelOrGroupResponse[dx][
                    currentPeriodID
                ].find((e) => e.ou === subOrgUnit).orgUnitLevelsOrGroups
                divergentSubOrgUnits.push(orgUnitName)
            }
        })

        results.section2d.push({
            name: overallResponse[dx][currentPeriodID][0].dataset_name,
            expectedTrend: trend === 'constant' ? 'Constant' : 'TBD',
            compareRegionTo:
                comparison === 'ou'
                    ? overallResponse[dx][currentPeriodID][0]
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

const SUBPERIODS_RESPONSE_NAME = 'data_detail_by_reporting_period'
const OVERALL_ORG_UNIT = 'data_over_all_org_units'
const LEVEL_OR_GROUP = 'data_by_org_unit_level'
const OVERALL_ORG_UNIT_SECTION_2E = 'numerator_relations_over_all_org_units'
const LEVEL_OR_GROUP_SECTION_2E = 'numerator_relations_org_unit_level'

export const calculateSection2 = ({
    section2Response,
    mappedConfiguration,
    periods,
}) => {
    const formattedResponse2a2b2c = section2Response[
        SUBPERIODS_RESPONSE_NAME
    ].reduce((mergedFormatted, indResponse) => {
        return {
            ...mergedFormatted,
            ...convertAnalyticsResponseToObject({
                ...indResponse,
                mappedConfiguration,
            }),
        }
    }, {})

    const metadata2a2b2c = section2Response[SUBPERIODS_RESPONSE_NAME].reduce(
        (mergedMetadata, indResponse) => {
            return {
                ...mergedMetadata,
                ...indResponse.metaData.items,
            }
        },
        {}
    )

    // since all requests are for same LEVEL, they should all have the same underlying OU dimension
    const subOrgUnitIDs =
        section2Response[SUBPERIODS_RESPONSE_NAME]?.[0]?.metaData?.dimensions
            ?.ou ?? []

    // Subsections 2a-2c
    const sections2a2b2c = calculateSections2a2b2c({
        formattedResponse: formattedResponse2a2b2c,
        metadata: metadata2a2b2c,
        subOrgUnitIDs,
        mappedConfiguration,
    })

    const currentPeriodID = periods[0].id
    const comparisonPeriodsIDs = periods.slice(1).map((p) => p.id)

    // Subsection 2d
    const formattedResponse2dOverall = getJsonObjectsFormatFromTableFormat({
        ...section2Response[OVERALL_ORG_UNIT],
        mappedConfiguration,
        calculatingFor: 'data',
        currentPeriod: currentPeriodID,
        comparisonPeriods: comparisonPeriodsIDs,
    })
    const formattedResponse2dLevelOrGroup = getJsonObjectsFormatFromTableFormat(
        {
            ...section2Response[LEVEL_OR_GROUP],
            mappedConfiguration,
            calculatingFor: 'data',
        }
    )

    const orgUnitsByLevelOrGroup =
        section2Response[LEVEL_OR_GROUP].metaData.dimensions.ou

    const section2d = calculateSection2d({
        overallResponse: formattedResponse2dOverall,
        levelOrGroupResponse: formattedResponse2dLevelOrGroup,
        orgUnitsByLevelOrGroup,
        currentPeriodID: currentPeriodID,
        comparisonPeriods: comparisonPeriodsIDs,
    })

    // subsection 2e

    const formattedResponse2eOverall = getJsonObjectsFormatFromTableFormat({
        ...section2Response[OVERALL_ORG_UNIT_SECTION_2E],
        mappedConfiguration,
        calculatingFor: 'numerator_relation',
    })
    const formattedResponse2eLevelOrGroup = getJsonObjectsFormatFromTableFormat(
        {
            ...section2Response[LEVEL_OR_GROUP_SECTION_2E],
            mappedConfiguration,
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
        numeratorRelations: mappedConfiguration.numeratorRelations,
        currentPeriod: currentPeriodID,
        metadata: section2Response[LEVEL_OR_GROUP_SECTION_2E].metaData.items,
    })

    // return formatted information for report
    return {
        ...sections2a2b2c,
        ...section2d,
        ...section2e,
    }
}
