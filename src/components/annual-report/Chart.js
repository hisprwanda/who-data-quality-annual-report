import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { generateChart } from './generateChart.js'

export const Chart = ({ sectionId, chartId, chartInfo, className }) => {
    const canvasId = `${sectionId}-${chartId}`
    const chartRef = React.useRef()

    useEffect(() => {
        chartRef.current = generateChart(sectionId, canvasId, chartInfo)
    }, [sectionId, canvasId, chartInfo])

    useEffect(() => {
        if (!window.matchMedia) {
            return
        }
        const mql = window.matchMedia('print')
        const onChange = () => chartRef.current.reflow()
        mql.addEventListener('change', onChange)
        return () => mql.removeEventListener('change', onChange)
    }, [])

    return <div id={canvasId} className={className} />
}

Chart.propTypes = {
    chartId: PropTypes.string.isRequired,
    chartInfo: PropTypes.object.isRequired,
    sectionId: PropTypes.string.isRequired,
    className: PropTypes.string,
}
