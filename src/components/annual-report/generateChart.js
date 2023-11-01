import H from 'highcharts'
import HB from 'highcharts/modules/bullet'
//import { generateSection3Chart } from './section3/section3ChartGenerator.js'
import { generateSection4Chart } from './report-data/section4/section4ChartGenerator.js'

// init Highcharts
// eslint-disable-next-line max-params
H.SVGRenderer.prototype.symbols.plus = (x, y, w, h) => [
    'M',
    x,
    y + (5 * h) / 8,
    'L',
    x,
    y + (3 * h) / 8,
    'L',
    x + (3 * w) / 8,
    y + (3 * h) / 8,
    'L',
    x + (3 * w) / 8,
    y,
    'L',
    x + (5 * w) / 8,
    y,
    'L',
    x + (5 * w) / 8,
    y + (3 * h) / 8,
    'L',
    x + w,
    y + (3 * h) / 8,
    'L',
    x + w,
    y + (5 * h) / 8,
    'L',
    x + (5 * w) / 8,
    y + (5 * h) / 8,
    'L',
    x + (5 * w) / 8,
    y + h,
    'L',
    x + (3 * w) / 8,
    y + h,
    'L',
    x + (3 * w) / 8,
    y + (5 * h) / 8,
    'L',
    x,
    y + (5 * h) / 8,
    'z',
]
HB(H)

export const generateChart = (sectionId, canvasId, chartInfo) => {
    let chartConfig

    switch (sectionId) {
        case 'section3': {
            //generateSection3Chart(canvasId, chartInfo)
            break
        }
        case 'section4': {
            chartConfig = generateSection4Chart(canvasId, chartInfo)
            break
        }
    }

    console.log('chartconfig', chartConfig)
    return new H.Chart({
        accessibility: {
            enabled: false,
        },
        credits: {
            enabled: false,
        },
        exporting: {
            enabled: false,
        },
        title: {
            text: null,
        },

        // specific settings
        ...chartConfig,
    })
}
