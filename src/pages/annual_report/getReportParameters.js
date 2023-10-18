import { getConfigObjectsForAnalytics } from '../../utils/utils.js'

export const getReportParameters = ({
    groupID,
    orgUnitID,
    orgUnitLevel,
    configuration,
}) => {
    if (!orgUnitID || !groupID || !configuration || !orgUnitLevel) {
        return {}
    }

    const mappedConfiguration = getConfigObjectsForAnalytics(
        configuration,
        groupID
    )

    // periods are hardcoded pending work on period selector
    const reportParameters = {
        dataSets: Object.keys(mappedConfiguration.dataSets),
        dataElements: Object.keys(
            mappedConfiguration.dataElementsAndIndicators
        ),
        orgUnits: [orgUnitID],
        orgUnitLevel: `LEVEL_${orgUnitLevel}`,
        groupID: groupID,
        periods: ['2022', '2021', '2020', '2019'],
        currentPeriod: '2022',
        mappedConfiguration,
    }
    return reportParameters
}
