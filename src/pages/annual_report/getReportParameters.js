import { getConfigObjectsForAnalytics } from '../../utils/utils.js'

export const getReportParameters = ({
    groupID,
    orgUnitID,
    orgUnitLevel,
    configuration,
    periods,
}) => {
    if (
        !orgUnitID ||
        !groupID ||
        !configuration ||
        !orgUnitLevel ||
        periods.length === 0
    ) {
        return {}
    }

    const mappedConfigurations = getConfigObjectsForAnalytics(
        configuration,
        groupID
    )

    const reportParameters = {
        dataSets: Object.keys(mappedConfigurations.dataSets),
        dataElements: Object.keys(
            mappedConfigurations.dataElementsAndIndicators
        ),
        orgUnits: [orgUnitID],
        orgUnitLevel: `LEVEL-${orgUnitLevel}`,
        groupID: groupID,
        // note that `periods[0]` is the current period
        periods,
        mappedConfiguration,
    }
    return reportParameters
}
