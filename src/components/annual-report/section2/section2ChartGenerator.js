import i18n from '@dhis2/d2-i18n'

export const generateSection2Chart = (canvasId, chartInfo) => {
    switch (chartInfo.type) {
        case 'line':
            return generateLineChartConfig(canvasId, chartInfo)
        case 'scatter':
            return generateScatterChartConfig(canvasId, chartInfo)
        case 'column':
            return generateColumnChartConfig(canvasId, chartInfo)
    }
}

const generateLineChartConfig = (canvasId, chartInfo) => ({
    chart: {
        renderTo: canvasId,
        type: 'line',
    },
    series: [
        {
            name: chartInfo.xPointLabel,
            data: chartInfo.y,
        },
    ],
    xAxis: {
        categories: chartInfo.x,
    },
    yAxis: {
        title: {
            text: undefined,
        },
    },
    legend: {
        enabled: false,
    },
})

const generateColumnChartConfig = (canvasId, chartInfo) => {
    const categories = []
    const data = []

    chartInfo.values
        .filter(({ invalid }) => !invalid)
        .forEach(({ value, name }) => {
            categories.push(name)
            data.push({
                y: value,
                custom: {
                    name,
                },
            })
        })

    return {
        chart: {
            renderTo: canvasId,
            type: 'column',
        },
        series: [
            {
                data,
                color: 'rgb(87,153,199)',
                negativeColor: 'rgb(255,62,64)',
            },
        ],
        xAxis: {
            categories,
        },
        yAxis: {
            title: {
                text: i18n.t('Dropout rate (%)'),
            },
        },
        legend: {
            enabled: false,
        },
        tooltip: {
            headerFormat: '',
            pointFormatter: function () {
                return i18n.t('<b>{{name}}</b><br/>{{value}}% dropout', {
                    name: this.custom.name,
                    value: this.y,
                })
            },
        },
    }
}

const generateScatterChartConfig = (canvasId, chartInfo) => {
    const dataPoints = chartInfo.values
        .filter(({ invalid }) => !invalid)
        .map(({ x, y, divergent, name }) => ({
            x,
            y,
            marker: {
                symbol: divergent ? 'diamond' : 'circle',
            },
            custom: {
                name,
                xLabel: chartInfo.xPointLabel,
                yLabel: chartInfo.yAxisTitle,
            },
        }))

    const xMax = Math.max(...dataPoints.flatMap(({ x }) => x))
    const xMaxThreshold = xMax * (chartInfo.threshold / 100)

    const series = [
        {
            name: i18n.t('Org units'),
            data: dataPoints,
            color: 'rgb(31,119,180)',
        },
        {
            type: 'line',
            name: chartInfo.lineLabel,
            data: dataPoints.length
                ? [0, { x: xMax, y: xMax * chartInfo.slope }]
                : [],
            color: 'black',
            marker: { enabled: false },
            enableMouseTracking: false,
        },
        {
            type: 'line',
            name: `- ${chartInfo.threshold}%`,
            data: dataPoints.length
                ? [0, { x: xMax, y: (xMax - xMaxThreshold) * chartInfo.slope }]
                : [],
            color: 'rgb(176,176,176)',
            marker: { enabled: false },
            enableMouseTracking: false,
        },
    ]

    if (!chartInfo.disableTopThresholdLine) {
        series.splice(2, 0, {
            type: 'line',
            name: `+ ${chartInfo.threshold}%`,
            data: dataPoints.length
                ? [0, { x: xMax, y: (xMax + xMaxThreshold) * chartInfo.slope }]
                : [],
            color: 'rgb(176,176,176)',
            marker: { enabled: false },
            enableMouseTracking: false,
        })
    }

    return {
        chart: {
            renderTo: canvasId,
            type: 'scatter',
        },
        series,
        xAxis: [
            {
                min: 0,
                title: {
                    text: chartInfo.xAxisTitle,
                },
            },
        ],
        yAxis: [
            {
                min: 0,
                title: {
                    text: chartInfo.yAxisTitle,
                },
            },
        ],
        plotOptions: {
            series: {
                marker: {
                    symbol: 'circle',
                },
            },
        },
        tooltip: {
            headerFormat: '',
            pointFormatter: function () {
                return i18n.t(
                    '<b>{{name}}</b><br/>{{yLabel}}: {{y}}<br/>{{xLabel}}: {{x}}',
                    {
                        name: this.custom.name,
                        yLabel: this.custom.yLabel,
                        y: this.y,
                        xLabel: this.custom.xLabel,
                        x: this.x,
                        nsSeparator: '-:-',
                    }
                )
            },
        },
    }
}
