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

const generateBulletChartConfig = (canvasId, chartInfo) => {
    const data = chartInfo.values.map(({ routine, survey, name }) => ({
        y: routine,
        target: survey,
        custom: {
            name,
        },
    }))

    return {
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
                data,
            },
        ],
        tooltip: {
            headerFormat: '',
            pointFormatter: function () {
                return i18n.t(
                    '<b>{{name}}</b><br/>Survey: {{survey}}%<br/>Routine: {{routine}}%',
                    {
                        name: this.custom.name,
                        survey: this.target,
                        routine: this.y,
                    }
                )
            },
        },
    }
}

const generateScatterChartConfig = (canvasId, chartInfo) => {
    const routineSeries = {
        name: i18n.t('Routine'),
        color: 'blue',
        data: [],
    }
    const surveySeries = {
        name: i18n.t('Survey'),
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
                return i18n.t('Survey: {{survey}}%<br/>Routine: {{routine}}%', {
                    survey: this.custom.survey ?? this.y,
                    routine: this.custom.routine ?? this.y,
                })
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
