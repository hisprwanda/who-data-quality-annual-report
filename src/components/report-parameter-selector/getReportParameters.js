import { getConfigObjectsForAnalytics } from '../../utils/getConfigObjectsForAnalytics.js'

export const getReportParameters = ({
    groupID,
    orgUnitID,
    orgUnitName,
    orgUnitLevel,
    orgUnitLevels,
    orgUnitGroup,
    boundaryOrgUnitLevel,
    configurations,
    periods,
}) => {
    if (
        !orgUnitID ||
        !groupID ||
        !configurations ||
        (!orgUnitLevel && !orgUnitGroup) ||
        periods.length === 0 ||
        !boundaryOrgUnitLevel
    ) {
        return {}
    }

    const mappedConfiguration = getConfigObjectsForAnalytics(
        configurations,
        groupID
    )

    const orgUnitLevelNamesByLevel = new Map()
    orgUnitLevels.forEach(({ level, displayName }) => {
        orgUnitLevelNamesByLevel.set(level, displayName)
    })

    const reportParameters = {
        orgUnits: [orgUnitID],
        orgUnitName: orgUnitName,
        orgUnitLevelNumber: orgUnitLevel?.level,
        orgUnitLevelName: orgUnitLevel?.displayName,
        orgUnitLevelNamesByLevel,
        boundaryOrgUnitLevel,
        groupID: groupID,
        periods,
        mappedConfiguration,
        orgUnitLevel: orgUnitLevel ? `OU_LEVEL-${orgUnitLevel.level}` : null,
        orgUnitGroup: orgUnitGroup ? `OU_GROUP-${orgUnitGroup.id}` : null,
    }
    return reportParameters
}
