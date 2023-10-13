import { useDataEngine } from '@dhis2/app-runtime'
import { generateFixedPeriods } from '@dhis2/multi-calendar-dates'
import { Button } from '@dhis2/ui'
import React, { useState } from 'react'
import { periodTypesMapping } from '../../utils/period/FixedPeriod.source.js'
import * as mappedConfigurations from './mappedConfigurations.json'
import { numeratorRelations } from './numeratorRelations.js'
import { calculateSection2 } from './section2Calculations.js'

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
    data_detail_by_reporting_period: {
        resource: 'analytics.json',
        params: ({ dataElements, orgUnits, orgUnitLevel, subPeriods }) => ({
            dimension: `dx:${dataElements.join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${subPeriods.join(';')}`,
        }),
    },
}

const section2deQueries = {
    data_over_all_org_units: {
        resource: 'analytics.json',
        params: ({ dataElements, orgUnits, periods }) => ({
            dimension: `dx:${dataElements.join(';')},ou:${orgUnits.join(
                ';'
            )},pe:${periods.join(';')}`,
        }),
    },
    data_by_org_unit_level: {
        resource: 'analytics.json',
        params: ({ dataElements, orgUnits, orgUnitLevel, periods }) => ({
            dimension: `dx:${dataElements.join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${periods.join(';')}`,
        }),
    },
    numerator_relations_over_all_org_units: {
        resource: 'analytics.json',
        params: ({ numeratorRelationDEs, orgUnits, currentPeriod }) => ({
            dimension: `dx:${numeratorRelationDEs.join(';')},ou:${orgUnits.join(
                ';'
            )},pe:${currentPeriod}`,
        }),
    },
    numerator_relations_org_unit_level: {
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
    mappedConfigurations,
}) => {
    const validDataElementPeriodTypes = {}
    const dataSetTypeMap = dataSetTypes.reduce((dsMap, ds) => {
        return { ...dsMap, [ds.id]: ds.periodType }
    }, {})
    dataElements.forEach((de) => {
        const periodTypesSet = new Set(
            mappedConfigurations.dataElementsAndIndicators[de]?.dataSetID?.map(
                (dsID) => dataSetTypeMap[dsID]
            )
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

export const SectionTwo = () => {
    // const { data, loading, error, refetch } = useDataQuery(section2deQueries, {
    //     lazy: true,
    // })
    const [queryState, setQueryState] = useState({
        loading: false,
        data: false,
        error: false,
    })
    const { data, loading, error } = queryState

    const engine = useDataEngine()

    const generateReport = async () => {
        const periods = ['2022', '2021', '2020', '2019']
        // we need the current period start date / end date (so need to modify some things with period selector)
        const currentPeriod = {
            id: '2022',
            startDate: '2022-01-01',
            endDate: '2022-12-31',
        }
        const dataSets = [
            'dONyxVsQyGS',
            'rGDF7yDdhnj',
            'YmRjo8j3F3M',
            'GhdP8W2GorO',
        ]
        const dataElements = [
            'ieThL7l107F',
            'RvArfQFKdXe',
            'XeRBhx8avQY',
            'YRJjIr5tuD6',
            'YAAmrY2RPbZ',
            'DvUwQScvSpc',
        ]
        const orgUnits = ['lZsCb6y0KDX']
        const orgUnitLevel = 'LEVEL-2'
        const numeratorRelationDEs = [
            ...numeratorRelations.map((rel) => rel.A),
            ...numeratorRelations.map((rel) => rel.B),
        ]

        // get data sets and check that each data element is associated with only one period type
        const dataSetResponse = await engine.query(dataSetInformation, {
            variables: { dataSets },
        })

        const validDataElementPeriodTypes = getValidDataElementPeriodTypes({
            dataElements,
            dataSetTypes: dataSetResponse?.dataSets?.dataSets,
            mappedConfigurations,
        })

        // get sub periods within current period for each periodType
        const subPeriodsByDE = getSubPeriods({
            dePeriodTypes: validDataElementPeriodTypes,
            currentPeriod,
        })
        const subPeriodRequests = Object.keys(subPeriodsByDE).map((de) =>
            fetchDataBySubPeriod({
                engine,
                variables: {
                    dataElements: [de],
                    orgUnits,
                    orgUnitLevel,
                    subPeriods: subPeriodsByDE[de],
                },
            })
        )
        try {
            const dataBySubPeriod = await Promise.all(subPeriodRequests)
            const otherData = await engine.query(section2deQueries, {
                variables: {
                    dataElements: Object.keys(validDataElementPeriodTypes),
                    numeratorRelationDEs,
                    orgUnits,
                    orgUnitLevel,
                    periods,
                    currentPeriod: currentPeriod.id,
                },
            })
            setQueryState({
                data: {
                    ...otherData,
                    data_detail_by_reporting_period: dataBySubPeriod.map(
                        (resp) => resp.data_detail_by_reporting_period
                    ),
                },
            })
        } catch (e) {
            console.error(e)
            setQueryState({ error: e })
        }

        // formulate requests for each valid DE/periodType

        // merge results
    }

    if (loading) {
        return <span>loading</span>
    }

    if (error) {
        return <span>error</span>
    }

    if (data) {
        return (
            <span>
                {JSON.stringify(calculateSection2({ section2Response: data }))}
            </span>
        )
    }

    return (
        <Button
            primary
            onClick={() => {
                generateReport()
            }}
        >
            Generate
        </Button>
    )
}
