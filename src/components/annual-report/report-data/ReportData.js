import PropTypes from 'prop-types'
import React from 'react'

export const ReportData = ({ reportParameters }) => {
    if (Object.keys(reportParameters).length === 0) {
        return null
    }
    return <pre>{JSON.stringify(reportParameters, null, 2)}</pre>
}

ReportData.propTypes = {
    reportParameters: PropTypes.object,
}
