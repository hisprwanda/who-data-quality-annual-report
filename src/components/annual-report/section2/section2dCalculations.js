import {
    getForecastValue,
    getMean,
    getRoundedValue,
} from '../utils/mathService.js'
import { convertAnalyticsResponseToObject, getVal } from '../utils/utils.js'
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
    // periods are in reverse chronological order, hence flip of indices during mapping
    const comparisonPeriodPoints = comparisonPeriods
        .map((pe) => Number(getVal({ response, dx, pe, ou })))
        .map((val, index) => [comparisonPeriods.length - index - 1, val])
        .filter((point) => !isNaN(point[1]))

    let referenceValue = undefined
    if (trend === 'constant') {
        const comparisonPeriodValues = comparisonPeriodPoints.map(
            (point) => point[1]
        )
        referenceValue = getMean(comparisonPeriodValues)
    } else {
        // else forecast
        // negative forecast values are limited to zero
        referenceValue = Math.max(
            getForecastValue({
                pointsArray: comparisonPeriodPoints,
                forecastX: comparisonPeriods.length,
            }),
            0
        )
    }

    return {
        score: (currentPeriodValue / referenceValue) * 100,
        current: currentPeriodValue,
        reference: referenceValue,
    }
}

const get2dLineChartInfo = ({ response, periods, name, ou, dx }) => {
    const reversePeriods = [...periods]
    reversePeriods.reverse()

    return {
        type: 'line',
        xPointLabel: name,
        x: reversePeriods,
        y: reversePeriods.map((pe) => {
            const yVal = getVal({ response, dx, ou, pe })
            return yVal ? getRoundedValue(yVal, 2) : null
        }),
    }
}

const get2dScatterChartInfoBasic = ({
    trend,
    comparison,
    overallScore,
    overallOrgUnitName,
    consistency,
    comparisonPeriods,
    currentPeriodID,
}) => {
    const xAxisTitle =
        trend !== 'constant'
            ? 'Forecasted value'
            : `Average of ${comparisonPeriods.length} period${
                  comparisonPeriods.length > 1 ? 's' : ''
              }`
    const lineLabelNonOu = `Current = ${
        trend !== 'constant' ? 'Forecast' : 'Average'
    }`
    const lineLabel = comparison === 'ou' ? overallOrgUnitName : lineLabelNonOu
    return {
        type: 'scatter',
        slope: comparison === 'ou' ? overallScore / 100 : 1,
        threshold: consistency,
        xAxisTitle,
        yAxisTitle: currentPeriodID,
        lineLabel,
        values: [],
    }
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
        if (!overallResponse[dx]?.[overallOrgUnit]?.[currentPeriodID]) {
            // skip if current period data is missing
            continue
        }
        const consistency = dxInfo.consistency
        const trend = dxInfo.trend
        const comparison = dxInfo.comparison

        // calculate overall score
        const { score: overallScore } = get2dScore({
            ou: overallOrgUnit,
            dx,
            response: overallResponse,
            trend,
            currentPeriodID,
            comparisonPeriods,
        })

        const lineChartInfo = get2dLineChartInfo({
            response: overallResponse,
            periods: [currentPeriodID, ...comparisonPeriods],
            name: metadata?.[dx]?.name,
            ou: overallOrgUnit,
            dx,
        })
        // not that orgUnitLevel name is hardcoded; we will need to bring that
        const scatterChartInfo = get2dScatterChartInfoBasic({
            trend,
            comparison,
            overallScore,
            overallOrgUnitName: metadata?.[overallOrgUnit]?.name,
            consistency,
            comparisonPeriods,
            currentPeriodID,
        })

        // then get divergent subOrgUnits
        const divergentSubOrgUnits = []

        subOrgUnitIDs.forEach((subOrgUnit) => {
            const {
                score: subOrgUnitScore,
                current,
                reference,
            } = get2dScore({
                ou: subOrgUnit,
                dx,
                response: levelOrGroupResponse,
                trend,
                currentPeriodID,
                comparisonPeriods,
            })
            const orgUnitName = metadata?.[subOrgUnit]?.name
            const comparisonPoint = comparison === 'ou' ? overallScore : 100
            const isDivergent =
                subOrgUnitScore < comparisonPoint * (1 - consistency / 100) ||
                subOrgUnitScore > comparisonPoint * (1 + consistency / 100)
            // subOrgUnit is divergent if it is outside of range +/- consistency
            if (isDivergent) {
                divergentSubOrgUnits.push(orgUnitName)
            }
            scatterChartInfo.values.push({
                name: orgUnitName,
                x: getRoundedValue(reference, 2),
                y: getRoundedValue(current, 2),
                divergent: isDivergent,
                invalid: isNaN(subOrgUnitScore),
            })
        })

        results.section2d.push({
            name: metadata?.[dx]?.name,
            expectedTrend: trend === 'constant' ? 'Constant' : trend,
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
            chartInfo: {
                scatterChartInfo,
                lineChartInfo,
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

    section2d.section2d.sort((a, b) => a.name.localeCompare(b.name))
    return section2d
}
