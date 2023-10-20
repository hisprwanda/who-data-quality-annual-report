import PropTypes from 'prop-types'
import React from 'react'
import styles from './ReportData.module.css'
import { SectionTwo } from './section2/SectionTwo.js'

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
            <SectionLayout title="Domain 2 - Internal consistency of reported data">
                <SectionTwo reportParameters={reportParameters} />
            </SectionLayout>
        </div>
    )
}

ReportData.propTypes = {
    reportParameters: PropTypes.object,
}
