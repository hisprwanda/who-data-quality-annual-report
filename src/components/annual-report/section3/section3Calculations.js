import {
    convertAnalyticsResponseToObject,
    sortArrayAfterIndex1,
} from '../utils/utils.js'

export const OVERALL_RESPONSE_NAME = 'data_over_all_org_units'
export const BY_LEVEL_RESPONSE_NAME = 'data_detail_by_level'
export const EXTERNAL_RELATIONS_INDICES_WITH_BY_LEVEL_DATA =
    'externalRelationsResponsesIndices'

const MULTIPLE_ORG_UNITS_CHART_TYPE = 'scatter'
const SINGLE_ORG_UNITS_CHART_TYPE = 'bullet'

const getVal = ({ response, dx, ou, pe }) => {
    return response?.[dx]?.[ou]?.[pe]
}

const getRoutineValue = ({ relation, response, ou, pe }) => {
    const numeratorValue = getVal({ response, dx: relation.numerator, ou, pe })
    const denominatorValue = getVal({
        response,
        dx: relation.denominator,
        ou,
        pe,
    })
    return (numeratorValue / denominatorValue) * 100 // the value must be a percentage as externalData is assumed to be percentage
}

const isDivergent3a = ({ score, criteria }) =>
    score < 1 - criteria / 100 || score > 1 + criteria / 100

export const calculateSection3 = ({
    section3Response,
    mappedConfiguration,
    currentPeriod,
    overallOrgUnit,
}) => {
    const formattedResponseOverall = convertAnalyticsResponseToObject({
        ...section3Response[OVERALL_RESPONSE_NAME],
    })
    const overallMetadata =
        section3Response[OVERALL_RESPONSE_NAME].metaData.items

    const currentPeriodID = currentPeriod.id

    const externalRelationsResponsesIndices =
        section3Response[EXTERNAL_RELATIONS_INDICES_WITH_BY_LEVEL_DATA]

    // section 3a must be calculated for each external relation
    const section3a = mappedConfiguration.externalRelations.map(
        (relation, originalIndex) => {
            // get overall information
            const surveyValue = getVal({
                response: formattedResponseOverall,
                dx: relation.externalData,
                ou: overallOrgUnit,
                pe: currentPeriodID,
            })
            const routineValue = getRoutineValue({
                relation,
                response: formattedResponseOverall,
                ou: overallOrgUnit,
                pe: currentPeriodID,
            })

            const section3aItem = {
                name: relation.name,
                level: relation.level,
                qualityThreshold: relation.criteria,
                surveyValue: surveyValue,
                routineValue: routineValue,
                overallScore: (routineValue / surveyValue) * 100,
                divergentSubOrgUnits: {},
                chartInfo: {
                    name: relation.name,
                    type: SINGLE_ORG_UNITS_CHART_TYPE, // default
                    values: [
                        {
                            name: overallMetadata[overallOrgUnit]?.name,
                            survey: surveyValue,
                            routine: routineValue,
                            divergent: isDivergent3a({
                                score: routineValue / surveyValue,
                                criteria: relation.criteria,
                            }),
                        },
                    ],
                },
            }

            // then calculate the divergence on subOrgUnits
            // this only calculable if a byLevel request was possible for the external relation
            if (!externalRelationsResponsesIndices.includes(originalIndex)) {
                return { ...section3aItem, levelNotAvailable: true }
            }

            const correspondingIndex =
                externalRelationsResponsesIndices.indexOf(originalIndex)
            const individualResponse =
                section3Response[BY_LEVEL_RESPONSE_NAME][correspondingIndex]
            const levelMetadata = individualResponse.metaData.items
            const subOrgUnits = individualResponse.metaData.dimensions.ou
            const formattedIndividualResponse =
                convertAnalyticsResponseToObject({
                    ...individualResponse,
                })

            // if one of the DEs is missing from the response data, the values are not calculable
            const requiredDEs = [
                relation.externalData,
                relation.denominator,
                relation.numerator,
            ]

            if (
                !requiredDEs.every((uid) =>
                    Object.keys(formattedIndividualResponse).includes(uid)
                )
            ) {
                return { ...section3aItem, invalid: true }
            }

            // if we have gotten here, we can theoretically calculate values and chart is multi-orgunit
            section3aItem.chartInfo.type = MULTIPLE_ORG_UNITS_CHART_TYPE

            const divergentSubOrgUnits = []
            const invalidSubOrgUnits = []
            for (const subOrgUnit of subOrgUnits) {
                const surveyValueSubOrgUnit = getVal({
                    response: formattedIndividualResponse,
                    dx: relation.externalData,
                    ou: subOrgUnit,
                    pe: currentPeriodID,
                })
                const routineValueSubOrgUnit = getRoutineValue({
                    relation,
                    response: formattedIndividualResponse,
                    ou: subOrgUnit,
                    pe: currentPeriodID,
                })
                const scoreSubOrgUnit =
                    surveyValueSubOrgUnit / routineValueSubOrgUnit

                const subOrgUnitIsDivergent = isDivergent3a({
                    score: scoreSubOrgUnit,
                    criteria: relation.criteria,
                })
                if (subOrgUnitIsDivergent) {
                    divergentSubOrgUnits.push(subOrgUnit)
                }

                const subOrgUnitChartInfo = {
                    name: levelMetadata[subOrgUnit]?.name,
                    survey: surveyValueSubOrgUnit,
                    routine: routineValueSubOrgUnit,
                    divergent: subOrgUnitIsDivergent,
                }

                if (isNaN(scoreSubOrgUnit)) {
                    invalidSubOrgUnits.push(subOrgUnit)
                    subOrgUnitChartInfo.invalid = true
                }

                section3aItem.chartInfo.values.push(subOrgUnitChartInfo)
            }

            section3aItem.chartInfo.values = sortArrayAfterIndex1(
                section3aItem.chartInfo.values
            )

            return {
                ...section3aItem,
                divergentSubOrgUnits: {
                    number: divergentSubOrgUnits.length,
                    percentage:
                        (divergentSubOrgUnits.length /
                            Math.max(1, subOrgUnits.length)) *
                        100,
                    names: divergentSubOrgUnits
                        .map((ouID) => levelMetadata[ouID]?.name)
                        .sort()
                        .join(', '),
                    noncalculable: invalidSubOrgUnits
                        .map((ouID) => levelMetadata[ouID]?.name)
                        .sort()
                        .join(', '),
                },
            }
        }
    )

    return {
        section3a,
    }
}
