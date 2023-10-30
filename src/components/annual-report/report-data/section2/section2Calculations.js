import { convertAnalyticsResponseToObject, getVal } from '../utils/utils.js'
import {
    getForecastValue,
    getMean,
    getStats,
    getRoundedValue,
} from './mathService.js'
import {
    SUBPERIODS_RESPONSE_NAME,
    OVERALL_ORG_UNIT_SECTION_2D,
    LEVEL_OR_GROUP_SECTION_2D,
    OVERALL_ORG_UNIT_SECTION_2E,
    LEVEL_OR_GROUP_SECTION_2E,
} from './useFetchSectionTwoData.js'

const MODIFIED_Z_OUTLIER = 3.5
const DEFAULT_EXTREME_OUTLIER = 3
const DEFAULT_MODERATE_OUTLIER = 2

// format response
const getRowInformation = ({
    dxID,
    counts,
    countsKey,
    thresholdValue,
    divergentSubOrgUnits,
    metadata,
}) => ({
    indicator: metadata[dxID]?.name,
    threshold: thresholdValue,
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
        const thresholdValues = {
            extremeOutlier: dxInfo?.extremeOutlier || DEFAULT_EXTREME_OUTLIER,
            moderateOutlier:
                dxInfo?.moderateOutlier || DEFAULT_MODERATE_OUTLIER,
            modifiedZOutlier: MODIFIED_Z_OUTLIER, // this is not definable by configuration
        }

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
                ...thresholdValues,
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
                dxID: dx,
                counts,
                thresholdValue: thresholdValues.extremeOutlier,
                countsKey: 'extremeOutliers',
                divergentSubOrgUnits,
                metadata,
            })
        )
        results.section2b.push(
            getRowInformation({
                dxID: dx,
                counts,
                formattedResponse,
                thresholdValue: thresholdValues.moderateOutlier,
                countsKey: 'moderateOutliers',
                divergentSubOrgUnits,
                metadata,
            })
        )
        results.section2c.push(
            getRowInformation({
                dxID: dx,
                counts,
                formattedResponse,
                thresholdValue: thresholdValues.modifiedZOutlier,
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
    dx,
    trend,
    response,
    currentPeriodID,
    comparisonPeriods,
}) => {
    const currentPeriodValue = Number(
        getVal({ response, dx, pe: currentPeriodID, ou })
    )

    // need to keep relative distance for forecast (hence get index, then filter out invalid values)
    const comparisonPeriodPoints = comparisonPeriods
        .map((pe) => Number(getVal({ response, dx, pe, ou })))
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
    mappedConfiguration,
    metadata,
    overallOrgUnit,
    subOrgUnitIDs,
    currentPeriodID,
    comparisonPeriods,
}) => {
    const results = {
        section2d: [],
    }

    for (const dx in overallResponse) {
        // retrieve info for dx
        const dxInfo = mappedConfiguration?.dataElementsAndIndicators?.[dx]
        if (!overallResponse[dx][overallOrgUnit][currentPeriodID]) {
            // skip if current period data is missing
            continue
        }
        const consistency = dxInfo.consistency
        const trend = dxInfo.trend
        const comparison = dxInfo.comparison

        // calculate overall score
        const overallScore = get2dScore({
            ou: overallOrgUnit,
            dx,
            response: overallResponse,
            trend,
            currentPeriodID,
            comparisonPeriods,
        })

        // then get divergent subOrgUnits
        const divergentSubOrgUnits = []

        subOrgUnitIDs.forEach((subOrgUnit) => {
            const subOrgUnitScore = get2dScore({
                ou: subOrgUnit,
                dx,
                response: levelOrGroupResponse,
                trend,
                currentPeriodID,
                comparisonPeriods,
            })
            const comparisonPoint = comparison === 'ou' ? overallScore : 100

            // subOrgUnit is divergent if it is outside of range +/- consistency
            if (
                subOrgUnitScore < comparisonPoint * (1 - consistency / 100) ||
                subOrgUnitScore > comparisonPoint * (1 + consistency / 100)
            ) {
                const orgUnitName = metadata?.[subOrgUnit]?.name
                divergentSubOrgUnits.push(orgUnitName)
            }
        })

        results.section2d.push({
            name: metadata?.[dx]?.name,
            expectedTrend: trend === 'constant' ? 'Constant' : 'TBD',
            compareRegionTo:
                comparison === 'ou'
                    ? metadata?.[overallOrgUnit]?.name
                    : 'Current vs Forecast',
            qualityThreshold: consistency,
            overallScore: getRoundedValue(overallScore, 1),
            divergentSubOrgUnits: {
                number: divergentSubOrgUnits.length,
                percent: getRoundedValue(
                    (divergentSubOrgUnits.length /
                        (subOrgUnitIDs.length ?? 1)) *
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
    mappedConfiguration,
    subOrgUnitIDs,
    overallOrgUnit,
    currentPeriod,
    metadata,
}) => {
    const results = {
        section2e: [],
    }
    const numeratorRelations = mappedConfiguration?.numeratorRelations ?? []
    for (const numeratorRelation of numeratorRelations) {
        const overallScore = get2eScore({
            A: getVal({
                response: overallResponse,
                dx: numeratorRelation.A,
                pe: currentPeriod,
                ou: overallOrgUnit,
            }),
            B: getVal({
                response: overallResponse,
                dx: numeratorRelation.B,
                pe: currentPeriod,
                ou: overallOrgUnit,
            }),
            type: numeratorRelation.type,
        })

        const divergentSubOrgUnits = []
        for (const subOrgUnit of subOrgUnitIDs) {
            const subOrgUnitName = metadata[subOrgUnit]
            const subOrgUnitScore = get2eScore({
                A: getVal({
                    response: levelOrGroupResponse,
                    ou: subOrgUnit,
                    dx: numeratorRelation.A,
                    pe: currentPeriod,
                }),
                B: getVal({
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
                        (subOrgUnitIDs.length || 1)) *
                        100,
                    1
                ),
            },
        })
    }

    return results
}

export const calculateSection2 = ({
    section2Response,
    mappedConfiguration,
    periods,
    overallOrgUnit,
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
    const subOrgUnitIDs2abc =
        section2Response[SUBPERIODS_RESPONSE_NAME]?.[0]?.metaData?.dimensions
            ?.ou ?? []

    // Subsections 2a-2c
    const sections2a2b2c = calculateSections2a2b2c({
        formattedResponse: formattedResponse2a2b2c,
        metadata: metadata2a2b2c,
        subOrgUnitIDs: subOrgUnitIDs2abc,
        mappedConfiguration,
    })

    const currentPeriodID = periods[0].id
    const comparisonPeriodsIDs = periods.slice(1).map((p) => p.id)

    const formattedResponse2dOverall = convertAnalyticsResponseToObject({
        ...section2Response[OVERALL_ORG_UNIT_SECTION_2D],
        mappedConfiguration,
    })
    const formattedResponse2dLevelOrGroup = convertAnalyticsResponseToObject({
        ...section2Response[LEVEL_OR_GROUP_SECTION_2D],
        mappedConfiguration,
    })

    const metadata2d = {
        ...section2Response[OVERALL_ORG_UNIT_SECTION_2D].metaData.items,
        ...section2Response[LEVEL_OR_GROUP_SECTION_2D].metaData.items,
    }

    const subOrgUnitIDs2d =
        section2Response[LEVEL_OR_GROUP_SECTION_2D].metaData.dimensions.ou

    const section2d = calculateSection2d({
        overallResponse: formattedResponse2dOverall,
        levelOrGroupResponse: formattedResponse2dLevelOrGroup,
        mappedConfiguration,
        metadata: metadata2d,
        overallOrgUnit,
        subOrgUnitIDs: subOrgUnitIDs2d,
        currentPeriodID: currentPeriodID,
        comparisonPeriods: comparisonPeriodsIDs,
    })

    // subsection 2e

    const formattedResponse2eOverall = convertAnalyticsResponseToObject({
        ...section2Response[OVERALL_ORG_UNIT_SECTION_2E],
        mappedConfiguration,
    })
    const formattedResponse2eLevelOrGroup = convertAnalyticsResponseToObject({
        ...section2Response[LEVEL_OR_GROUP_SECTION_2E],
        mappedConfiguration,
    })

    const metadata2e = {
        ...section2Response[OVERALL_ORG_UNIT_SECTION_2E].metaData.items,
        ...section2Response[LEVEL_OR_GROUP_SECTION_2E].metaData.items,
    }

    const subOrgUnitIDs2e =
        section2Response[LEVEL_OR_GROUP_SECTION_2E].metaData.dimensions.ou

    const section2e = calculateSection2e({
        overallResponse: {
            ...formattedResponse2eOverall,
        },
        levelOrGroupResponse: {
            ...formattedResponse2eLevelOrGroup,
        },
        mappedConfiguration,
        subOrgUnitIDs: subOrgUnitIDs2e,
        overallOrgUnit,
        currentPeriod: currentPeriodID,
        metadata: metadata2e,
    })

    // return formatted information for report
    return {
        ...sections2a2b2c,
        ...section2d,
        ...section2e,
    }
}
