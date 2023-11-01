import React, { useState } from 'react'
import { ReportData } from '../components/annual-report/ReportData.js'
import { ReportParameterSelector } from '../components/report-parameter-selector/index.js'

export const AnnualReport = () => {
    const [reportParameters, setReportParameters] = useState({})

    return (
        <>
            <ReportParameterSelector
                setReportParameters={setReportParameters}
            />
            <ReportData reportParameters={reportParameters} />
        </>
    )
}
