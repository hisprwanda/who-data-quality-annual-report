import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useState } from 'react'
import { calculateSection1 } from './section1Calculations.js'

const reportQueries = {
    reporting_rate_over_all_org_units: {
        resource: 'analytics.json',
        params: ({ dataSets, orgUnits, periods }) => ({
            dimension: `dx:${dataSets
                .map((de) => de + '.REPORTING_RATE')
                .join(';')},ou:${orgUnits.join(';')},pe:${periods.join(';')}`,
        }),
    },
    reporting_rate_by_org_unit_level: {
        resource: 'analytics.json',
        params: ({ dataSets, orgUnits, orgUnitLevel, periods }) => ({
            dimension: `dx:${dataSets
                .map((ds) => ds + '.REPORTING_RATE')
                .join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${periods.join(';')}`,
        }),
    },
    reporting_timeliness_over_all_org_units: {
        resource: 'analytics.json',
        params: ({ dataSets, orgUnits, currentPeriod }) => ({
            dimension: `dx:${dataSets
                .map((ds) => ds + '.REPORTING_RATE_ON_TIME')
                .join(';')},ou:${orgUnits.join(';')},pe:${currentPeriod}`,
        }),
    },
    reporting_timeliness_by_org_unit_level: {
        resource: 'analytics.json',
        params: ({ dataSets, orgUnits, orgUnitLevel, currentPeriod }) => ({
            dimension: `dx:${dataSets
                .map((ds) => ds + '.REPORTING_RATE_ON_TIME')
                .join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${currentPeriod}`,
        }),
    },
    expected_reports_over_all_org_units: {
        resource: 'analytics.json',
        params: ({ dataSets, orgUnits, currentPeriod }) => ({
            dimension: `dx:${dataSets
                .map((ds) => ds + '.EXPECTED_REPORTS')
                .join(';')},ou:${orgUnits.join(';')},pe:${currentPeriod}`,
        }),
    },
    expected_reports_by_org_unit_level: {
        resource: 'analytics.json',
        params: ({ dataSets, orgUnits, orgUnitLevel, currentPeriod }) => ({
            dimension: `dx:${dataSets
                .map((ds) => ds + '.EXPECTED_REPORTS')
                .join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${currentPeriod}`,
        }),
    },
    count_of_data_values_over_all_org_units: {
        resource: 'analytics.json',
        params: ({ dataElementOperands, orgUnits, currentPeriod }) => ({
            dimension: `dx:${dataElementOperands.join(';')},ou:${orgUnits.join(
                ';'
            )},pe:${currentPeriod}`,
            aggregationType: 'COUNT',
        }),
    },
    count_of_data_values_by_org_unit_level: {
        resource: 'analytics.json',
        params: ({
            dataElementOperands,
            orgUnits,
            orgUnitLevel,
            currentPeriod,
        }) => ({
            dimension: `dx:${dataElementOperands.join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${currentPeriod}`,
            aggregationType: 'COUNT',
        }),
    },
}

export const useSectionOneData = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    const engine = useDataEngine()

    const refetch = useCallback(
        async ({ variables = {} }) => {
            // set to loading
            setLoading(true)
            const dataElementsAndIndicators =
                variables.mappedConfiguration?.dataElementsAndIndicators
            const dataElementOperands = Object.keys(
                dataElementsAndIndicators
            ).map((de) => dataElementsAndIndicators[de].dataElementOperandID)
            try {
                const overallData = await engine.query(reportQueries, {
                    variables: {
                        ...variables,
                        dataSets: Object.keys(
                            variables.mappedConfiguration.dataSets
                        ),
                        dataElementOperands,
                    },
                })

                const consolidatedData = { ...overallData }

                const section1Data = calculateSection1({
                    reportQueryResponse: consolidatedData,
                    mappedConfigurations: variables.mappedConfiguration,
                    period: variables.currentPeriod,
                    periodsIDs: variables.periods,
                    overallOrgUnit: variables.orgUnits?.[0],
                })
                setData(section1Data)
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
