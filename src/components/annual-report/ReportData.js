import PropTypes from 'prop-types'
import React from 'react'
import { NoDataInfoBox } from './common/NoDataWarning.js'
import styles from './ReportData.module.css'
import { SectionOne } from './section1/SectionOne.js'
import { SectionTwo } from './section2/SectionTwo.js'
import { SectionThree } from './section3/SectionThree.js'
import { SectionFour } from './section4/SectionFour.js'

const SectionLayout = ({ title, children }) => (
    <div>
        <span className={styles.sectionHeading}>{title.toUpperCase()}</span>
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

    return (
        <div className={styles.reportContainer}>
            <SectionLayout title="Domain 1 - Completeness of Reporting">
                {reportParameters.dataElements?.length > 0 ? (
                    <SectionOne reportParameters={reportParameters} />
                ) : (
                    <NoDataInfoBox subsection={false} />
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
                {reportParameters?.mappedConfiguration?.externalRelations
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
