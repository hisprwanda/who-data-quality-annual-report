import PropTypes from 'prop-types'
import React from 'react'
import { SectionTwo } from './section2/SectionTwo.js'

export const ReportData = ({reportParameters}) => {
    if (Object.keys(reportParameters).length===0) {
        return null
    }

    return (
        // <>{JSON.stringify(reportParameters.mappedConfigurations)}</>
        <SectionTwo reportParameters={reportParameters}/>
    ) 
}

ReportData.propTypes = {
    reportParameters: PropTypes.object,
}