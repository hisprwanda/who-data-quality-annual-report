import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { generateChart } from './generateChart.js'

export const Chart = ({ sectionId, chartId, chartInfo, className }) => {
    const canvasId = `${sectionId}-${chartId}`
    const chartRef = React.useRef()

    useEffect(() => {
        chartRef.current = generateChart(sectionId, canvasId, chartInfo)
    }, [sectionId, canvasId, chartInfo])

    // Make sure to reflow charts on print so that they are the right size
    // on the print page (otherwise they can end up too big or too small).
    // NB! This only works for the browser's print controls (Ctrl-P or
    // File->Print). `window.print()` blocks JS so this won't work. That case
    // is handled by resizing the report and waiting for charts to reflow on
    // their own before calling `window.print()` (see pages/AnnualReport.js)
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
