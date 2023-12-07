import React, { useState, useMemo, useCallback } from 'react'
import { NoMappingsWarning } from '../components/annual-report/common/index.js'
import { ReportData } from '../components/annual-report/ReportData.js'
import { ReportParameterSelector } from '../components/report-parameter-selector/index.js'
import { useConfigurations, checkNumeratorMappings } from '../utils/index.js'
import styles from './AnnualReport.module.css'

export const AnnualReport = () => {
    const [reportParameters, setReportParameters] = useState({})
    const [printing, setPrinting] = useState(false)
    const configurations = useConfigurations()

    const areConfigurationsUnmapped = useMemo(
        () => !checkNumeratorMappings(configurations),
        [configurations]
    )

    /**
     * This includes workarounds for using `window.print()`, which blocks JS
     * (unlike the browser File->Print control), so Highcharts can't reflow.
     * This function sets a flag so the report can resize in response, then
     * waits 1 sec to allow Highcharts to reflow before calling the print()
     * function. 1 sec seems long enough on this 2020 Macbook Pro with 6x
     * CPU slowdown using Chrome dev tools
     */
    const print = useCallback(() => {
        setPrinting(true)
        setTimeout(() => {
            window.print()
            setPrinting(false)
        }, 1000)
    }, [])

    return (
        <>
            <ReportParameterSelector
                setReportParameters={setReportParameters}
                reportParameters={reportParameters}
                printing={printing}
                onPrint={print}
            />
            {areConfigurationsUnmapped ? (
                <div className={styles.warningContainer}>
                    <NoMappingsWarning />
                </div>
            ) : (
                <ReportData
                    reportParameters={reportParameters}
                    printing={printing}
                />
            )}
        </>
    )
}
