import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { Chart } from '../Chart.js'
import styles from '../reportTables.module.css'
import { calculateSection2 } from './section2Calculations.js'
import { useFetchSectionTwoData } from './useFetchSectionTwoData.js'

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
        <TableRowHead className={styles.tableRowHead}>
            <TableCellHead dense colSpan="999">
                {title}
            </TableCellHead>
        </TableRowHead>
        <TableRow>
            <TableCell dense colSpan="999">
                {subtitle}
            </TableCell>
        </TableRow>
    </>
)

SubSectionLayout.propTypes = {
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

const Sections2a2b2c = ({ title, subtitle, subsectionData }) => (
    <div className={styles.tableContainer}>
        <Table suppressZebraStriping className={styles.reportTable}>
            <TableHead>
                <SubSectionLayout title={title} subtitle={subtitle} />
                <TableRowHead className={styles.tableRowHead}>
                    <TableCellHead dense rowSpan="2" width="200">
                        Indicator
                    </TableCellHead>
                    <TableCellHead dense rowSpan="2" width="80">
                        Threshold
                    </TableCellHead>
                    <TableCellHead dense rowSpan="2" width="80">
                        Overall score (%)
                    </TableCellHead>
                    <TableCellHead dense colSpan="3">
                        Region with divergent score
                    </TableCellHead>
                </TableRowHead>
                <TableRowHead className={styles.tableRowHead}>
                    <TableCellHead dense width="110">
                        Number
                    </TableCellHead>
                    <TableCellHead dense width="110">
                        Percent
                    </TableCellHead>
                    <TableCellHead dense>Names</TableCellHead>
                </TableRowHead>
            </TableHead>
            <TableBody>
                {subsectionData.map((dataRow) => (
                    <TableRow key={dataRow.indicator}>
                        <TableCell dense>{dataRow.indicator}</TableCell>
                        <TableCell dense>{dataRow.threshold} SD</TableCell>
                        <TableCell dense>{dataRow.overallScore}</TableCell>
                        <TableCell dense>
                            {dataRow.divergentScores?.number}
                        </TableCell>
                        <TableCell dense>
                            {dataRow.divergentScores?.percentage}
                        </TableCell>
                        <TableCell dense>
                            {dataRow.divergentScores?.names}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
)

Sections2a2b2c.propTypes = {
    subsectionData: PropTypes.array,
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

const Section2DBlock = ({ dataRow, index }) => (
    <>
        <table>
            <tbody>
                <tr>
                    <th colSpan="2">{dataRow.name}</th>
                </tr>
                <tr>
                    <td>Expected trend</td>
                    <td>{dataRow.expectedTrend}</td>
                </tr>
                <tr>
                    <td>Compare region to</td>
                    <td>{dataRow.compareRegionTo}</td>
                </tr>
                <tr>
                    <td>Quality threshold</td>
                    <td>±{dataRow.qualityThreshold}%</td>
                </tr>
                <tr>
                    <td>Overall score</td>
                    <td>{dataRow.overallScore}%</td>
                </tr>
                <tr>
                    <td>Number of Region with divergent score</td>
                    <td>{dataRow.divergentSubOrgUnits?.number}</td>
                </tr>
                <tr>
                    <td>Percent of Region with divergent score</td>
                    <td>{dataRow.divergentSubOrgUnits?.percent}%</td>
                </tr>
                <tr>
                    <td colSpan="2">{dataRow.divergentSubOrgUnits?.names}</td>
                </tr>
            </tbody>
        </table>
        {dataRow?.chartInfo?.lineChartInfo && (
            <Chart
                sectionId={'section2d'}
                chartId={`line2d_${index}`}
                chartInfo={dataRow.chartInfo.lineChartInfo}
            />
        )}
        {dataRow?.chartInfo?.scatterChartInfo && (
            <Chart
                sectionId={'section2d'}
                chartId={`scatter2d_${index}`}
                chartInfo={dataRow.chartInfo.scatterChartInfo}
            />
        )}
    </>
)

Section2DBlock.propTypes = {
    dataRow: PropTypes.object,
    index: PropTypes.number,
}

const Section2D = ({ title, subtitle, subsectionData }) => (
    <>
        <table>
            <tbody>
                <SubSectionLayout title={title} subtitle={subtitle} />
            </tbody>
        </table>
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
    <>
        <table>
            <tbody>
                <tr>
                    <th colSpan="2">{dataRow.title}</th>
                </tr>
                <tr>
                    <td>Denominator A</td>
                    <td>{dataRow.A}</td>
                </tr>
                <tr>
                    <td>Denominator B</td>
                    <td>{dataRow.B}</td>
                </tr>
                <tr>
                    <td>Expected relationship</td>
                    <td>{dataRow.expectedRelationship}</td>
                </tr>
                <tr>
                    <td>Quality threshold</td>
                    <td>
                        {dataRow.expectedRelationship === 'Dropout rate'
                            ? ''
                            : '±'}
                        {dataRow.qualityThreshold}
                    </td>
                </tr>
                <tr>
                    <td>Overall score</td>
                    <td>{dataRow.overallScore}%</td>
                </tr>
                <tr>
                    <td>Number of Region with divergent score</td>
                    <td>{dataRow.divergentSubOrgUnits?.number}</td>
                </tr>
                <tr>
                    <td>Percent of Region with divergent score</td>
                    <td>{dataRow.divergentSubOrgUnits?.percentage}%</td>
                </tr>
                <tr>
                    <td colSpan="2">{dataRow.divergentSubOrgUnits?.names}</td>
                </tr>
            </tbody>
        </table>
        {dataRow.chartInfo && (
            <Chart
                sectionId={'section2e'}
                chartId={`chart2e_${index}`}
                chartInfo={dataRow.chartInfo}
            />
        )}
    </>
)

Section2EBlock.propTypes = {
    dataRow: PropTypes.object,
    index: PropTypes.number,
}

const Section2E = ({ title, subtitle, subsectionData }) => (
    <>
        <table>
            <tbody>
                <SubSectionLayout title={title} subtitle={subtitle} />
            </tbody>
        </table>
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
    const { loading, data, error, refetch } = useFetchSectionTwoData()

    useEffect(() => {
        const variables = {
            ...reportParameters,
            currentPeriod: reportParameters.periods[0],
        }

        refetch({ variables })
    }, [refetch, reportParameters]) // should include refetch, which needs to be made stable

    if (loading) {
        return <span>loading</span>
    }

    if (error) {
        return <span>error</span>
    }

    if (data) {
        const section2Data = calculateSection2({
            section2Response: data,
            mappedConfiguration: reportParameters.mappedConfiguration,
            periods: reportParameters.periods,
            overallOrgUnit: reportParameters.orgUnits[0],
        })
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
