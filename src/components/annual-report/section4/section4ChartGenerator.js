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
                name: 'Orgunits',
                data: dataPoints,
                color: 'rgb(31,119,180)',
            },
            {
                type: 'line',
                name: 'A = B',
                data: [0, { x: xMax, y: xMax }],
                color: 'black',
                marker: { enabled: false },
                enableMouseTracking: false,
            },
            {
                type: 'line',
                name: `+ ${chartInfo.threshold}%`,
                data: [0, { x: xMax, y: xMax + xMaxThreshold }],
                color: 'rgb(176,176,176)',
                marker: { enabled: false },
                enableMouseTracking: false,
            },
            {
                type: 'line',
                name: `- ${chartInfo.threshold}%`,
                data: [0, { x: xMax, y: xMax - xMaxThreshold }],
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
                return `<b>${this.custom.name}</b><br />${this.custom.yLabel}: ${this.y}<br/>${this.custom.xLabel}: ${this.x}`
            },
        },
    }
}
