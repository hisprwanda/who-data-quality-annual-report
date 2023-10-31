import { getConfigObjectsForAnalytics } from '../../utils/utils.js'

export const getReportParameters = ({
    groupID,
    orgUnitID,
    orgUnitLevel,
    boundaryOrgUnitLevel,
    configuration,
    periods,
}) => {
    if (
        !orgUnitID ||
        !groupID ||
        !configuration ||
        !orgUnitLevel ||
        periods.length === 0 ||
        !boundaryOrgUnitLevel
    ) {
        return {}
    }

    const mappedConfiguration = getConfigObjectsForAnalytics(
        configuration,
        groupID
    )

    const reportParameters = {
        dataSets: Object.keys(mappedConfiguration.dataSets),
        dataElements: Object.keys(
            mappedConfiguration.dataElementsAndIndicators
        ),
        orgUnits: [orgUnitID],
        orgUnitLevel: `LEVEL-${orgUnitLevel}`,
        orgUnitLevelNumber: orgUnitLevel,
        boundaryOrgUnitLevel,
        groupID: groupID,
        // note that `periods[0]` is the current period
        periods,
        mappedConfiguration,
    }
    return reportParameters
}