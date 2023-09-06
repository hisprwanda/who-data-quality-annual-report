export const generateNumeratorCode = (numerators) => {
    if (numerators) {
        return ''
    }
    const lastCode = numerators[numerators.length - 1].code
    const lastNumber = parseInt(lastCode.slice(1))

    const newCodeNumber = lastNumber + 1
    const newCode = 'C' + newCodeNumber

    return newCode
}

// TODO: setup the global context to get the stored configurations
export const getConfigObjectsForAnalytics = (configurations, groupCode) => {
    // return an empty array if the groupcode is not provided
    if (!groupCode) {
        return {}
    }

    // Find the group with the given code
    const group = configurations.groups?.find((g) => g.code === groupCode)
    if (!group) {
        // Return an empty array if the group is not found
        return {}
    }

    // Get members of the group
    const members = group.members

    // Initialize a Set to store unique dataset IDs
    const uniqueDatasetIDs = new Set()

    // Filter numerators with dataID not null and in the group's members
    const numeratorsInGroup = configurations.numerators.filter((numerator) => {
        return (
            members.includes(numerator.code) &&
            numerator.dataID !== null &&
            numerator.dataSetID !== null
        )
    })

    // Map each numerator's datasetID, which may be an array
    numeratorsInGroup.forEach((numerator) => {
        if (Array.isArray(numerator.dataSetID)) {
            numerator.dataSetID.forEach((id) => {
                uniqueDatasetIDs.add(id)
            })
        } else {
            uniqueDatasetIDs.add(numerator.dataSetID)
        }
    })

     // Create an object to index datasets by their IDs
     const indexedNumerators = {};
     numeratorsInGroup.forEach((numerator) => {
        indexedNumerators[numerator.dataID] = numerator;
    });


    // Convert the Set to an array to match dataset IDs
    const allDatasetIDs = [...uniqueDatasetIDs]

    // Filter datasets whose "id" matches the dataset IDs
    const datasets = configurations.dataSets.filter((dataset) => {
        return allDatasetIDs.includes(dataset.id)
    })

    // Create an object to index datasets by their IDs
    const indexedDatasets = {};

    datasets.forEach((dataset) => {
        indexedDatasets[dataset.id] = dataset;
    });

    const configsObj = {
        dataElementsAndIndicators: indexedNumerators,
        dataSets: indexedDatasets,
    }
    return configsObj
}