import H from 'highcharts'
import HB from 'highcharts/modules/bullet'

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

export const generateChart = (chartId, chartInfo) => {
    let chartConfig

    switch (chartInfo.type) {
        case 'bullet':
            chartConfig = generateBulletChartConfig(chartId, chartInfo)
            break
        case 'scatter':
            chartConfig = generateScatterChartConfig(chartId, chartInfo)
            break
    }

    return new H.Chart({
        // global settings
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

const generateBulletChartConfig = (chartId, chartInfo) => ({
    chart: {
        renderTo: chartId,
        type: 'bullet',
        inverted: true,
        height: 115,
    },
    legend: {
        enabled: false,
    },
    xAxis: {
        categories: [chartInfo.name],
    },
    yAxis: {
        gridLineWidth: 0,
        plotBands: [
            {
                from: 0,
                to: 100,
                color: '#bababa',
            },
        ],
        title: null,
    },
    series: [
        {
            color: '#1f77b4',
            borderWidth: 0,
            data: [
                {
                    y: chartInfo.values[0].routine,
                    target: chartInfo.values[0].survey,
                },
            ],
        },
    ],
    tooltip: {
        headerFormat: '<b>National</b><br/>',
        pointFormat: 'Survey: {point.target}%<br/>Routine: {point.y}%',
    },
})

const generateScatterChartConfig = (chartId, chartInfo) => {
    const routineSeries = {
        name: 'Routine',
        color: 'blue',
        data: [],
    }
    const surveySeries = {
        name: 'Survey',
        color: 'red',
        data: [],
    }

    chartInfo.values.forEach(({ routine, survey, divergent }) => {
        routineSeries.data.push({
            y: routine,
            custom: {
                survey,
            },
            marker: {
                symbol: divergent ? 'triangle' : 'plus',
            },
        })

        surveySeries.data.push({
            y: survey,
            custom: {
                routine,
            },
            marker: {
                symbol: divergent ? 'triangle-down' : 'circle',
            },
        })
    })

    return {
        chart: {
            renderTo: chartId,
            type: 'scatter',
        },
        xAxis: {
            categories: chartInfo.values.map(({ name }) => name),
        },
        yAxis: {
            title: {
                enabled: false,
            },
            min: 0,
            softMax: 100,
        },
        series: [routineSeries, surveySeries],
        tooltip: {
            headerFormat: '<b>{point.key}</b><br/>',
            pointFormatter: function () {
                return `Survey: ${(this.custom.survey ??=
                    this.y)}%<br/>Routine: ${(this.custom.routine ??= this.y)}%`
            },
        },
        plotOptions: {
            series: {
                marker: {
                    symbol: 'circle',
                },
            },
        },
    }
}
