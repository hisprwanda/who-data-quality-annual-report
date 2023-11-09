import { useDataQuery } from '@dhis2/app-runtime'
import { TableBody, TableHead, TableRow, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { Chart } from '../Chart.js'
import {
    ReportCell,
    ReportCellHead,
    ReportRowHead,
    ReportTable,
} from '../ReportTable.js'
import { calculateSection1 } from './section1Calculations.js'
import styles from './SectionOne.module.css'

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
            periodsIDs: reportParameters.periods.map((p) => p.id),
            overallOrgUnit: reportParameters.orgUnits[0],
        })

        return (
            <>
                {/* section one content. this needs to be improved */}
                {sectionData && (
                    <>
                        {/* Section 1a */}
                        <ReportTable className={styles.subsection}>
                            <TableHead>
                                <ReportRowHead>
                                    <ReportCellHead colSpan="6">
                                        1a: Completeness of facility reporting
                                    </ReportCellHead>
                                </ReportRowHead>
                                <TableRow>
                                    <ReportCell colSpan="6">
                                        The percentage of expected reports that
                                        have been entered and completed.
                                    </ReportCell>
                                </TableRow>
                                <ReportRowHead>
                                    <ReportCellHead rowSpan="2">
                                        Data set
                                    </ReportCellHead>
                                    <ReportCellHead rowSpan="2">
                                        Quality threshold
                                    </ReportCellHead>
                                    <ReportCellHead rowSpan="2">
                                        Overall score
                                    </ReportCellHead>
                                    <ReportCellHead colSpan="3">
                                        Regions with divergent score
                                    </ReportCellHead>
                                </ReportRowHead>
                                <ReportRowHead>
                                    <ReportCellHead>Number</ReportCellHead>
                                    <ReportCellHead>Percentage</ReportCellHead>
                                    <ReportCellHead>Name</ReportCellHead>
                                </ReportRowHead>
                            </TableHead>

                            <TableBody>
                                {sectionData.section1A.map((dataset, key) => (
                                    <TableRow key={key}>
                                        <ReportCell>
                                            {dataset.dataset_name}
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.threshold}%
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.score}%
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.divergentRegionsCount}
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.divergentRegionsPercent}%
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.orgUnitLevelsOrGroups.join(
                                                ', '
                                            )}
                                        </ReportCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </ReportTable>

                        {/* Section 1b */}
                        <ReportTable className={styles.subsection}e>
                            <TableHead>
                                <ReportRowHead>
                                    <ReportCellHead colSpan="6">
                                        1b: Timeliness of facility reporting
                                    </ReportCellHead>
                                </ReportRowHead>
                                <TableRow>
                                    <ReportCell colSpan="6">
                                        The percentage of expected reports that
                                        have been entered and completed on time.
                                    </ReportCell>
                                </TableRow>
                                <ReportRowHead>
                                    <ReportCellHead rowSpan="2">
                                        Data set
                                    </ReportCellHead>
                                    <ReportCellHead rowSpan="2">
                                        Quality threshold
                                    </ReportCellHead>
                                    <ReportCellHead rowSpan="2">
                                        Overall score
                                    </ReportCellHead>
                                    <ReportCellHead colSpan="3">
                                        Regions with divergent score
                                    </ReportCellHead>
                                </ReportRowHead>
                                <ReportRowHead>
                                    <ReportCellHead>Number</ReportCellHead>
                                    <ReportCellHead>Percentage</ReportCellHead>
                                    <ReportCellHead>Name</ReportCellHead>
                                </ReportRowHead>
                            </TableHead>

                            <TableBody>
                                {sectionData.section1B.map((dataset, key) => (
                                    <TableRow key={key}>
                                        <ReportCell>
                                            {dataset.dataset_name}
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.threshold}%
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.score}%
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.divergentRegionsCount}
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.divergentRegionsPercent}%
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.orgUnitLevelsOrGroups.join(
                                                ', '
                                            )}
                                        </ReportCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </ReportTable>

                        {/* Section 1c */}
                        <ReportTable className={styles.subsection}>
                            <TableHead>
                                <ReportRowHead>
                                    <ReportCellHead colSpan="8">
                                        1c: Completeness of indicator data
                                    </ReportCellHead>
                                </ReportRowHead>
                                <TableRow>
                                    <ReportCell colSpan="8">
                                        Reports where values are not missing. If
                                        zeros are not stored, zeros are counted
                                        as missing.
                                    </ReportCell>
                                </TableRow>
                                <ReportRowHead>
                                    <ReportCellHead rowSpan="2">
                                        Indicator
                                    </ReportCellHead>
                                    <ReportCellHead rowSpan="2">
                                        Quality threshold
                                    </ReportCellHead>
                                    <ReportCellHead colSpan="2">
                                        Values
                                    </ReportCellHead>
                                    <ReportCellHead rowSpan="2">
                                        Overall Score
                                    </ReportCellHead>
                                    <ReportCellHead colSpan="3">
                                        Regions with divergent score
                                    </ReportCellHead>
                                </ReportRowHead>
                                <ReportRowHead>
                                    <ReportCellHead>Expected</ReportCellHead>
                                    <ReportCellHead>Actual</ReportCellHead>
                                    <ReportCellHead>Number</ReportCellHead>
                                    <ReportCellHead>Percentage</ReportCellHead>
                                    <ReportCellHead>Name</ReportCellHead>
                                </ReportRowHead>
                            </TableHead>

                            <TableBody>
                                {sectionData.section1C.map((dataset, key) => (
                                    <TableRow key={key}>
                                        <ReportCell>
                                            {dataset.indicator_name}
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.threshold}%
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.expectedValues}
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.actualValues}
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.overallScore}
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.divergentRegionsCount}
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.divergentRegionsPercent}%
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.orgUnitLevelsOrGroups.join(
                                                ', '
                                            )}
                                        </ReportCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </ReportTable>

                        {/* Section 1d */}
                        <ReportTable className={styles.subsection}>
                            <TableHead>
                                <ReportRowHead>
                                    <ReportCellHead colSpan="8">
                                        1d: Consistency of dataset completeness
                                        over time
                                    </ReportCellHead>
                                </ReportRowHead>
                                <TableRow>
                                    <ReportCell colSpan="8">
                                        Completeness of datasets in 2022
                                        compared to previous 3 years.
                                    </ReportCell>
                                </TableRow>
                                <ReportRowHead>
                                    <ReportCellHead rowSpan="2">
                                        Data set
                                    </ReportCellHead>
                                    <ReportCellHead rowSpan="2">
                                        Expected Trend
                                    </ReportCellHead>
                                    <ReportCellHead rowSpan="2">
                                        Compare Region to
                                    </ReportCellHead>
                                    <ReportCellHead rowSpan="2">
                                        Quality threshold
                                    </ReportCellHead>
                                    <ReportCellHead rowSpan="2">
                                        Overall score
                                    </ReportCellHead>
                                    <ReportCellHead colSpan="3">
                                        Regions with divergent score
                                    </ReportCellHead>
                                </ReportRowHead>
                                <ReportRowHead>
                                    <ReportCellHead>Number</ReportCellHead>
                                    <ReportCellHead>Percentage</ReportCellHead>
                                    <ReportCellHead>Name</ReportCellHead>
                                </ReportRowHead>
                            </TableHead>

                            <TableBody>
                                {sectionData.section1D.map((dataset, key) => (
                                    <TableRow key={key}>
                                        <ReportCell>
                                            {dataset.dataset_name}
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.trend[0].toUpperCase() +
                                                dataset.trend.slice(1)}
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.comparison}
                                        </ReportCell>
                                        <ReportCell>
                                            ± {dataset.threshold}%
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.score}%
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.divergentRegionsCount}
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.divergentRegionsPercent}%
                                        </ReportCell>
                                        <ReportCell>
                                            {dataset.orgUnitLevelsOrGroups.join(
                                                ', '
                                            )}
                                        </ReportCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </ReportTable>

                        <Chart
                            sectionId={'section1'}
                            chartId={'chart1'}
                            chartInfo={sectionData.chartInfo}
                            className={styles.section1Chart}
                        />
                    </>
                )}
            </>
        )
    }
    return null
}

SectionOne.propTypes = {
    reportParameters: PropTypes.object,
}
