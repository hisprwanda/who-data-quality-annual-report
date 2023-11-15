import { TableBody, TableHead, TableRow } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { Chart } from '../Chart.js'
import { NoDataInfoBox } from '../common/NoDataWarning.js'
import {
    ReportCell,
    ReportCellHead,
    ReportRowHead,
    ReportTable,
} from '../ReportTable.js'
import styles from './SectionTwo.module.css'
import { useSectionTwoData } from './useSectionTwoData.js'

const sectionInformation = {
    section2a: {
        title: '2a: Extreme outliers',
        subtitle:
            'Extreme outliers, using the standard method. Threshold denotes the number of standard deviations from the mean. Region are counted as divergent if they have one or more extreme outliers for an indicator.',
    },
    section2b: {
        title: '2b: Moderate outliers',
        subtitle:
            'Moderate outliers, using the standard method. Threshold denotes the number of standard deviations from the mean. Region are counted as divergent if they have two or more moderate outliers for an indicator.',
    },
    section2c: {
        title: '2c: Moderate outliers',
        subtitle:
            'Moderate outliers, based on median (modified Z score). Region are counted as divergent if they have two or more moderate outliers for an indicator.',
    },
    section2d: {
        title: '2d: Consistency of indicator values over time',
        subtitle:
            'Difference between the current year and either the average of the 3 preceding years (if expected trend is constant), or the forecasted value.',
    },
    section2e: {
        title: '2e: Consistency between related indicators',
        subtitle:
            'Consistency between reported values for two related indicators within the same year.',
    },
}

const SubSectionLayout = ({ title, subtitle }) => (
    <>
        <ReportRowHead>
            <ReportCellHead colSpan="6">{title}</ReportCellHead>
        </ReportRowHead>
        <TableRow>
            <ReportCell colSpan="6">{subtitle}</ReportCell>
        </TableRow>
    </>
)

