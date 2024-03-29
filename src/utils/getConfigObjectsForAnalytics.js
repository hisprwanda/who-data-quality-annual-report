import { CORE_GROUP_CODE } from '../components/report-parameter-selector/index.js'

const isInGroup = ({ numerator, groupCode, members }) => {
    if (groupCode === CORE_GROUP_CODE) {
        return numerator.core
    } else {
        return members.includes(numerator.code)
    }
}

// TODO: setup the global context to get the stored configurations
export const getConfigObjectsForAnalytics = (configurations, groupCode) => {
    const group = configurations.groups?.find((g) => g.code === groupCode)
    const members = groupCode === CORE_GROUP_CODE || !group ? [] : group.members

    // Initialize a Set to store unique dataset IDs
    const uniqueDatasetIDs = new Set()

    // Filter numerators with dataID not null and in the group's members
    const numeratorsInGroup = configurations.numerators
        .filter((numerator) => {
            return (
                isInGroup({ numerator, groupCode, members }) &&
                numerator.dataID &&
                numerator.dataSetID &&
                numerator.dataSetID.length &&
                numerator.dataElementOperandID
            )
        })
        // and convert numerator dataSetID to an array of IDs if not already the case (backwards compatibility)
        .map((numerator) => ({
            ...numerator,
            dataSetID: Array.isArray(numerator.dataSetID)
                ? numerator.dataSetID
                : [numerator.dataSetID],
        }))

    // Map each numerator's datasetID, which may be an array
    numeratorsInGroup.forEach((numerator) => {
        numerator.dataSetID.forEach((id) => {
            uniqueDatasetIDs.add(id)
        })
    })

    // Create an object to index datasets by their IDs
    const indexedNumerators = {}
    numeratorsInGroup.forEach((numerator) => {
        indexedNumerators[numerator.dataID] = numerator
    })

    // Convert the Set to an array to match dataset IDs
    const allDatasetIDs = [...uniqueDatasetIDs]

    // Filter datasets whose "id" matches the dataset IDs
    const datasets = configurations.dataSets.filter((dataset) => {
        return allDatasetIDs.includes(dataset.id)
    })

    // Create an object to index datasets by their IDs
    const indexedDatasets = {}

    datasets.forEach((dataset) => {
        indexedDatasets[dataset.id] = dataset
    })

    // filter numerator relations to include those where A or B is in group
    // then map A, B numerators to ids
    // then filter out any numerator relations where an ID is missing
    const numeratorsInGroupCodes = numeratorsInGroup.map((num) => num.code)
    const numeratorRelations = configurations.numeratorRelations
        .filter(
            (nr) =>
                numeratorsInGroupCodes.includes(nr.A) ||
                numeratorsInGroupCodes.includes(nr.B)
        )
        .map((nr) => {
            const aID = configurations.numerators.find(
                (num) => num.code === nr.A
            )?.dataID
            const bID = configurations.numerators.find(
                (num) => num.code === nr.B
            )?.dataID

            return {
                A: aID,
                B: bID,
                name: nr.name,
                type: nr.type,
                criteria: nr.criteria,
            }
        })
        .filter((nr) => nr.A && nr.B)

    const externalRelations = !configurations.externalRelations
        ? []
        : configurations.externalRelations
              .map((er) => {
                  const denominator = configurations.denominators.find(
                      (denom) => denom.code === er.denominator
                  )?.dataID
                  const numerator = configurations.numerators.find(
                      (num) => num.code === er.numerator
                  )?.dataID

                  return {
                      ...er,
                      denominator,
                      numerator,
                  }
              })
              .filter((er) => er.denominator && er.numerator && er.externalData)

    const denominatorRelations = !configurations.denominatorRelations
        ? []
        : configurations.denominatorRelations
              .map((dr) => {
                  const aInfo = configurations.denominators.find(
                      (denom) => denom.code === dr.A
                  )
                  const bInfo = configurations.denominators.find(
                      (denom) => denom.code === dr.B
                  )

                  return {
                      A: {
                          id: aInfo?.dataID,
                          lowLevel: aInfo?.lowLevel,
                      },
                      B: {
                          id: bInfo?.dataID,
                          lowLevel: bInfo?.lowLevel,
                      },
                      name: dr.name,
                      type: dr.type,
                      criteria: dr.criteria,
                  }
              })
              .filter(
                  (dr) => dr.A.id && dr.A.lowLevel && dr.B.id && dr.B.lowLevel
              )

    const configsObj = {
        dataElementsAndIndicators: indexedNumerators,
        dataSets: indexedDatasets,
        numeratorRelations,
        externalRelations,
        denominatorRelations,
    }
    return configsObj
}
