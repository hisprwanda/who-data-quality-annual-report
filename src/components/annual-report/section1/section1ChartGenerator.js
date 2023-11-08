import i18n from '@dhis2/d2-i18n'

export const generateSection1Chart = (canvasId, chartInfo) => {
    const series = chartInfo.values.map(({ points, name }) => ({
        name,
        data: points,
    }))

    return {
        chart: {
            renderTo: canvasId,
            type: 'line',
        },
        series,
        xAxis: [{ categories: chartInfo.x }],
        yAxis: [
            {
                min: 0,
                softMax: 100,
                title: {
                    text: i18n.t('% Completeness'),
                },
            },
        ],
        title: {
            text: i18n.t('Reporting completeness over time'),
        },
    }
}