SubSectionLayout.propTypes = {
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

const Sections2a2b2c = ({ title, subtitle, subsectionData }) => {
    if (subsectionData.length === 0) {
        return (
            <div className={styles.section2abcContainer}>
                <ReportTable>
                    <TableHead>
                        <SubSectionLayout title={title} subtitle={subtitle} />
                    </TableHead>
                </ReportTable>
                <NoDataInfoBox subsection={true} />
            </div>
        )
    }

    return (
        <div className={styles.section2abcContainer}>
            <ReportTable>
                <TableHead>
                    <SubSectionLayout title={title} subtitle={subtitle} />
                    <ReportRowHead>
                        <ReportCellHead rowSpan="2" width="200">
                            Indicator
                        </ReportCellHead>
                        <ReportCellHead rowSpan="2" width="80">
                            Threshold
                        </ReportCellHead>
                        <ReportCellHead rowSpan="2" width="80">
                            Overall score (%)
                        </ReportCellHead>
                        <ReportCellHead colSpan="3">
                            Region with divergent score
                        </ReportCellHead>
                    </ReportRowHead>
                    <ReportRowHead>
                        <ReportCellHead width="110">Number</ReportCellHead>
                        <ReportCellHead width="110">Percent</ReportCellHead>
                        <ReportCellHead>Names</ReportCellHead>
                    </ReportRowHead>
                </TableHead>
                <TableBody>
                    {subsectionData.map((dataRow) => (
                        <TableRow key={dataRow.indicator}>
                            <ReportCell>{dataRow.indicator}</ReportCell>
                            <ReportCell>{dataRow.threshold} SD</ReportCell>
                            <ReportCell>{dataRow.overallScore}</ReportCell>
                            <ReportCell>
                                {dataRow.divergentScores?.number}
                            </ReportCell>
                            <ReportCell>
                                {dataRow.divergentScores?.percentage}
                            </ReportCell>
                            <ReportCell>
                                {dataRow.divergentScores?.names}
                            </ReportCell>
                        </TableRow>
                    ))}
                </TableBody>
            </ReportTable>
        </div>
    )
}
Sections2a2b2c.propTypes = {
    subsectionData: PropTypes.array,
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

const Section2DBlock = ({ dataRow, index }) => (
    <div className={styles.section2dGrid}>
        <ReportTable className={styles.section2dTable}>
            <TableHead>
                <ReportRowHead>
                    <ReportCellHead colSpan="2">{dataRow.name}</ReportCellHead>
                </ReportRowHead>
            </TableHead>
            <TableBody>
                <TableRow>
                    <ReportCell>Expected trend</ReportCell>
                    <ReportCell>{dataRow.expectedTrend}</ReportCell>
                </TableRow>
                <TableRow>
                    <ReportCell>Compare region to</ReportCell>
                    <ReportCell>{dataRow.compareRegionTo}</ReportCell>
                </TableRow>
                <TableRow>
                    <ReportCell>Quality threshold</ReportCell>
                    <ReportCell>±{dataRow.qualityThreshold}%</ReportCell>
                </TableRow>
                <TableRow>
                    <ReportCell>Overall score</ReportCell>
                    <ReportCell>{dataRow.overallScore}%</ReportCell>
                </TableRow>
                <TableRow>
                    <ReportCell>
                        Number of Region with divergent score
                    </ReportCell>
                    <ReportCell>
                        {dataRow.divergentSubOrgUnits?.number}
                    </ReportCell>
                </TableRow>
                <TableRow>
                    <ReportCell>
                        Percent of Region with divergent score
                    </ReportCell>
                    <ReportCell>
                        {dataRow.divergentSubOrgUnits?.percent}%
                    </ReportCell>
                </TableRow>
                <TableRow>
                    <ReportCell colSpan="2">
                        {dataRow.divergentSubOrgUnits?.names}
                    </ReportCell>
                </TableRow>
            </TableBody>
        </ReportTable>
        {dataRow?.chartInfo?.lineChartInfo && (
            <Chart
                sectionId={'section2d'}
                chartId={`line2d_${index}`}
                chartInfo={dataRow.chartInfo.lineChartInfo}
                className={styles.section2dLineChart}
            />
        )}
        {dataRow?.chartInfo?.scatterChartInfo && (
            <Chart
                sectionId={'section2d'}
                chartId={`scatter2d_${index}`}
                chartInfo={dataRow.chartInfo.scatterChartInfo}
                className={styles.section2dScatterChart}
            />
        )}
    </div>
)

Section2DBlock.propTypes = {
    dataRow: PropTypes.object,
    index: PropTypes.number,
}

const Section2D = ({ title, subtitle, subsectionData }) => (
    <>
        <ReportTable className={styles.marginBottom4}>
            <TableHead>
                <SubSectionLayout title={title} subtitle={subtitle} />
            </TableHead>
        </ReportTable>
        {subsectionData.length === 0 && <NoDataInfoBox subsection={true} />}
        {subsectionData.map((dataRow, index) => (
            <Section2DBlock
                key={dataRow.name}
                dataRow={dataRow}
                index={index}
            />
        ))}
    </>
)

Section2D.propTypes = {
    subsectionData: PropTypes.array,
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

const Section2EBlock = ({ dataRow, index }) => (
    <div className={styles.section2eGrid}>
        <ReportTable>
            <TableHead>
                <ReportRowHead>
                    <ReportCellHead colSpan="2">{dataRow.title}</ReportCellHead>
                </ReportRowHead>
            </TableHead>
            <TableBody>
                <TableRow>
                    <ReportCell>Denominator A</ReportCell>
                    <ReportCell>{dataRow.A}</ReportCell>
                </TableRow>
                <TableRow>
                    <ReportCell>Denominator B</ReportCell>
                    <ReportCell>{dataRow.B}</ReportCell>
                </TableRow>
                <TableRow>
                    <ReportCell>Expected relationship</ReportCell>
                    <ReportCell>{dataRow.expectedRelationship}</ReportCell>
                </TableRow>
                <TableRow>
                    <ReportCell>Quality threshold</ReportCell>
                    <ReportCell>
                        {dataRow.expectedRelationship === 'Dropout rate'
                            ? ''
                            : '±'}
                        {dataRow.qualityThreshold}
                    </ReportCell>
                </TableRow>
                <TableRow>
                    <ReportCell>Overall score</ReportCell>
                    <ReportCell>{dataRow.overallScore}%</ReportCell>
                </TableRow>
                <TableRow>
                    <ReportCell>
                        Number of Region with divergent score
                    </ReportCell>
                    <ReportCell>
                        {dataRow.divergentSubOrgUnits?.number}
                    </ReportCell>
                </TableRow>
                <TableRow>
                    <ReportCell>
                        Percent of Region with divergent score
                    </ReportCell>
                    <ReportCell>
                        {dataRow.divergentSubOrgUnits?.percentage}%
                    </ReportCell>
                </TableRow>
                <TableRow>
                    <ReportCell
                        colSpan="2"
                        /** Make this cell taller */
                        className={styles.section2eDivergentRegions}
                    >
                        {dataRow.divergentSubOrgUnits?.names}
                    </ReportCell>
                </TableRow>
            </TableBody>
        </ReportTable>
        {dataRow.chartInfo && (
            <Chart
                sectionId={'section2e'}
                chartId={`chart2e_${index}`}
                chartInfo={dataRow.chartInfo}
                className={styles.section2eChart}
            />
        )}
    </div>
)

Section2EBlock.propTypes = {
    dataRow: PropTypes.object,
    index: PropTypes.number,
}

const Section2E = ({ title, subtitle, subsectionData }) => (
    <>
        <ReportTable className={styles.marginBottom4}>
            <TableHead>
                <SubSectionLayout title={title} subtitle={subtitle} />
            </TableHead>
        </ReportTable>
        {subsectionData.length === 0 && <NoDataInfoBox subsection={true} />}
        {subsectionData.map((dataRow, index) => (
            <Section2EBlock
                key={dataRow.title}
                dataRow={dataRow}
                index={index}
            />
        ))}
    </>
)

Section2E.propTypes = {
    subsectionData: PropTypes.array,
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

export const SectionTwo = ({ reportParameters }) => {
    const { loading, error, data: section2Data, refetch } = useSectionTwoData()

    useEffect(() => {
        const variables = {
            ...reportParameters,
            currentPeriod: reportParameters.periods[0],
        }

        refetch({ variables })
    }, [refetch, reportParameters])

    if (loading) {
        return <span>loading</span>
    }

    if (error) {
        return <span>error</span>
    }

    if (section2Data) {
        // if all subsections are empty, display overall empty message
        const subsectionNames = [
            'section2a',
            'section2b',
            'section2c',
            'section2d',
            'section2e',
        ]
        if (
            subsectionNames
                .map(
                    (subsectionName) =>
                        Object.keys(section2Data?.[subsectionName] ?? []).length
                )
                .every((subsectionLength) => subsectionLength === 0)
        ) {
            return <NoDataInfoBox subsection={false} />
        }

        return (
            <>
                <Sections2a2b2c
                    title={sectionInformation.section2a.title}
                    subtitle={sectionInformation.section2a.subtitle}
                    subsectionData={section2Data.section2a}
                />
                <Sections2a2b2c
                    title={sectionInformation.section2b.title}
                    subtitle={sectionInformation.section2b.subtitle}
                    subsectionData={section2Data.section2b}
                />
                <Sections2a2b2c
                    title={sectionInformation.section2c.title}
                    subtitle={sectionInformation.section2c.subtitle}
                    subsectionData={section2Data.section2c}
                />
                <Section2D
                    title={sectionInformation.section2d.title}
                    subtitle={sectionInformation.section2d.subtitle}
                    subsectionData={section2Data.section2d}
                />
                <Section2E
                    title={sectionInformation.section2e.title}
                    subtitle={sectionInformation.section2e.subtitle}
                    subsectionData={section2Data.section2e}
                />
            </>
        )
    }

    return null
}

SectionTwo.propTypes = {
    reportParameters: PropTypes.object,
}
