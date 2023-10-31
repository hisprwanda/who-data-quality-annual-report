import PropTypes from 'prop-types'
import React from 'react'
import { SectionThree } from '../section3/SectionThree.js'
import styles from './ReportData.module.css'
import { SectionOne } from './section1/SectionOne.js'
import { SectionTwo } from './section2/SectionTwo.js'
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
                <SectionOne reportParameters={reportParameters} />
            </SectionLayout>
            <SectionLayout title="Domain 2 - Internal consistency of reported data">
                <SectionTwo reportParameters={reportParameters} />
            </SectionLayout>
            <SectionLayout title="Domain 3 - External Comparison">
                <SectionThree reportParameters={reportParameters} />
            </SectionLayout>
            <SectionLayout title="Domain 4 - Consistency of Population Data">
                <SectionFour reportParameters={reportParameters} />
            </SectionLayout>
        </div>
    )
}

ReportData.propTypes = {
    reportParameters: PropTypes.object,
}
