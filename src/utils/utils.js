export const generateNumeratorCode = (numerators) => {
    const lastCode = numerators[numerators.length - 1].code;
    const lastNumber = parseInt(lastCode.slice(1));

    const newCodeNumber = lastNumber + 1;
    const newCode = "C" + newCodeNumber;

    return newCode;
}

// TODO: setup the global context to get the stored configurations
export const getConfigObjectsForAnalytics = (configurations, groupCode) => {
    
     // Find the group with the given code
     const group = configurations.groups.find((g) => g.code === groupCode);
     if (!group) {
        // Return an empty array if the group is not found
        return [];
    }

    // Get members of the group
    const members = group.members;

    // Initialize a Set to store unique dataset IDs
    const uniqueDatasetIDs = new Set();
  
    // Filter numerators with dataID not null and in the group's members
    const numeratorsInGroup = configurations.numerators.filter((numerator) => {
        return members.includes(numerator.code) && numerator.dataID !== null;
    });

    // Map each numerator's datasetID, which may be an array
    numeratorsInGroup.forEach((numerator) => {
        if (Array.isArray(numerator.dataSetID)) {
        numerator.dataSetID.forEach((id) => {
            if (id !== null) {
            uniqueDatasetIDs.add(id);
            }
        });
        } else if (numerator.dataSetID !== null) {
        uniqueDatasetIDs.add(numerator.dataSetID);
        }
    });
    
    // Convert the Set to an array to match dataset IDs
    const allDatasetIDs = [...uniqueDatasetIDs];

    // Filter datasets whose "id" matches the dataset IDs
    const datasets = configurations.dataSets.filter((dataset) => {
        return allDatasetIDs.includes(dataset.id);
    });
    
    const configsObj = {
        dataElementsAndIndicators: numeratorsInGroup,
        dataSets: datasets
    }
    return configsObj;
}


