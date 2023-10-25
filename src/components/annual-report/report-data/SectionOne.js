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
import React, { useEffect } from 'react'
import { getReportSectionsData } from '../../../utils/utils.js'

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

export const SectionOne = ({ reportParameters, previewReport }) => {
    const { data, loading, error, refetch } = useDataQuery(reportQueries, {
        lazy: true,
    })

    let sectionsData = null

    // const generateReport = () => {
    const periods = reportParameters.periods
    const currentPeriod = reportParameters.currentPeriod
    // const dataSets = ['YmRjo8j3F3M']
    const dataSets = reportParameters.dataSets
    const dataElements = reportParameters.dataElements
    const orgUnits = reportParameters.orgUnits
    const orgUnitLevel = reportParameters.orgUnits

    const variables = {
        dataSets,
        dataElements,
        orgUnits,
        orgUnitLevel,
        periods,
        currentPeriod,
    }

    useEffect(() => {
        if (previewReport) {
            refetch(variables)
        }
    }, [previewReport])

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
        return <span>error</span>
    }

    if (data) {
        console.log(reportParameters)
        sectionsData = getReportSectionsData(
            data,
            reportParameters.mappedConfiguration,
            reportParameters.currentPeriod
        )
    }

    return (
        <>
            {/* section one content. this needs to be improved */}

            <div
                className="report-preview report-preview-container"
                style={{ margin: '26px' }}
            >
                <div
                    style={{
                        backgroundColor: '#5b92e5',
                        padding: '5px',
                        color: '#fff', // Assuming 'fer' is a valid color value
                        fontSize: '20px',
                        // margin: '20px'
                    }}
                >
                    <p> DOMAIN 1 - COMPLETENESS OF REPORTING </p>
                </div>
                <p>1a: Completeness of facility reporting</p>
                <p>
                    The percentage of expected reports that have been entered
                    and completed.
                </p>
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>Data set</TableCellHead>
                            <TableCellHead>Quality threshold</TableCellHead>
                            <TableCellHead>Overall score</TableCellHead>
                            <TableCellHead colSpan="3">
                                Regions with divergent score
                                <TableCellHead>Number</TableCellHead>
                                <TableCellHead>Percentage</TableCellHead>
                                <TableCellHead>Name</TableCellHead>
                            </TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {sectionsData
                            ? Object.values(
                                  sectionsData.section1.section1A[0]
                              ).map((dataset, key) => (
                                  <TableRow key={key}>
                                      <TableCell>
                                          {dataset[0].dataset_name}
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].threshold}%
                                      </TableCell>
                                      <TableCell>{dataset[0].score}%</TableCell>
                                      <TableCell>
                                          {dataset[0].divergentRegionsCount}
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].divergentRegionsPercent}%
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].orgUnitLevelsOrGroups.join(
                                              ', '
                                          )}
                                      </TableCell>
                                  </TableRow>
                              ))
                            : ''}
                    </TableBody>
                </Table>
                <p>1b: Timeliness of facility reporting</p>
                <p>
                    The percentage of expected reports that have been entered
                    and completed on time.
                </p>
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>Data set</TableCellHead>
                            <TableCellHead>Quality threshold</TableCellHead>
                            <TableCellHead>Overall score</TableCellHead>
                            <TableCellHead colSpan="3">
                                Regions with divergent score
                                <TableCellHead>Number</TableCellHead>
                                <TableCellHead>Percentage</TableCellHead>
                                <TableCellHead>Name</TableCellHead>
                            </TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {sectionsData
                            ? Object.values(
                                  sectionsData.section1.section1B[0]
                              ).map((dataset, key) => (
                                  <TableRow key={key}>
                                      <TableCell>
                                          {dataset[0].dataset_name}
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].threshold}%
                                      </TableCell>
                                      <TableCell>{dataset[0].score}%</TableCell>
                                      <TableCell>
                                          {dataset[0].divergentRegionsCount}
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].divergentRegionsPercent}%
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].orgUnitLevelsOrGroups.join(
                                              ', '
                                          )}
                                      </TableCell>
                                  </TableRow>
                              ))
                            : ''}
                    </TableBody>
                </Table>
                <p>1c: Timeliness of facility reporting</p>
                <p>
                    The percentage of expected reports that have been entered
                    and completed on time.
                </p>
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>Indicator</TableCellHead>
                            <TableCellHead>Quality threshold</TableCellHead>
                            <TableCellHead colSpan="2">
                                Values
                                <TableCellHead>Expected</TableCellHead>
                                <TableCellHead>Actual</TableCellHead>
                            </TableCellHead>
                            <TableCellHead>Overall Score</TableCellHead>
                            <TableCellHead colSpan="3">
                                Regions with divergent score
                                <TableCellHead>Number</TableCellHead>
                                <TableCellHead>Percentage</TableCellHead>
                                <TableCellHead>Name</TableCellHead>
                            </TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {sectionsData
                            ? Object.values(
                                  sectionsData.section1.section1C[0]
                              ).map((dataset, key) => (
                                  <TableRow key={key}>
                                      <TableCell>
                                          {dataset[0].indicator_name}
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].threshold}%
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].expectedValues}
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].actualValues}
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].overallScore}
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].divergentRegionsCount}
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].divergentRegionsPercent}%
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].orgUnitLevelsOrGroups.join(
                                              ', '
                                          )}
                                      </TableCell>
                                  </TableRow>
                              ))
                            : ''}
                    </TableBody>
                </Table>

                <p>1d: Consistency of dataset completeness over time</p>
                <p>
                    Completeness of datasets in 2022 compared to previous 3
                    years.
                </p>
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>Data set</TableCellHead>
                            <TableCellHead>Expected Trend</TableCellHead>
                            <TableCellHead>Compare Region to</TableCellHead>
                            <TableCellHead>Quality threshold</TableCellHead>
                            <TableCellHead>Overall score</TableCellHead>
                            <TableCellHead colSpan="3">
                                Regions with divergent score
                                <TableCellHead>Number</TableCellHead>
                                <TableCellHead>Percentage</TableCellHead>
                                <TableCellHead>Name</TableCellHead>
                            </TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {sectionsData
                            ? Object.values(
                                  sectionsData.section1.section1D[0]
                              ).map((dataset, key) => (
                                  <TableRow key={key}>
                                      <TableCell>
                                          {dataset[0].dataset_name}
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].trend[0].toUpperCase() +
                                              dataset[0].trend.slice(1)}
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].comparison}
                                      </TableCell>
                                      <TableCell>
                                          ± {dataset[0].threshold}%
                                      </TableCell>
                                      <TableCell>{dataset[0].score}%</TableCell>
                                      <TableCell>
                                          {dataset[0].divergentRegionsCount}
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].divergentRegionsPercent}%
                                      </TableCell>
                                      <TableCell>
                                          {dataset[0].orgUnitLevelsOrGroups.join(
                                              ', '
                                          )}
                                      </TableCell>
                                  </TableRow>
                              ))
                            : ''}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
