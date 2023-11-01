import i18n from '@dhis2/d2-i18n'
import H from 'highcharts'

export const generateSection3Chart = (canvasId, chartInfo) => {
    let chartConfig

    switch (chartInfo.type) {
        case 'bullet':
            chartConfig = generateBulletChartConfig(canvasId, chartInfo)
            break
        case 'scatter':
            chartConfig = generateScatterChartConfig(canvasId, chartInfo)
            break
        default:
            chartConfig = {
                chart: {
                    renderTo: canvasId,
                },
                lang: {
                    noData: i18n.t('Chart not available'),
                },
            }
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

const generateBulletChartConfig = (canvasId, chartInfo) => ({
    chart: {
        renderTo: canvasId,
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
                    custom: {
                        name: chartInfo.values[0].name,
                    },
                },
            ],
        },
    ],
    tooltip: {
        headerFormat: '',
        pointFormatter: function () {
            return `<b>${this.custom.name}</b><br/>Survey: ${this.target}%<br/>Routine: ${this.y}%`
        },
    },
})

const generateScatterChartConfig = (canvasId, chartInfo) => {
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

    chartInfo.values
        .filter(({ invalid }) => !invalid)
        .forEach(({ routine, survey, divergent }) => {
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
            renderTo: canvasId,
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
