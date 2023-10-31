import React, { useState } from 'react'
import { ReportData } from '../../components/annual-report/report-data/ReportData.js'
import { ReportParameterSelector } from '../../components/context-selection/index.js'
import MenuBar from '../../components/menu-bar/MenuBar.js'

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
