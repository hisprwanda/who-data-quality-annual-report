import { TableBody, TableHead, TableRow } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { LoadingSpinner } from '../../loading-spinner/LoadingSpinner.js'
import { Chart } from '../Chart.js'
import { InterpretationsField, SectionError } from '../common/index.js'
import {
    ReportCell,
    ReportCellHead,
    ReportRowHead,
    ReportTable,
} from '../ReportTable.js'
import { formatVal } from '../utils/utils.js'
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
        return <LoadingSpinner noLayer={true} />
    }

    if (error) {
        return <SectionError error={error} />
    }

    if (section1Data) {
        return (
            <>
                {/* Section 1a */}
                <div className={styles.subsection}>
                    <ReportTable>
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
                                    {`${reportParameters.orgUnitLevelName} with divergent score`}
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
                                    <ReportCell>
                                        {dataset.dataset_name}
                                    </ReportCell>
                                    <ReportCell>
                                        {dataset.threshold}%
                                    </ReportCell>
                                    <ReportCell>
                                        {formatVal(dataset.score, {
                                            roundTo: 1,
                                            includePercentage: true,
                                        })}
                                    </ReportCell>
                                    <ReportCell>
                                        {dataset.divergentRegionsCount}
                                    </ReportCell>
                                    <ReportCell>
                                        {formatVal(
                                            dataset.divergentRegionsPercent,
                                            {
                                                roundTo: 1,
                                                includePercentage: true,
                                            }
                                        )}
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
                    <InterpretationsField className={styles.marginTop4} />
                </div>

                {/* Section 1b */}
                <div className={styles.subsection}>
                    <ReportTable>
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
                                    {`${reportParameters.orgUnitLevelName} with divergent score`}
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
                                    <ReportCell>
                                        {dataset.dataset_name}
                                    </ReportCell>
                                    <ReportCell>
                                        {dataset.threshold}%
                                    </ReportCell>
                                    <ReportCell>
                                        {formatVal(dataset.score, {
                                            roundTo: 1,
                                            includePercentage: true,
                                        })}
                                    </ReportCell>
                                    <ReportCell>
                                        {dataset.divergentRegionsCount}
                                    </ReportCell>
                                    <ReportCell>
                                        {formatVal(
                                            dataset.divergentRegionsPercent,
                                            {
                                                roundTo: 1,
                                                includePercentage: true,
                                            }
                                        )}
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
                    <InterpretationsField className={styles.marginTop4} />
                </div>

                {/* Section 1c */}
                <div className={styles.subsection}>
                    <ReportTable>
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
                                    Reports where values are not missing. If
                                    zeros are not stored, zeros are counted as
                                    missing.
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
                                    {`${reportParameters.orgUnitLevelName} with divergent score`}
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
                                        {formatVal(dataset.overallScore, {
                                            roundTo: 1,
                                            includePercentage: true,
                                        })}
                                    </ReportCell>
                                    <ReportCell>
                                        {dataset.divergentRegionsCount}
                                    </ReportCell>
                                    <ReportCell>
                                        {formatVal(
                                            dataset.divergentRegionsPercent,
                                            {
                                                roundTo: 1,
                                                includePercentage: true,
                                            }
                                        )}
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
                    <InterpretationsField className={styles.marginTop4} />
                </div>

                {/* Section 1d */}
                <div className={styles.subsection}>
                    <ReportTable>
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
                                    {`${reportParameters.orgUnitLevelName} with divergent score`}
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
                                        {formatVal(dataset.score, {
                                            roundTo: 1,
                                            includePercentage: true,
                                        })}
                                    </ReportCell>
                                    <ReportCell>
                                        {formatVal(
                                            dataset.divergentRegionsCount,
                                            {
                                                roundTo: 1,
                                                includePercentage: false,
                                            }
                                        )}
                                    </ReportCell>
                                    <ReportCell>
                                        {formatVal(
                                            dataset.divergentRegionsPercent,
                                            {
                                                roundTo: 1,
                                                includePercentage: true,
                                            }
                                        )}
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
                    <InterpretationsField className={styles.marginTop4} />
                </div>

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
