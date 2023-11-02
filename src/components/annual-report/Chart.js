import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { generateChart } from './generateChart.js'

export const Chart = ({ sectionId, chartId, chartInfo }) => {
    const canvasId = `${sectionId}-${chartId}`

    useEffect(() => {
        generateChart(sectionId, canvasId, chartInfo)
    }, [sectionId, canvasId, chartInfo])

    return <div id={canvasId} />
}

Chart.propTypes = {
    chartId: PropTypes.string.isRequired,
    chartInfo: PropTypes.object.isRequired,
    sectionId: PropTypes.string.isRequired,
}
