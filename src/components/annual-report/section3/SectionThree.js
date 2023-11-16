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
import styles from './SectionThree.module.css'
import { useSectionThreeData } from './useSectionThreeData.js'

const isNotMissing = (val) => val !== undefined && val !== null

const sectionInformation = {
    section3a: {
        title: '3a: Comparison with external/survey data',
        subtitle:
            'Consistency of routine data with data from external source, e.g. population-based surveys.',
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

const Section3A = ({ title, subtitle, subsectionData }) => (
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
                    <div className={styles.section3Grid} key={dataRow.name}>
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
                                    <ReportCell>Survey value</ReportCell>
                                    <ReportCell>
                                        {dataRow.surveyValue}%
                                    </ReportCell>
                                </TableRow>
                                <TableRow>
                                    <ReportCell>Routine value</ReportCell>
                                    <ReportCell>
                                        {dataRow.routineValue}%
                                    </ReportCell>
                                </TableRow>
                                <TableRow>
                                    <ReportCell>Quality threshold</ReportCell>
                                    <ReportCell>
                                        ± {dataRow.qualityThreshold}%
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
                                        Number of Region with divergent score
                                    </ReportCell>
                                    <ReportCell>
                                        {isNotMissing(
                                            dataRow.divergentSubOrgUnits?.number
                                        )
                                            ? dataRow.divergentSubOrgUnits
                                                  ?.number
                                            : 'Not available'}
                                    </ReportCell>
                                </TableRow>
                                <TableRow>
                                    <ReportCell>
                                        % Region with poor score
                                    </ReportCell>
                                    <ReportCell>
                                        {isNotMissing(
                                            dataRow.divergentSubOrgUnits
                                                ?.percentage
                                        )
                                            ? dataRow.divergentSubOrgUnits
                                                  ?.percentage + '%'
                                            : 'Not available'}
                                    </ReportCell>
                                </TableRow>
                                {dataRow.divergentSubOrgUnits?.names?.length >
                                    0 && (
                                    <TableRow>
                                        <ReportCell colSpan="2">
                                            {
                                                dataRow.divergentSubOrgUnits
                                                    ?.names
                                            }
                                        </ReportCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </ReportTable>
                        <Chart
                            sectionId={'section3'}
                            chartId={`chart${index}`}
                            chartInfo={dataRow.chartInfo}
                            className={styles.section3Chart}
                        />
                    </div>
                )
            })}
    </>
)

Section3A.propTypes = {
    subsectionData: PropTypes.array,
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

export const SectionThree = ({ reportParameters }) => {
    const {
        loading,
        data: section3Data,
        error,
        refetch,
    } = useSectionThreeData()

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
        return <span>{error?.message}</span>
    }

    if (section3Data) {
        return (
            <Section3A
                title={sectionInformation.section3a.title}
                subtitle={sectionInformation.section3a.subtitle}
                subsectionData={section3Data.section3a}
            />
        )
    }

    return null
}

SectionThree.propTypes = {
    reportParameters: PropTypes.object,
}
