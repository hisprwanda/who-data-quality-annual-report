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

    const mappedConfigurations = getConfigObjectsForAnalytics(
        configuration,
        groupID
    )

    // periods are hardcoded pending work on period selector
    const reportParameters = {
        dataSets: Object.keys(mappedConfigurations.dataSets),
        dataElements: Object.keys(
            mappedConfigurations.dataElementsAndIndicators
        ),
        orgUnits: [orgUnitID],
        orgUnitLevel: `LEVEL-${orgUnitLevel}`,
        groupID: groupID,
        periods: ['2022', '2021', '2020', '2019'],
        currentPeriod: '2022',
        mappedConfigurations,
    }
    return reportParameters
}
