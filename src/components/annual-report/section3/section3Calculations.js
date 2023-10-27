import { getRoundedValue } from '../utils/mathService.js'
import { mapSectionFourResponse } from '../utils/utils.js'
import {
    OVERALL_RESPONSE_NAME,
    BY_LEVEL_RESPONSE_NAME,
    EXTERNAL_RELATIONS_INDICES_WITH_BY_LEVEL_DATA,
} from './useFetchSectionThreeData.js'

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

export const calculateSection3 = ({
    section3Response,
    mappedConfiguration,
    currentPeriod,
    overallOrgUnit,
}) => {
    const formattedResponseOverall = mapSectionFourResponse({
        ...section3Response[OVERALL_RESPONSE_NAME],
    })

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
                surveyValue: getRoundedValue(surveyValue, 1),
                routineValue: getRoundedValue(routineValue, 1),
                overallScore: getRoundedValue(
                    (routineValue / surveyValue) * 100,
                    1
                ),
                divergentSubOrgUnits: {},
            }

            // then calculate the divergence on subOrgUnits
            // this only calculable if a byLevel request was possible for the external relation
            if (!externalRelationsResponsesIndices.includes(originalIndex)) {
                return section3aItem
            }

            const correspondingIndex =
                externalRelationsResponsesIndices.indexOf(originalIndex)
            const individualResponse =
                section3Response[BY_LEVEL_RESPONSE_NAME][correspondingIndex]
            const levelMetadata = individualResponse.metaData.items
            const subOrgUnits = individualResponse.metaData.dimensions.ou
            const formattedIndividualResponse = mapSectionFourResponse({
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
                return section3aItem
            }

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

                if (isNaN(scoreSubOrgUnit)) {
                    invalidSubOrgUnits.push(subOrgUnit)
                }
                if (
                    scoreSubOrgUnit < 1 - relation.criteria / 100 ||
                    scoreSubOrgUnit > 1 + relation.criteria / 100
                ) {
                    divergentSubOrgUnits.push(subOrgUnit)
                }
            }

            return {
                ...section3aItem,
                divergentSubOrgUnits: {
                    number: divergentSubOrgUnits.length,
                    percentage: getRoundedValue(
                        (divergentSubOrgUnits.length /
                            Math.max(1, subOrgUnits.length)) *
                            100,
                        1
                    ),
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
