import { getConfigObjectsForAnalytics } from '../../utils/getConfigObjectsForAnalytics.js'

export const getReportParameters = ({
    groupID,
    orgUnitID,
    orgUnitName,
    orgUnitLevel,
    orgUnitLevels,
    orgUnitGroups,
    orgUnitGroup,
    boundaryOrgUnitLevel,
    configurations,
    periods,
    disaggregationType,
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

    //TODO: work on this when org unit group is selected. this seems to be used in section 3 and 4 only.
    const orgUnitLevelNamesByLevel = new Map()
    orgUnitLevels.forEach(({ level, displayName }) => {
        orgUnitLevelNamesByLevel.set(level, displayName)
    })

    const reportParameters = {
        orgUnits: [orgUnitID],
        orgUnitName: orgUnitName,
        orgUnitLevelNumber: orgUnitLevel?.level,
        orgUnitLevelName:
            orgUnitLevel?.displayName || orgUnitGroup?.displayName, //TODO: u might need to update the name of this variable (orgUnitLevelName) to orgUnitLevelGroupName
        orgUnitLevelNamesByLevel,
        boundaryOrgUnitLevel,
        groupID: groupID,
        periods,
        mappedConfiguration,
        disaggregationType,
        orgUnitLevel:
            disaggregationType === 'level' && orgUnitLevel
                ? `LEVEL-${orgUnitLevel.level}`
                : null,
        orgUnitGroup:
            disaggregationType === 'group' && orgUnitGroup
                ? `OU_GROUP-${orgUnitGroup.id}`
                : null,
    }
    return reportParameters
}
