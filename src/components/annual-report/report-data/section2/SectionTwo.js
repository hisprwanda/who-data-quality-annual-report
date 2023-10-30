import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { calculateSection2 } from './section2Calculations.js'
import { useFetchSectionTwoData } from './useFetchSectionTwoData.js'

const sectionInformation = {
    section2a: {
        title: '2a: Extreme outliers',
        subtitle:
            'Extreme outliers, using the standard method. Threshold denotes the number of standard deviations from the mean. Region are counted as divergent if they have one or more extreme outliers for an indicator.',
    },
    section2b: {
        title: '2a: Moderate outliers',
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
        <tr>
            <th colSpan="6">{title}</th>
        </tr>
        <tr>
            <th colSpan="6">{subtitle}</th>
        </tr>
    </>
)

SubSectionLayout.propTypes = {
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

const Sections2a2b2c = ({ title, subtitle, subsectionData }) => (
    <table>
        <tbody>
            <SubSectionLayout title={title} subtitle={subtitle} />
            <tr>
                {' '}
                <th rowSpan="2" width="200">
                    Indicator
                </th>{' '}
                <th rowSpan="2" width="80">
                    Threshold
                </th>{' '}
                <th rowSpan="2" width="80">
                    Overall score (%)
                </th>{' '}
                <th colSpan="3">Region with divergent score</th>{' '}
            </tr>
            <tr>
                {' '}
                <th width="110">Number</th> <th width="110">Percent</th>{' '}
                <th>Names</th>{' '}
            </tr>
            {subsectionData
                .sort((a, b) => a.indicator.localeCompare(b.indicator))
                .map((dataRow) => (
                    <tr key={dataRow.indicator}>
                        <td>{dataRow.indicator}</td>
                        <td>{dataRow.threshold} SD</td>
                        <td>{dataRow.overallScore}</td>
                        <td>{dataRow.divergentScores?.number}</td>
                        <td>{dataRow.divergentScores?.percentage}</td>
                        <td>{dataRow.divergentScores?.names}</td>
                    </tr>
                ))}
        </tbody>
    </table>
)

Sections2a2b2c.propTypes = {
    subsectionData: PropTypes.object,
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

const Section2DBlock = ({ dataRow }) => (
    <div>
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
    </div>
)

Section2DBlock.propTypes = {
    dataRow: PropTypes.object,
}

const Section2D = ({ title, subtitle, subsectionData }) => (
    <>
        <table>
            <tbody>
                <SubSectionLayout title={title} subtitle={subtitle} />
            </tbody>
        </table>
        {subsectionData
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((dataRow) => (
                <Section2DBlock key={dataRow.name} dataRow={dataRow} />
            ))}
    </>
)

Section2D.propTypes = {
    subsectionData: PropTypes.object,
    subtitle: PropTypes.string,
    title: PropTypes.string,
}

const Section2EBlock = ({ dataRow }) => (
    <div>
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
                <td>±{dataRow.expectedRelationship}</td>
            </tr>
            <tr>
                <td>Quality threshold</td>
                <td>±{dataRow.qualityThreshold}</td>
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
    </div>
)

Section2EBlock.propTypes = {
    dataRow: PropTypes.object,
}

const Section2E = ({ title, subtitle, subsectionData }) => (
    <>
        <table>
            <tbody>
                <SubSectionLayout title={title} subtitle={subtitle} />
            </tbody>
        </table>
        {subsectionData
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((dataRow) => (
                <Section2EBlock key={dataRow.title} dataRow={dataRow} />
            ))}
    </>
)

Section2E.propTypes = {
    subsectionData: PropTypes.object,
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
    }, [reportParameters]) // should include refetch, which needs to be made stable

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
