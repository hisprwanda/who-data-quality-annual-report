import PropTypes from 'prop-types'
import React from 'react'
import { SectionTwo } from './section2/SectionTwo.js'
import styles from './ReportData.module.css'

const SectionLayout = ({title, children}) => (
    <div>
        <span className={styles.sectionHeading}>{title.toUpperCase()}</span>
        {children}
    </div>
)

export const ReportData = ({reportParameters}) => {
    if (Object.keys(reportParameters).length===0) {
        return null
    }

    return (
        // <>{JSON.stringify(reportParameters.mappedConfigurations)}</>
        <div className={styles.reportContainer}>
            <SectionLayout title='Domain 2 - Internal consistency of reported data'>
                <SectionTwo reportParameters={reportParameters}/>
            </SectionLayout>
        </div>
    ) 
}

ReportData.propTypes = {
    reportParameters: PropTypes.object,
}