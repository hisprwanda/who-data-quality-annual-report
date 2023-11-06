import { getRoundedValue } from '../utils/mathService.js'
import { convertAnalyticsResponseToObject, getVal } from '../utils/utils.js'
import {
    OVERALL_ORG_UNIT_SECTION_2E,
    LEVEL_OR_GROUP_SECTION_2E,
} from './useFetchSectionTwoData.js'

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

export const getSection2e = ({
    section2Response,
    mappedConfiguration,
    periods,
    overallOrgUnit,
}) => {
    // if there is no data for subsection, skip calculations and return empty array
    if (
        Object.keys(section2Response?.[OVERALL_ORG_UNIT_SECTION_2E] ?? {})
            .length === 0
    ) {
        return { section2e: [] }
    }
    const currentPeriodID = periods[0].id

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
    section2e.section2e.sort((a, b) => a.title.localeCompare(b.title))
    return section2e
}
