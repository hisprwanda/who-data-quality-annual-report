import React, { useState } from 'react'
import { ReportData } from '../../components/annual-report/report-data/ReportData.js'
import MenuBar from '../../components/menu-bar/MenuBar.js'
import { ReportParameterSelector } from '../../components/report-parameter-selector/index.js'

const Report = () => {
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

const ReportContainer = () => {
    return (
        <>
            <MenuBar />
            <Report />
        </>
    )
}

export default ReportContainer
