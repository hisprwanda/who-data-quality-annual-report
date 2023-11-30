import { getStats } from '../utils/mathService.js'
import { convertAnalyticsResponseToObject } from '../utils/utils.js'
import { SUBPERIODS_RESPONSE_NAME } from './section2DataNames.js'

const MODIFIED_Z_OUTLIER = 3.5
const DEFAULT_EXTREME_OUTLIER = 3
const DEFAULT_MODERATE_OUTLIER = 2

// format response
const getRowInformation = ({
    dxID,
    counts,
    countsKey,
    thresholdValue,
    divergentSubOrgUnits,
    invalidSubOrgUnits,
    metadata,
}) => ({
    indicator: metadata[dxID]?.name,
    threshold: thresholdValue,
    overallScore:
        counts.totalValidValues === 0
            ? 0
            : (counts[countsKey] / counts.totalValidValues) * 100,
    divergentScores: {
        number: divergentSubOrgUnits[countsKey].length,
        percentage:
            counts.orgUnitLevelsOrGroup === 0
                ? 0
                : (divergentSubOrgUnits[countsKey].length /
                      counts.orgUnitLevelsOrGroup) *
                  100,
        names: divergentSubOrgUnits[countsKey]
            .map((ou) => metadata?.[ou]?.name)
            .sort()
            .join(', '),
        noncalculable: invalidSubOrgUnits
            .map((ou) => metadata?.[ou]?.name)
            .sort()
            .join(', '),
    },
})

const calculateSections2a2b2c = ({
    formattedResponse,
    subOrgUnitIDs,
    metadata,
    mappedConfiguration,
}) => {
    const results = {
        section2a: [],
        section2b: [],
        section2c: [],
    }

    for (const dx in formattedResponse) {
        const dxInfo = mappedConfiguration.dataElementsAndIndicators?.[dx]
        const thresholdValues = {
            extremeOutlier: dxInfo?.extremeOutlier || DEFAULT_EXTREME_OUTLIER,
            moderateOutlier:
                dxInfo?.moderateOutlier || DEFAULT_MODERATE_OUTLIER,
            modifiedZOutlier: MODIFIED_Z_OUTLIER, // this is not definable by configuration
        }

        const counts = {
            totalValidValues: 0,
            extremeOutliers: 0,
            moderateOutliers: 0,
            modifiedZOutliers: 0,
            orgUnitLevelsOrGroup: subOrgUnitIDs.length,
        }
        const divergentSubOrgUnits = {
            extremeOutliers: [],
            moderateOutliers: [],
            modifiedZOutliers: [],
        }
        const invalidSubOrgUnits = []
        for (const ou in formattedResponse[dx]) {
            const ouData = formattedResponse[dx][ou]
            const validValues = Object.values(ouData).filter(
                (val) => !isNaN(Number(val))
            )
            // if there are not enough valid values to calculate statistics, skip and mark invalid
            if (validValues.length <= 1) {
                invalidSubOrgUnits.push(ou)
                continue
            }

            const stats = getStats({
                valuesArray: validValues,
                ...thresholdValues,
            })

            counts.totalValidValues += stats.count
            counts.extremeOutliers += stats.extremeOutliers
            counts.moderateOutliers += stats.moderateOutliers
            counts.modifiedZOutliers += stats.modifiedZOutliers

            if (stats.extremeOuliers > 0) {
                divergentSubOrgUnits.extremeOutliers.push(ou)
            }

            // must be at least 2 outliers for moderate/modifiedZ to be considered divergent
            if (stats.moderateOutliers > 1) {
                divergentSubOrgUnits.moderateOutliers.push(ou)
            }
            if (stats.modifiedZOutliers > 1) {
                divergentSubOrgUnits.modifiedZOutliers.push(ou)
            }
        }

        // now push results to row
        results.section2a.push(
            getRowInformation({
                dxID: dx,
                counts,
                thresholdValue: thresholdValues.extremeOutlier,
                countsKey: 'extremeOutliers',
                divergentSubOrgUnits,
                invalidSubOrgUnits,
                metadata,
            })
        )
        results.section2b.push(
            getRowInformation({
                dxID: dx,
                counts,
                formattedResponse,
                thresholdValue: thresholdValues.moderateOutlier,
                countsKey: 'moderateOutliers',
                divergentSubOrgUnits,
                invalidSubOrgUnits,
                metadata,
            })
        )
        results.section2c.push(
            getRowInformation({
                dxID: dx,
                counts,
                formattedResponse,
                thresholdValue: thresholdValues.modifiedZOutlier,
                countsKey: 'modifiedZOutliers',
                divergentSubOrgUnits,
                invalidSubOrgUnits,
                metadata,
            })
        )
    }
    return results
}

export const getSection2abc = ({ section2Response, mappedConfiguration }) => {
    const formattedResponse2a2b2c = section2Response[
        SUBPERIODS_RESPONSE_NAME
    ].reduce((mergedFormatted, indResponse) => {
        return {
            ...mergedFormatted,
            ...convertAnalyticsResponseToObject({
                ...indResponse,
                mappedConfiguration,
            }),
        }
    }, {})

    const metadata2a2b2c = section2Response[SUBPERIODS_RESPONSE_NAME].reduce(
        (mergedMetadata, indResponse) => {
            return {
                ...mergedMetadata,
                ...indResponse.metaData.items,
            }
        },
        {}
    )

    // since all requests are for same LEVEL, they should all have the same underlying OU dimension
    const subOrgUnitIDs2abc =
        section2Response[SUBPERIODS_RESPONSE_NAME]?.[0]?.metaData?.dimensions
            ?.ou ?? []

    // Subsections 2a-2c
    const sections2a2b2c = calculateSections2a2b2c({
        formattedResponse: formattedResponse2a2b2c,
        metadata: metadata2a2b2c,
        subOrgUnitIDs: subOrgUnitIDs2abc,
        mappedConfiguration,
    })

    sections2a2b2c.section2a.sort((a, b) =>
        a.indicator.localeCompare(b.indicator)
    )
    sections2a2b2c.section2b.sort((a, b) =>
        a.indicator.localeCompare(b.indicator)
    )
    sections2a2b2c.section2c.sort((a, b) =>
        a.indicator.localeCompare(b.indicator)
    )
    return sections2a2b2c
}
