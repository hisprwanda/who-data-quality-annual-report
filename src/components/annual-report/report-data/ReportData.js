import PropTypes from 'prop-types'
import React from 'react'

export const ReportData = ({reportParameters}) => {
    if (Object.keys(reportParameters).length===0) {
        return null
    }
    return <span>{JSON.stringify(reportParameters)}</span>
}

ReportData.propTypes = {
    reportParameters: PropTypes.object,
}