import { getConfigObjectsForAnalytics } from '../../utils/getConfigObjectsForAnalytics.js'

export const getReportParameters = ({
    groupID,
    orgUnitID,
    orgUnitLevel,
    orgUnitLevels,
    boundaryOrgUnitLevel,
    configurations,
    periods,
}) => {
    if (
        !orgUnitID ||
        !groupID ||
        !configurations ||
        !orgUnitLevel ||
        periods.length === 0 ||
        !boundaryOrgUnitLevel
    ) {
        return {}
    }

    const mappedConfiguration = getConfigObjectsForAnalytics(
        configurations,
        groupID
    )

    const reportParameters = {
        orgUnits: [orgUnitID],
        // selected org unit level info
        orgUnitLevel: `LEVEL-${orgUnitLevel.level}`,
        orgUnitLevelNumber: orgUnitLevel.level,
        orgUnitLevelName: orgUnitLevel.displayName,
        // all org unit levels, if needed for mapping:
        orgUnitLevels,
        boundaryOrgUnitLevel,
        groupID: groupID,
        // note that `periods[0]` is the current period
        periods,
        mappedConfiguration,
    }
    return reportParameters
}
