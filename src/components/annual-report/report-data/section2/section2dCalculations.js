import { convertAnalyticsResponseToObject, getVal } from '../utils/utils.js'
import { getForecastValue, getMean, getRoundedValue } from './mathService.js'
import {
    OVERALL_ORG_UNIT_SECTION_2D,
    LEVEL_OR_GROUP_SECTION_2D,
} from './useFetchSectionTwoData.js'

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

export const getSection2d = ({
    section2Response,
    mappedConfiguration,
    periods,
    overallOrgUnit,
}) => {
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

    return calculateSection2d({
        overallResponse: formattedResponse2dOverall,
        levelOrGroupResponse: formattedResponse2dLevelOrGroup,
        mappedConfiguration,
        metadata: metadata2d,
        overallOrgUnit,
        subOrgUnitIDs: subOrgUnitIDs2d,
        currentPeriodID: currentPeriodID,
        comparisonPeriods: comparisonPeriodsIDs,
    })
}