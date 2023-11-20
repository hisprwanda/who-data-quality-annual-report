import PropTypes from 'prop-types'
import React from 'react'
import { NoDataInfoBox } from './common/Warnings.js'
import styles from './ReportData.module.css'
import { SectionOne } from './section1/SectionOne.js'
import { SectionTwo } from './section2/SectionTwo.js'
import { SectionThree } from './section3/SectionThree.js'
import { SectionFour } from './section4/SectionFour.js'

const SectionLayout = ({ title, children }) => (
    <div>
        <div className={styles.sectionHeading}>{title.toUpperCase()}</div>
        {children}
    </div>
)

SectionLayout.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
}

export const ReportData = ({ reportParameters }) => {
    if (Object.keys(reportParameters).length === 0) {
        return null
    }

    const isSectionOneEmpty =
        !Object.keys(
            reportParameters.mappedConfiguration.dataElementsAndIndicators
        ).length ||
        !Object.keys(reportParameters.mappedConfiguration.dataSets).length

    return (
        <div className={styles.reportContainer}>
            <SectionLayout title="Domain 1 - Completeness of Reporting">
                {isSectionOneEmpty ? (
                    <NoDataInfoBox subsection={false} />
                ) : (
                    <SectionOne reportParameters={reportParameters} />
                )}
            </SectionLayout>
            <SectionLayout title="Domain 2 - Internal Consistency of Reported Data">
                <SectionTwo reportParameters={reportParameters} />
            </SectionLayout>
            <SectionLayout title="Domain 3 - External Comparison">
                {reportParameters?.mappedConfiguration?.externalRelations
                    ?.length > 0 ? (
                    <SectionThree reportParameters={reportParameters} />
                ) : (
                    <NoDataInfoBox subsection={false} />
                )}
            </SectionLayout>
            <SectionLayout title="Domain 4 - Consistency of Population Data">
                {reportParameters?.mappedConfiguration?.denominatorRelations
                    ?.length > 0 ? (
                    <SectionFour reportParameters={reportParameters} />
                ) : (
                    <NoDataInfoBox subsection={false} />
                )}
            </SectionLayout>
        </div>
    )
}

ReportData.propTypes = {
    reportParameters: PropTypes.object,
}
