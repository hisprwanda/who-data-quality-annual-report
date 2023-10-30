import PropTypes from 'prop-types'
import React from 'react'
import { SectionTwo } from '../section3/SectionTwo.js'
import { SectionThree } from '../section3/SectionThree.js'
import { SectionFour } from './section4/SectionFour.js'
import styles from './ReportData.module.css'


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
