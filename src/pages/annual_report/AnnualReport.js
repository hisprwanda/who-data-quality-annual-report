import React, { useState } from 'react'
import { ReportData } from '../../components/annual-report/report-data/ReportData.js'
import { ReportParameterSelector } from '../../components/report-parameter-selector/index.js'

const AnnualReport = () => {
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

export default AnnualReport
