import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { Chart } from '../Chart.js'
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
        <tr>
            <th colSpan="6">{title}</th>
        </tr>
        {subtitle && (
            <tr>
                <th colSpan="6">{subtitle}</th>
            </tr>
        )}
    </>
)

SubSectionLayout.propTypes = {
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

const Section3A = ({ title, subtitle, subsectionData }) => (
    <>
        <table>
            <thead>
                <SubSectionLayout title={title} subtitle={subtitle} />
            </thead>
        </table>
        {subsectionData
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((dataRow, index) => {
                return (
                    <React.Fragment key={dataRow.name}>
                        <table>
                            <thead>
                                <tr>
                                    <th>{dataRow.name}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Survey value</td>
                                    <td>{dataRow.surveyValue}%</td>
                                </tr>
                                <tr>
                                    <td>Routine value</td>
                                    <td>{dataRow.routineValue}%</td>
                                </tr>
                                <tr>
                                    <td>Quality threshold</td>
                                    <td>± {dataRow.qualityThreshold}%</td>
                                </tr>
                                <tr>
                                    <td>Overall score</td>
                                    <td>{dataRow.overallScore}%</td>
                                </tr>
                                <tr>
                                    <td>
                                        Number of Region with divergent score
                                    </td>
                                    <td>
                                        {isNotMissing(
                                            dataRow.divergentSubOrgUnits?.number
                                        )
                                            ? dataRow.divergentSubOrgUnits
                                                  ?.number
                                            : 'Not available'}
                                    </td>
                                </tr>
                                <tr>
                                    <td>% Region with poor score</td>
                                    <td>
                                        {isNotMissing(
                                            dataRow.divergentSubOrgUnits
                                                ?.percentage
                                        )
                                            ? dataRow.divergentSubOrgUnits
                                                  ?.percentage + '%'
                                            : 'Not available'}
                                    </td>
                                </tr>
                                {dataRow.divergentSubOrgUnits?.names?.length >
                                    0 && (
                                    <tr>
                                        <td colSpan="2">
                                            {
                                                dataRow.divergentSubOrgUnits
                                                    ?.names
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Chart
                            sectionId={'section3'}
                            chartId={`chart${index}`}
                            chartInfo={dataRow.chartInfo}
                        />
                    </React.Fragment>
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
        return <span>loading</span>
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
