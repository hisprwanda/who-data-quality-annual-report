import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useState } from 'react'
import { calculateSection3 } from './section3Calculations.js'

export const OVERALL_RESPONSE_NAME = 'data_over_all_org_units'
export const BY_LEVEL_RESPONSE_NAME = 'data_detail_by_level'
export const EXTERNAL_RELATIONS_INDICES_WITH_BY_LEVEL_DATA =
    'externalRelationsResponsesIndices'

const section3ByLevel = {
    [BY_LEVEL_RESPONSE_NAME]: {
        resource: 'analytics.json',
        params: ({ dataElements, orgUnits, orgUnitLevel, periods }) => ({
            dimension: `dx:${dataElements.join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${periods.join(';')}`,
        }),
    },
}

const section3Overall = {
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
    const dataBySubPeriod = await engine.query(section3ByLevel, {
        variables,
    })
    return dataBySubPeriod
}

export const useSectionThreeData = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    const engine = useDataEngine()

    const refetch = useCallback(
        async ({ variables = {} }) => {
            const boundaryOrgUnitLevel = variables.boundaryOrgUnitLevel

            const externalRelations =
                variables?.mappedConfiguration?.externalRelations
            const externalRelationsDEs = externalRelations
                ? [
                      ...externalRelations.map((rel) => rel.denominator),
                      ...externalRelations.map((rel) => rel.numerator),
                      ...externalRelations.map((rel) => rel.externalData),
                  ]
                : []

            // set to loading
            setLoading(true)
            // get data sets and check that each data element is associated with only one period type

            // we need to preserve information on index to tie response back to relevant denominator relation (some can be filtered out)
            const byLevelRequestsWithIndices = externalRelations
                .map((rel, index) => {
                    // if the relation's level is the same, or less the boundary organisation unit level, the byLevel request should be skipped
                    if (!rel.level || rel.level <= boundaryOrgUnitLevel) {
                        return null
                    }

                    return {
                        request: fetchDataByLevel({
                            engine,
                            variables: {
                                dataElements: [
                                    rel.numerator,
                                    rel.denominator,
                                    rel.externalData,
                                ],
                                orgUnits: variables.orgUnits,
                                orgUnitLevel: `LEVEL-${rel.level}`,
                                periods: [variables?.currentPeriod.id],
                            },
                        }),
                        index,
                    }
                })
                .filter((req) => req) //filter out null requests
            const byLevelRequests = byLevelRequestsWithIndices.map(
                (r) => r.request
            )
            const byLevelRequestIndices = byLevelRequestsWithIndices.map(
                (r) => r.index
            )
            try {
                const overallRequest = engine.query(section3Overall, {
                    variables: {
                        dataElements: externalRelationsDEs,
                        orgUnits: variables.orgUnits,
                        periods: [variables.currentPeriod.id],
                    },
                })
                const [overallData, ...dataByLevel] = await Promise.all([
                    overallRequest,
                    ...byLevelRequests,
                ])

                const consolidatedData = {
                    ...overallData,
                    [BY_LEVEL_RESPONSE_NAME]: dataByLevel.map(
                        (resp) => resp?.[BY_LEVEL_RESPONSE_NAME]
                    ),
                    [EXTERNAL_RELATIONS_INDICES_WITH_BY_LEVEL_DATA]:
                        byLevelRequestIndices,
                }

                const section3Data = calculateSection3({
                    section3Response: consolidatedData,
                    mappedConfiguration: variables.mappedConfiguration,
                    currentPeriod: variables.periods?.[0],
                    overallOrgUnit: variables.orgUnits?.[0],
                })

                setData(section3Data)
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
