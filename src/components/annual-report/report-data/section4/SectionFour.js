import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { calculateSection4 } from './section4Calculations.js'
import { useFetchSectionFourData } from './useFetchSectionFourData.js'

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

const Section4A = ({ title, subtitle, subsectionData }) => (
    <>
        <table>
            <thead>
                <SubSectionLayout title={title} subtitle={subtitle} />
            </thead>

            <tbody>
                {subsectionData
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((dataRow) => (
                        <tr key={dataRow.name}>
                            <td>{dataRow.name}</td>
                            <td>{dataRow.value}</td>
                        </tr>
                    ))}
            </tbody>
        </table>
    </>
)

Section4A.propTypes = {
    subsectionData: PropTypes.array,
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

const Section4B = ({ title, subtitle, subsectionData }) => (
    <>
        <table>
            <thead>
                <SubSectionLayout title={title} subtitle={subtitle} />
            </thead>
        </table>
        {subsectionData
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((dataRow) => (
                <table key={dataRow.name}>
                    <thead>
                        <tr>
                            <th>{dataRow.name}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Denominator A</td>
                            <td>{dataRow.A}</td>
                        </tr>
                        <tr>
                            <td>Denominator B</td>
                            <td>{dataRow.B}</td>
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
                            <td># Region with poor score</td>
                            <td>{dataRow.divergentSubOrgUnits?.number}</td>
                        </tr>
                        <tr>
                            <td>% Region with poor score</td>
                            <td>{dataRow.divergentSubOrgUnits?.percentage}%</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                {dataRow.divergentSubOrgUnits?.names}
                            </td>
                        </tr>
                    </tbody>
                </table>
            ))}
    </>
)

Section4B.propTypes = {
    subsectionData: PropTypes.array,
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

export const SectionFour = ({ reportParameters }) => {
    const { loading, data, error, refetch } = useFetchSectionFourData()

    useEffect(() => {
        // this is hardcoded until we address period selection
        const currentPeriod = {
            id: '2022',
            startDate: '2022-01-01',
            endDate: '2022-12-31',
        }

        const variables = {
            ...reportParameters,
            currentPeriod,
        }

        refetch({ variables })
    }, [refetch, reportParameters])

    if (loading) {
        return <span>loading</span>
    }

    if (error) {
        return <span>error</span>
    }

    if (data) {
        const section4Data = calculateSection4({
            section4Response: data,
            mappedConfiguration: reportParameters.mappedConfiguration,
            currentPeriod: reportParameters.currentPeriod,
            overallOrgUnit: reportParameters.orgUnits[0],
        })

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
