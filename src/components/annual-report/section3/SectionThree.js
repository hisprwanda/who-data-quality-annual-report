import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { calculateSection3 } from './section3Calculations.js'
import { generateChart } from './section3ChartGenerator.js'
import { useFetchSectionThreeData } from './useFetchSectionThreeData.js'

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

const Chart = ({ chartId, chartInfo }) => {
    useEffect(() => {
        generateChart(chartId, chartInfo)
    }, [chartId, chartInfo])

    return <div id={chartId} />
}

Chart.propTypes = {
    chartId: PropTypes.string.isRequired,
    chartInfo: PropTypes.object.isRequired,
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
                const chartId = `section3a-chart${index}`

                return (
                    <>
                        <table key={dataRow.name}>
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
                            chartId={chartId}
                            chartInfo={dataRow.chartInfo}
                        />
                    </>
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
    const { loading, data, error, refetch } = useFetchSectionThreeData()

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

    if (data) {
        const section3Data = calculateSection3({
            section3Response: data,
            mappedConfiguration: reportParameters.mappedConfiguration,
            currentPeriod: reportParameters.periods[0],
            overallOrgUnit: reportParameters.orgUnits[0],
        })

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
