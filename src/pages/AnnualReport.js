import React, { useState } from 'react'
import { NoMappingsWarning } from '../components/annual-report/common/index.js'
import { ReportData } from '../components/annual-report/ReportData.js'
import { ReportParameterSelector } from '../components/report-parameter-selector/index.js'
import { useConfigurations, checkNumeratorMappings } from '../utils/index.js'
import styles from './AnnualReport.module.css'

export const AnnualReport = () => {
    const [reportParameters, setReportParameters] = useState({})
    const configurations = useConfigurations()

    const areConfigurationsUnmapped = !checkNumeratorMappings(configurations)

    return (
        <>
            <ReportParameterSelector
                setReportParameters={setReportParameters}
            />
            {areConfigurationsUnmapped ? (
                <div className={styles.warningContainer}>
                    <NoMappingsWarning />
                </div>
            ) : (
                <ReportData reportParameters={reportParameters} />
            )}
        </>
    )
}
