import { getRoundedValue } from '../utils/mathService.js'
import { mapSectionFourResponse } from '../utils/utils.js'

const OVERALL_RESPONSE_NAME = 'data_over_all_org_units'
const BY_LEVEL_RESPONSE_NAME = 'data_detail_by_level'
const DENOMINATOR_RELATIONS_MAP = 'denominatorRelationsMap'

const getVal = ({ response, dx, ou, pe }) => {
    return response?.[dx]?.[ou]?.[pe]
}

const calculateSection4a = ({
    formattedResponseOverall,
    denominatorRelations,
    currentPeriod,
    overallOrgUnit,
}) => {
    const section4a = []
    for (const rel of denominatorRelations) {
        if (rel.type !== 'un') {
            break
        }
        section4a.push({
            name: rel.name,
            value: getRoundedValue(
                getVal({
                    response: formattedResponseOverall,
                    dx: rel.A.id,
                    ou: overallOrgUnit,
                    pe: currentPeriod,
                }) /
                    getVal({
                        response: formattedResponseOverall,
                        dx: rel.B.id,
                        ou: overallOrgUnit,
                        pe: currentPeriod,
                    }),
                2
            ),
        })
    }
    return section4a
}

const get4BScore = ({ response, aID, bID, ou, pe }) => {
    const aVal = getVal({ response, dx: aID, ou, pe })
    const bVal = getVal({ response, dx: bID, ou, pe })
    return aVal / bVal
}

const calculateSection4b = ({
    unformattedIndResponse,
    formattedResponseOverall,
    relation,
    currentPeriod,
    overallOrgUnit,
}) => {
    const metadata = unformattedIndResponse.metaData.items
    const overallScore = get4BScore({
        response: formattedResponseOverall,
        aID: relation.A.id,
        bID: relation.B.id,
        ou: overallOrgUnit,
        pe: currentPeriod,
    })
    const fourBItem = {
        overallScore,
        name: relation.name,
        A: metadata[relation.A.id]?.name,
        B: metadata[relation.B.id]?.name,
        qualityThreshold: relation.criteria,
    }
    // return early if overallScore is invalid
    if (isNaN(overallScore)) {
        return fourBItem
    }

    // elsewise, loop through subOrgUnits to find divergent subOrgUnits
    const formattedIndResponse = mapSectionFourResponse({
        ...unformattedIndResponse,
    })
    const subOrgUnits = unformattedIndResponse?.metaData?.dimensions?.ou || []

    const divergentSubOrgUnits = []

    for (const subOrgUnitID of subOrgUnits) {
        const subOrgUnitScore = get4BScore({
            response: formattedIndResponse,
            aID: relation.A.id,
            bID: relation.B.id,
            ou: subOrgUnitID,
            pe: currentPeriod,
        })

        if (
            subOrgUnitScore > 1 + relation.criteria / 100 ||
            subOrgUnitScore < 1 - relation.criteria / 100
        ) {
            divergentSubOrgUnits.push(subOrgUnitID)
        }
    }

    return {
        ...fourBItem,
        overallScore: getRoundedValue(overallScore * 100, 1),
        divergentSubOrgUnits: {
            names: divergentSubOrgUnits
                .map((ou) => metadata[ou]?.name)
                .sort()
                .join(', '),
            percentage: getRoundedValue(
                (divergentSubOrgUnits.length /
                    Math.max(subOrgUnits.length, 1)) *
                    100,
                1
            ),
            number: divergentSubOrgUnits.length,
        },
    }
}

export const calculateSection4 = ({
    section4Response,
    mappedConfiguration,
    currentPeriod,
    overallOrgUnit,
}) => {
    const formattedResponseOverall = mapSectionFourResponse({
        ...section4Response[OVERALL_RESPONSE_NAME],
    })

    const section4a = calculateSection4a({
        formattedResponseOverall,
        denominatorRelations: mappedConfiguration.denominatorRelations ?? [],
        currentPeriod,
        overallOrgUnit,
    })

    // section 4b must be calculated for each response/denominator relation
    const section4b = section4Response[BY_LEVEL_RESPONSE_NAME].map(
        (unformattedIndResponse, index) => {
            // the denominator relation must be pulled from the corresponding list (to correspond to response)
            const relation = section4Response[DENOMINATOR_RELATIONS_MAP][index]
            return calculateSection4b({
                unformattedIndResponse,
                formattedResponseOverall,
                relation,
                currentPeriod,
                overallOrgUnit,
            })
        }
    )

    return {
        section4a,
        section4b,
    }
}