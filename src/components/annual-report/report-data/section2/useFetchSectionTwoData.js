import { useDataEngine } from '@dhis2/app-runtime'
import { generateFixedPeriods } from '@dhis2/multi-calendar-dates'
import { useCallback, useState } from 'react'
import { periodTypesMapping } from '../../utils/period/FixedPeriod.source.js'

export const SUBPERIODS_RESPONSE_NAME = 'data_detail_by_reporting_period'
export const OVERALL_ORG_UNIT_SECTION_2D = 'data_over_all_org_units'
export const LEVEL_OR_GROUP_SECTION_2D = 'data_by_org_unit_level'
export const OVERALL_ORG_UNIT_SECTION_2E =
    'numerator_relations_over_all_org_units'
export const LEVEL_OR_GROUP_SECTION_2E = 'numerator_relations_org_unit_level'

const dataSetInformation = {
    dataSets: {
        resource: 'dataSets',
        params: ({ dataSets }) => ({
            paging: false,
            fields: ['id', 'periodType'],
            filter: `id:in:[${dataSets.join()}]`,
        }),
    },
}

const section2abcQuery = {
    [SUBPERIODS_RESPONSE_NAME]: {
        resource: 'analytics.json',
        params: ({ dataElements, orgUnits, orgUnitLevel, subPeriods }) => ({
            dimension: `dx:${dataElements.join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${subPeriods.join(';')}`,
        }),
    },
}

const section2deQueries = {
    [OVERALL_ORG_UNIT_SECTION_2D]: {
        resource: 'analytics.json',
        params: ({ dataElements, orgUnits, periods }) => ({
            dimension: `dx:${dataElements.join(';')},ou:${orgUnits.join(
                ';'
            )},pe:${periods.join(';')}`,
        }),
    },
    [LEVEL_OR_GROUP_SECTION_2D]: {
        resource: 'analytics.json',
        params: ({ dataElements, orgUnits, orgUnitLevel, periods }) => ({
            dimension: `dx:${dataElements.join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${periods.join(';')}`,
        }),
    },
    [OVERALL_ORG_UNIT_SECTION_2E]: {
        resource: 'analytics.json',
        params: ({ numeratorRelationDEs, orgUnits, currentPeriod }) => ({
            dimension: `dx:${numeratorRelationDEs.join(';')},ou:${orgUnits.join(
                ';'
            )},pe:${currentPeriod}`,
        }),
    },
    [LEVEL_OR_GROUP_SECTION_2E]: {
        resource: 'analytics.json',
        params: ({
            numeratorRelationDEs,
            orgUnits,
            orgUnitLevel,
            currentPeriod,
        }) => ({
            dimension: `dx:${numeratorRelationDEs.join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${currentPeriod}`,
        }),
    },
}

export const fetchDataBySubPeriod = async ({ engine, variables }) => {
    const dataBySubPeriod = await engine.query(section2abcQuery, {
        variables,
    })
    return dataBySubPeriod
}

const getValidDataElementPeriodTypes = ({
    dataElements,
    dataSetTypes,
    mappedConfiguration,
}) => {
    const validDataElementPeriodTypes = {}
    const dataSetTypeMap = dataSetTypes.reduce((dsMap, ds) => {
        return { ...dsMap, [ds.id]: ds.periodType }
    }, {})
    dataElements.forEach((de) => {
        const dataSetsForDE =
            mappedConfiguration.dataElementsAndIndicators[de]?.dataSetID

        // for backwards compatibility, make array if not already array
        const dataSetsForDEArray = Array.isArray(dataSetsForDE)
            ? dataSetsForDE
            : [dataSetsForDE]
        const periodTypesSet = new Set(
            dataSetsForDEArray?.map((dsID) => dataSetTypeMap[dsID])
        )
        if (periodTypesSet.size === 1) {
            validDataElementPeriodTypes[de] = [...periodTypesSet][0]
        }
    })
    return validDataElementPeriodTypes
}

const isWithinPeriod = ({ pe, start, end }) => {
    const startSubPeriod = new Date(pe.startDate)
    const endSubPeriod = new Date(pe.endDate)
    return startSubPeriod >= start && endSubPeriod <= end
}

const getSubPeriods = ({ dePeriodTypes, currentPeriod }) => {
    const { startDate, endDate } = currentPeriod
    const start = new Date(startDate)
    const end = new Date(endDate)

    const year = Number(startDate.substring(0, 4))

    const deSubPeriods = {}

    for (const de in dePeriodTypes) {
        const periodType = periodTypesMapping[dePeriodTypes[de]]
        // TBD on whether year is start or end date

        // need to generate current and previous year periods then filter between start/end dates
        const params = {
            calendar: 'gregory',
            periodType,
            year,
            locale: 'en',
        }
        // generate once with current year, once with previous year
        const subPeriods = [
            ...generateFixedPeriods(params),
            ...generateFixedPeriods({ ...params, year: year - 1 }),
        ]

        // filter subperiod to get only those within current period
        const filteredSubPeriods = subPeriods.filter((pe) =>
            isWithinPeriod({ pe, start, end })
        )

        // if there are no valid subperiods, the request should not be sent (will result in error from analytics)
        if (filteredSubPeriods.length > 0) {
            deSubPeriods[de] = filteredSubPeriods.map((subPE) => subPE.id)
        }
    }
    return deSubPeriods
}

export const useFetchSectionTwoData = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    const engine = useDataEngine()

    const refetch = useCallback(
        async ({ variables = {} }) => {
            const numeratorRelationDEs = [
                ...variables?.mappedConfiguration.numeratorRelations?.map(
                    (rel) => rel.A
                ),
                ...variables?.mappedConfiguration.numeratorRelations?.map(
                    (rel) => rel.B
                ),
            ]

            // set to loading
            setLoading(true)
            // get data sets and check that each data element is associated with only one period type
            const dataSetResponse = await engine.query(dataSetInformation, {
                variables: { dataSets: variables.dataSets },
            })

            const validDataElementPeriodTypes = getValidDataElementPeriodTypes({
                dataElements: variables.dataElements,
                dataSetTypes: dataSetResponse?.dataSets?.dataSets,
                mappedConfiguration: variables.mappedConfiguration,
            })

            // get sub periods within current period for each periodType
            const subPeriodsByDE = getSubPeriods({
                dePeriodTypes: validDataElementPeriodTypes,
                currentPeriod: variables.currentPeriod,
            })
            const subPeriodRequests = Object.keys(subPeriodsByDE).map((de) =>
                fetchDataBySubPeriod({
                    engine,
                    variables: {
                        dataElements: [de],
                        orgUnits: variables.orgUnits,
                        orgUnitLevel: variables.orgUnitLevel,
                        subPeriods: subPeriodsByDE[de],
                    },
                })
            )
            try {
                const otherRequest = engine.query(section2deQueries, {
                    variables: {
                        dataElements: Object.keys(validDataElementPeriodTypes),
                        numeratorRelationDEs,
                        orgUnits: variables.orgUnits,
                        orgUnitLevel: variables.orgUnitLevel,
                        periods: variables.periods.map((p) => p.id),
                        currentPeriod: variables.currentPeriod.id,
                    },
                })

                const [otherData, ...dataBySubPeriod] = await Promise.all([
                    otherRequest,
                    ...subPeriodRequests,
                ])

                setData({
                    ...otherData,
                    [SUBPERIODS_RESPONSE_NAME]: dataBySubPeriod.map(
                        (resp) => resp[SUBPERIODS_RESPONSE_NAME]
                    ),
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
