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
import styles from './SectionOne.module.css'
import { useSectionOneData } from './useSectionOneData.js'

export const SectionOne = ({ reportParameters }) => {
    const { data: section1Data, loading, error, refetch } = useSectionOneData()

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

    if (section1Data) {
        return (
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
                            <ReportCell
                                colSpan="6"
                                className={styles.subsectionSubtitle}
                            >
                                The percentage of expected reports that have
                                been entered and completed.
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
                                {`${reportParameters.orgUnitLevelName}s with divergent score`}
                            </ReportCellHead>
                        </ReportRowHead>
                        <ReportRowHead>
                            <ReportCellHead>Number</ReportCellHead>
                            <ReportCellHead>Percentage</ReportCellHead>
                            <ReportCellHead>Name</ReportCellHead>
                        </ReportRowHead>
                    </TableHead>

                    <TableBody>
                        {section1Data.section1A.map((dataset, key) => (
                            <TableRow key={key}>
                                <ReportCell>{dataset.dataset_name}</ReportCell>
                                <ReportCell>{dataset.threshold}%</ReportCell>
                                <ReportCell>{dataset.score}%</ReportCell>
                                <ReportCell>
                                    {dataset.divergentRegionsCount}
                                </ReportCell>
                                <ReportCell>
                                    {dataset.divergentRegionsPercent}%
                                </ReportCell>
                                <ReportCell>
                                    {dataset.orgUnitLevelsOrGroups.join(', ')}
                                </ReportCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </ReportTable>

                {/* Section 1b */}
                <ReportTable className={styles.subsection} e>
                    <TableHead>
                        <ReportRowHead>
                            <ReportCellHead colSpan="6">
                                1b: Timeliness of facility reporting
                            </ReportCellHead>
                        </ReportRowHead>
                        <TableRow>
                            <ReportCell
                                colSpan="6"
                                className={styles.subsectionSubtitle}
                            >
                                The percentage of expected reports that have
                                been entered and completed on time.
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
                                {`${reportParameters.orgUnitLevelName}s with divergent score`}
                            </ReportCellHead>
                        </ReportRowHead>
                        <ReportRowHead>
                            <ReportCellHead>Number</ReportCellHead>
                            <ReportCellHead>Percentage</ReportCellHead>
                            <ReportCellHead>Name</ReportCellHead>
                        </ReportRowHead>
                    </TableHead>

                    <TableBody>
                        {section1Data.section1B.map((dataset, key) => (
                            <TableRow key={key}>
                                <ReportCell>{dataset.dataset_name}</ReportCell>
                                <ReportCell>{dataset.threshold}%</ReportCell>
                                <ReportCell>{dataset.score}%</ReportCell>
                                <ReportCell>
                                    {dataset.divergentRegionsCount}
                                </ReportCell>
                                <ReportCell>
                                    {dataset.divergentRegionsPercent}%
                                </ReportCell>
                                <ReportCell>
                                    {dataset.orgUnitLevelsOrGroups.join(', ')}
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
                            <ReportCell
                                colSpan="8"
                                className={styles.subsectionSubtitle}
                            >
                                Reports where values are not missing. If zeros
                                are not stored, zeros are counted as missing.
                            </ReportCell>
                        </TableRow>
                        <ReportRowHead>
                            <ReportCellHead rowSpan="2">
                                Indicator
                            </ReportCellHead>
                            <ReportCellHead rowSpan="2">
                                Quality threshold
                            </ReportCellHead>
                            <ReportCellHead colSpan="2">Values</ReportCellHead>
                            <ReportCellHead rowSpan="2">
                                Overall Score
                            </ReportCellHead>
                            <ReportCellHead colSpan="3">
                                {`${reportParameters.orgUnitLevelName}s with divergent score`}
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
                        {section1Data.section1C.map((dataset, key) => (
                            <TableRow key={key}>
                                <ReportCell>
                                    {dataset.indicator_name}
                                </ReportCell>
                                <ReportCell>{dataset.threshold}%</ReportCell>
                                <ReportCell>
                                    {dataset.expectedValues}
                                </ReportCell>
                                <ReportCell>{dataset.actualValues}</ReportCell>
                                <ReportCell>{dataset.overallScore}%</ReportCell>
                                <ReportCell>
                                    {dataset.divergentRegionsCount}
                                </ReportCell>
                                <ReportCell>
                                    {dataset.divergentRegionsPercent}%
                                </ReportCell>
                                <ReportCell>
                                    {dataset.orgUnitLevelsOrGroups.join(', ')}
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
                                1d: Consistency of dataset completeness over
                                time
                            </ReportCellHead>
                        </ReportRowHead>
                        <TableRow>
                            <ReportCell
                                colSpan="8"
                                className={styles.subsectionSubtitle}
                            >
                                {`Completeness of datasets in ${
                                    reportParameters.periods[0].name
                                } compared to
                                previous ${
                                    reportParameters.periods.length - 1
                                } years.`}
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
                                {`${reportParameters.orgUnitLevelName}s with divergent score`}
                            </ReportCellHead>
                        </ReportRowHead>
                        <ReportRowHead>
                            <ReportCellHead>Number</ReportCellHead>
                            <ReportCellHead>Percentage</ReportCellHead>
                            <ReportCellHead>Name</ReportCellHead>
                        </ReportRowHead>
                    </TableHead>

                    <TableBody>
                        {section1Data.section1D.map((dataset, key) => (
                            <TableRow key={key}>
                                <ReportCell>{dataset.dataset_name}</ReportCell>
                                <ReportCell>
                                    {dataset.trend[0].toUpperCase() +
                                        dataset.trend.slice(1)}
                                </ReportCell>
                                <ReportCell>{dataset.comparison}</ReportCell>
                                <ReportCell>± {dataset.threshold}%</ReportCell>
                                <ReportCell>{dataset.score}%</ReportCell>
                                <ReportCell>
                                    {dataset.divergentRegionsCount}
                                </ReportCell>
                                <ReportCell>
                                    {dataset.divergentRegionsPercent}%
                                </ReportCell>
                                <ReportCell>
                                    {dataset.orgUnitLevelsOrGroups.join(', ')}
                                </ReportCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </ReportTable>

                <Chart
                    sectionId={'section1'}
                    chartId={'chart1'}
                    chartInfo={section1Data.chartInfo}
                    className={styles.section1Chart}
                />
            </>
        )
    }
    return null
}

SectionOne.propTypes = {
    reportParameters: PropTypes.object,
}
