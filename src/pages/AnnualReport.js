import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { ReportData } from '../components/annual-report/ReportData.js'

export const AnnualReport = ({ reportParameters, setIsReportPage }) => {
    useEffect(() => {
        setIsReportPage(true)
    })
    return <ReportData reportParameters={reportParameters} />
}

AnnualReport.propTypes = {
    reportParameters: PropTypes.object,
    setIsReportPage: PropTypes.bool,
}
