import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useState } from 'react'

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
        params: ({ dataElements, orgUnits, currentPeriod }) => ({
            dimension: `dx:${dataElements.join(';')},ou:${orgUnits.join(
                ';'
            )},pe:${currentPeriod}`,
            aggregationType: 'COUNT',
        }),
    },
    count_of_data_values_by_org_unit_level: {
        resource: 'analytics.json',
        params: ({ dataElements, orgUnits, orgUnitLevel, currentPeriod }) => ({
            dimension: `dx:${dataElements.join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${currentPeriod}`,
            aggregationType: 'COUNT',
        }),
    },
}

export const useFetchSectionOneData = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    const engine = useDataEngine()

    const refetch = useCallback(
        async ({ variables = {} }) => {
            // set to loading
            setLoading(true)
            try {
                const overallData = await engine.query(reportQueries, {
                    variables,
                })

                setData({
                    response: {
                        ...overallData,
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
