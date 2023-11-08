import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useState } from 'react'

export const OVERALL_RESPONSE_NAME = 'data_over_all_org_units'
export const BY_LEVEL_RESPONSE_NAME = 'data_detail_by_level'
export const DENOMINATOR_RELATIONS_MAP = 'denominatorRelationsMap'

const section4ByLevel = {
    [BY_LEVEL_RESPONSE_NAME]: {
        resource: 'analytics.json',
        params: ({ dataElements, orgUnits, orgUnitLevel, periods }) => ({
            dimension: `dx:${dataElements.join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${periods.join(';')}`,
        }),
    },
}

const section4Overall = {
    [OVERALL_RESPONSE_NAME]: {
        resource: 'analytics.json',
        params: ({ dataElements, orgUnits, periods }) => ({
            dimension: `dx:${dataElements.join(';')},ou:${orgUnits.join(
                ';'
            )},pe:${periods.join(';')}`,
        }),
    },
}

export const fetchDataByLevel = async ({ engine, variables }) => {
    const dataBySubPeriod = await engine.query(section4ByLevel, {
        variables,
    })
    return dataBySubPeriod
}

export const useFetchSectionFourData = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    const engine = useDataEngine()

    const refetch = useCallback(
        async ({ variables = {} }) => {
            const denominatorRelations =
                variables?.mappedConfiguration?.denominatorRelations
            const denominatorRelationDEs = denominatorRelations
                ? [
                      ...denominatorRelations.map((rel) => rel.A.id),
                      ...denominatorRelations.map((rel) => rel.B.id),
                  ]
                : []

            // set to loading
            setLoading(true)
            // get data sets and check that each data element is associated with only one period type

            // we need to preserve information on index to tie response back to relevant denominator relation (some can be filtered out)
            const byLevelRequestsWithIndices = denominatorRelations
                .map((rel, index) => {
                    // UN type does not require details by subOrgUnit level, so these can be skipped
                    if (rel.type === 'un') {
                        return
                    }

                    // the level will be the minimum of the lowest of the denominator levels and the selected level
                    const denomMinLevel = Math.min(
                        rel.A.lowLevel,
                        rel.B.lowLevel,
                        variables.orgUnitLevelNumber
                    )
                    // if the denominator relation level is less than the boundary org unit's level, it cannot be calculated
                    if (denomMinLevel < variables.boundaryOrgUnitLevel) {
                        return
                    }
                    return {
                        request: fetchDataByLevel({
                            engine,
                            variables: {
                                dataElements: [rel.A.id, rel.B.id],
                                orgUnits: variables.orgUnits,
                                orgUnitLevel: `LEVEL-${denomMinLevel}`,
                                periods: [variables.currentPeriod?.id],
                            },
                        }),
                        relation: { index, ...rel, denomMinLevel },
                    }
                })
                .filter((req) => req) //filter out null requests
            const byLevelRequests = byLevelRequestsWithIndices.map(
                (r) => r.request
            )
            const byLevelRequestDenomRelations = byLevelRequestsWithIndices.map(
                (r) => r.relation
            )
            try {
                const overallRequest = engine.query(section4Overall, {
                    variables: {
                        dataElements: denominatorRelationDEs,
                        orgUnits: variables.orgUnits,
                        periods: [variables.currentPeriod.id],
                    },
                })

                const [overallData, ...dataByLevel] = await Promise.all([
                    overallRequest,
                    ...byLevelRequests,
                ])

                setData({
                    response: {
                        ...overallData,
                        [BY_LEVEL_RESPONSE_NAME]: dataByLevel.map(
                            (resp) => resp?.[BY_LEVEL_RESPONSE_NAME]
                        ),
                        [DENOMINATOR_RELATIONS_MAP]:
                            byLevelRequestDenomRelations,
                    },
                    parameters: {
                        ...variables,
                    },
                })
            } catch (e) {
                console.error(e)
                setError(e)
            } finally {
                setLoading(false)
            }
        },
        [engine]
    )
    return { loading, data, error, refetch }
}
