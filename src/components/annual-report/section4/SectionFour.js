import { TableBody, TableHead, TableRow } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { LoadingSpinner } from '../../common/LoadingSpinner.js'
import { Chart } from '../Chart.js'
import {
    ReportCell,
    ReportCellHead,
    ReportRowHead,
    ReportTable,
} from '../ReportTable.js'
import styles from './SectionFour.module.css'
import { useSectionFourData } from './useSectionFourData.js'

const sectionInformation = {
    section4a: {
        title: '4a: Consistency with UN population projection',
    },
    section4b: {
        title: '4b: Consistency of denominators',
        subtitle: 'Consistency of denominators within the same year',
    },
}

const SubSectionLayout = ({ title, subtitle }) => (
    <>
        <ReportRowHead>
            <ReportCellHead colSpan="6">{title}</ReportCellHead>
        </ReportRowHead>
        {subtitle && (
            <TableRow>
                <ReportCell colSpan="6" className={styles.subsectionSubtitle}>
                    {subtitle}
                </ReportCell>
            </TableRow>
        )}
    </>
)

SubSectionLayout.propTypes = {
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

const Section4A = ({ title, subtitle, subsectionData }) => (
    <ReportTable className={styles.section4a}>
        <TableHead>
            <SubSectionLayout title={title} subtitle={subtitle} />
        </TableHead>

        <TableBody>
            {subsectionData
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((dataRow) => (
                    <TableRow key={dataRow.name}>
                        <ReportCell>{dataRow.name}</ReportCell>
                        <ReportCell>{dataRow.value}</ReportCell>
                    </TableRow>
                ))}
        </TableBody>
    </ReportTable>
)

Section4A.propTypes = {
    subsectionData: PropTypes.array,
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

const Section4B = ({ title, subtitle, subsectionData }) => (
    <>
        <ReportTable className={styles.marginBottom4}>
            <TableHead>
                <SubSectionLayout title={title} subtitle={subtitle} />
            </TableHead>
        </ReportTable>
        {subsectionData
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((dataRow, index) => {
                return (
                    <div className={styles.section4bGrid} key={dataRow.name}>
                        <ReportTable>
                            <TableHead>
                                <ReportRowHead>
                                    <ReportCellHead colSpan="2">
                                        {dataRow.name}
                                    </ReportCellHead>
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
                                    <ReportCell>Quality threshold</ReportCell>
                                    <ReportCell>
                                        ±{dataRow.qualityThreshold}%
                                    </ReportCell>
                                </TableRow>
                                <TableRow>
                                    <ReportCell>Overall score</ReportCell>
                                    <ReportCell>
                                        {dataRow.overallScore}%
                                    </ReportCell>
                                </TableRow>
                                <TableRow>
                                    <ReportCell>
                                        # Region with poor score
                                    </ReportCell>
                                    <ReportCell>
                                        {dataRow.divergentSubOrgUnits?.number}
                                    </ReportCell>
                                </TableRow>
                                <TableRow>
                                    <ReportCell>
                                        % Region with poor score
                                    </ReportCell>
                                    <ReportCell>
                                        {
                                            dataRow.divergentSubOrgUnits
                                                ?.percentage
                                        }
                                        %
                                    </ReportCell>
                                </TableRow>
                                <TableRow>
                                    <ReportCell colSpan="2">
                                        {dataRow.divergentSubOrgUnits?.names}
                                    </ReportCell>
                                </TableRow>
                            </TableBody>
                        </ReportTable>
                        <Chart
                            sectionId={'section4'}
                            chartId={`chart${index}`}
                            chartInfo={dataRow.chartInfo}
                            className={styles.section4bChart}
                        />
                    </div>
                )
            })}
    </>
)

Section4B.propTypes = {
    subsectionData: PropTypes.array,
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

export const SectionFour = ({ reportParameters }) => {
    const { loading, data: section4Data, error, refetch } = useSectionFourData()

    useEffect(() => {
        const variables = {
            ...reportParameters,
            currentPeriod: reportParameters.periods[0],
        }
        refetch({ variables })
    }, [refetch, reportParameters])

    if (loading) {
        return <LoadingSpinner noLayer={true} />
    }

    if (error) {
        return <span>error</span>
    }

    if (section4Data) {
        return (
            <>
                <Section4A
                    title={sectionInformation.section4a.title}
                    subtitle={sectionInformation.section4a.subtitle}
                    subsectionData={section4Data.section4a}
                />
                <Section4B
                    title={sectionInformation.section4b.title}
                    subtitle={sectionInformation.section4b.subtitle}
                    subsectionData={section4Data.section4b}
                />
            </>
        )
    }

    return null
}

SectionFour.propTypes = {
    reportParameters: PropTypes.object,
}
