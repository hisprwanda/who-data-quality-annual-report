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
import { Chart } from '../Chart.js'
import { calculateSection1 } from './section1Calculations.js'
import { useFetchSectionOneData } from './useFetchSectionOneData.js'

export const SectionOne = ({ reportParameters }) => {
    const { data, loading, error, refetch } = useFetchSectionOneData()

    useEffect(() => {
        const variables = {
            ...reportParameters,
            periods: reportParameters.periods.map((pe) => pe.id),
            currentPeriod: reportParameters.periods[0].id,
        }
        refetch({ variables })
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
        const sectionData = calculateSection1({
            reportQueryResponse: data.response,
            mappedConfigurations: data.parameters?.mappedConfiguration,
            period: data.parameters?.currentPeriod,
            periodsIDs: data.parameters?.periods,
            overallOrgUnit: data.parameters?.orgUnits?.[0],
        })

        return (
            <>
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
                            {sectionData.section1A.map((dataset, key) => (
                                <TableRow key={key}>
                                    <TableCell>
                                        {dataset.dataset_name}
                                    </TableCell>
                                    <TableCell>{dataset.threshold}%</TableCell>
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
                            {sectionData.section1B.map((dataset, key) => (
                                <TableRow key={key}>
                                    <TableCell>
                                        {dataset.dataset_name}
                                    </TableCell>
                                    <TableCell>{dataset.threshold}%</TableCell>
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
                            {sectionData.section1C.map((dataset, key) => (
                                <TableRow key={key}>
                                    <TableCell>
                                        {dataset.indicator_name}
                                    </TableCell>
                                    <TableCell>{dataset.threshold}%</TableCell>
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
                            {sectionData.section1D.map((dataset, key) => (
                                <TableRow key={key}>
                                    <TableCell>
                                        {dataset.dataset_name}
                                    </TableCell>
                                    <TableCell>
                                        {dataset.trend[0].toUpperCase() +
                                            dataset.trend.slice(1)}
                                    </TableCell>
                                    <TableCell>{dataset.comparison}</TableCell>
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
                <Chart
                    sectionId={'section1'}
                    chartId={'chart1'}
                    chartInfo={sectionData.chartInfo}
                />
            </>
        )
    }
    return null
}

SectionOne.propTypes = {
    reportParameters: PropTypes.object,
}
