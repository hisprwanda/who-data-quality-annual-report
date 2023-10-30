import { useDataQuery } from '@dhis2/app-runtime'
import {
    TableBody,
    TableHead,
    TableCellHead,
    Table,
    TableCell,
    TableRow,
    TableRowHead,
    CircularLoader,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
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

export const SectionOne = ({ reportParameters }) => {
    const { data, loading, error, refetch } = useDataQuery(reportQueries, {
        lazy: true,
    })

    let sectionData = null

    useEffect(() => {
        const variables = {
            ...reportParameters,
            periods: reportParameters.periods.map((pe) => pe.id),
            currentPeriod: reportParameters.periods[0].id,
        }

        refetch(variables)
    }, [refetch, reportParameters])

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '50px',
                }}
            >
                {' '}
                {/* TODO: put styles external */}
                <CircularLoader large />
            </div>
        )
    }

    if (error) {
        return <span>{error?.message}</span>
    }

    if (data) {
        sectionData = calculateSection1({
            reportQueryResponse: data,
            mappedConfigurations: reportParameters.mappedConfiguration,
            period: reportParameters.periods[0].id,
        })

        return (
            <>
                {/* section one content. this needs to be improved */}
                {sectionData && (
                    <div
                        className="report-preview report-preview-container"
                        style={{ margin: '26px' }}
                    >
                        <p>1a: Completeness of facility reporting</p>
                        <p>
                            The percentage of expected reports that have been
                            entered and completed.
                        </p>
                        <Table>
                            <TableHead>
                                <TableRowHead>
                                    <TableCellHead>Data set</TableCellHead>
                                    <TableCellHead>
                                        Quality threshold
                                    </TableCellHead>
                                    <TableCellHead>Overall score</TableCellHead>
                                    <TableCellHead colSpan="3">
                                        Regions with divergent score
                                        <TableCellHead>Number</TableCellHead>
                                        <TableCellHead>
                                            Percentage
                                        </TableCellHead>
                                        <TableCellHead>Name</TableCellHead>
                                    </TableCellHead>
                                </TableRowHead>
                            </TableHead>
                            <TableBody>
                                {sectionData.section1A.map((dataset, key) => (
                                    <TableRow key={key}>
                                        <TableCell>
                                            {dataset.dataset_name}
                                        </TableCell>
                                        <TableCell>
                                            {dataset.threshold}%
                                        </TableCell>
                                        <TableCell>{dataset.score}%</TableCell>
                                        <TableCell>
                                            {dataset.divergentRegionsCount}
                                        </TableCell>
                                        <TableCell>
                                            {dataset.divergentRegionsPercent}%
                                        </TableCell>
                                        <TableCell>
                                            {dataset.orgUnitLevelsOrGroups.join(
                                                ', '
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <p>1b: Timeliness of facility reporting</p>
                        <p>
                            The percentage of expected reports that have been
                            entered and completed on time.
                        </p>
                        <Table>
                            <TableHead>
                                <TableRowHead>
                                    <TableCellHead>Data set</TableCellHead>
                                    <TableCellHead>
                                        Quality threshold
                                    </TableCellHead>
                                    <TableCellHead>Overall score</TableCellHead>
                                    <TableCellHead colSpan="3">
                                        Regions with divergent score
                                        <TableCellHead>Number</TableCellHead>
                                        <TableCellHead>
                                            Percentage
                                        </TableCellHead>
                                        <TableCellHead>Name</TableCellHead>
                                    </TableCellHead>
                                </TableRowHead>
                            </TableHead>
                            <TableBody>
                                {sectionData.section1B.map((dataset, key) => (
                                    <TableRow key={key}>
                                        <TableCell>
                                            {dataset.dataset_name}
                                        </TableCell>
                                        <TableCell>
                                            {dataset.threshold}%
                                        </TableCell>
                                        <TableCell>{dataset.score}%</TableCell>
                                        <TableCell>
                                            {dataset.divergentRegionsCount}
                                        </TableCell>
                                        <TableCell>
                                            {dataset.divergentRegionsPercent}%
                                        </TableCell>
                                        <TableCell>
                                            {dataset.orgUnitLevelsOrGroups.join(
                                                ', '
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <p>1c: Timeliness of facility reporting</p>
                        <p>
                            The percentage of expected reports that have been
                            entered and completed on time.
                        </p>
                        <Table>
                            <TableHead>
                                <TableRowHead>
                                    <TableCellHead>Indicator</TableCellHead>
                                    <TableCellHead>
                                        Quality threshold
                                    </TableCellHead>
                                    <TableCellHead colSpan="2">
                                        Values
                                        <TableCellHead>Expected</TableCellHead>
                                        <TableCellHead>Actual</TableCellHead>
                                    </TableCellHead>
                                    <TableCellHead>Overall Score</TableCellHead>
                                    <TableCellHead colSpan="3">
                                        Regions with divergent score
                                        <TableCellHead>Number</TableCellHead>
                                        <TableCellHead>
                                            Percentage
                                        </TableCellHead>
                                        <TableCellHead>Name</TableCellHead>
                                    </TableCellHead>
                                </TableRowHead>
                            </TableHead>
                            <TableBody>
                                {sectionData.section1C.map((dataset, key) => (
                                    <TableRow key={key}>
                                        <TableCell>
                                            {dataset.indicator_name}
                                        </TableCell>
                                        <TableCell>
                                            {dataset.threshold}%
                                        </TableCell>
                                        <TableCell>
                                            {dataset.expectedValues}
                                        </TableCell>
                                        <TableCell>
                                            {dataset.actualValues}
                                        </TableCell>
                                        <TableCell>
                                            {dataset.overallScore}
                                        </TableCell>
                                        <TableCell>
                                            {dataset.divergentRegionsCount}
                                        </TableCell>
                                        <TableCell>
                                            {dataset.divergentRegionsPercent}%
                                        </TableCell>
                                        <TableCell>
                                            {dataset.orgUnitLevelsOrGroups.join(
                                                ', '
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <p>1d: Consistency of dataset completeness over time</p>
                        <p>
                            Completeness of datasets in 2022 compared to
                            previous 3 years.
                        </p>
                        <Table>
                            <TableHead>
                                <TableRowHead>
                                    <TableCellHead>Data set</TableCellHead>
                                    <TableCellHead>
                                        Expected Trend
                                    </TableCellHead>
                                    <TableCellHead>
                                        Compare Region to
                                    </TableCellHead>
                                    <TableCellHead>
                                        Quality threshold
                                    </TableCellHead>
                                    <TableCellHead>Overall score</TableCellHead>
                                    <TableCellHead colSpan="3">
                                        Regions with divergent score
                                        <TableCellHead>Number</TableCellHead>
                                        <TableCellHead>
                                            Percentage
                                        </TableCellHead>
                                        <TableCellHead>Name</TableCellHead>
                                    </TableCellHead>
                                </TableRowHead>
                            </TableHead>
                            <TableBody>
                                {sectionData.section1D.map((dataset, key) => (
                                    <TableRow key={key}>
                                        <TableCell>
                                            {dataset.dataset_name}
                                        </TableCell>
                                        <TableCell>
                                            {dataset.trend[0].toUpperCase() +
                                                dataset.trend.slice(1)}
                                        </TableCell>
                                        <TableCell>
                                            {dataset.comparison}
                                        </TableCell>
                                        <TableCell>
                                            ± {dataset.threshold}%
                                        </TableCell>
                                        <TableCell>{dataset.score}%</TableCell>
                                        <TableCell>
                                            {dataset.divergentRegionsCount}
                                        </TableCell>
                                        <TableCell>
                                            {dataset.divergentRegionsPercent}%
                                        </TableCell>
                                        <TableCell>
                                            {dataset.orgUnitLevelsOrGroups.join(
                                                ', '
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </>
        )
    }
    return null
}

SectionOne.propTypes = {
    reportParameters: PropTypes.object,
}
