import i18n from '@dhis2/d2-i18n'

export const generateSection4Chart = (canvasId, chartInfo) => {
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
                xLabel: chartInfo.x,
                yLabel: chartInfo.y,
            },
        }))

    const xMax = Math.max(...dataPoints.flatMap(({ x }) => x))
    const xMaxThreshold = (xMax / 100) * chartInfo.threshold

    return {
        chart: {
            renderTo: canvasId,
            type: 'scatter',
        },
        series: [
            {
                name: i18n.t('Orgunits'),
                data: dataPoints,
                color: 'rgb(31,119,180)',
            },
            {
                type: 'line',
                name: 'A = B',
                data: dataPoints.length ? [0, { x: xMax, y: xMax }] : [],
                color: 'black',
                marker: { enabled: false },
                enableMouseTracking: false,
            },
            {
                type: 'line',
                name: `+ ${chartInfo.threshold}%`,
                data: dataPoints.length
                    ? [0, { x: xMax, y: xMax + xMaxThreshold }]
                    : [],
                color: 'rgb(176,176,176)',
                marker: { enabled: false },
                enableMouseTracking: false,
            },
            {
                type: 'line',
                name: `- ${chartInfo.threshold}%`,
                data: dataPoints.length
                    ? [0, { x: xMax, y: xMax - xMaxThreshold }]
                    : [],
                color: 'rgb(176,176,176)',
                marker: { enabled: false },
                enableMouseTracking: false,
            },
        ],
        xAxis: [
            {
                min: 0,
                title: {
                    text: chartInfo.x,
                },
            },
        ],
        yAxis: [
            {
                min: 0,
                title: {
                    text: chartInfo.y,
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
                    }
                )
            },
        },
    }
}
