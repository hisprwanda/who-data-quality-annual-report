import {useState, useEffect} from 'react'
import { generateNumeratorCode } from './generateNumeratorCode';

// TODO: Implemement the global context api to share configurations accross compoments
// TODO: Merge these clear and update configurations methods to make it dynamic 
export const clearConfigurations = (configurations, configurationType, updateType, numeratorToUpdate) => {
   
        const metaDataVersion = configurations.metaDataVersion; 
        const numerators = configurations.numerators;
        const coreIndicators = configurations.coreIndicators;
        const dataSets = configurations.dataSets;
        const denominatorRelations = configurations.denominatorRelations;
        const denominators = configurations.denominators;
        const externalRelations = configurations.externalRelations; 
        const numeratorRelations = configurations.numeratorRelations;
        const groups = configurations.groups;
      
    const configurationsToSave = {
        metaDataVersion,
        numerators: clearNumerator(numerators, numeratorToUpdate),
        coreIndicators,
        dataSets,
        denominators,
        denominatorRelations,
        externalRelations,
        numeratorRelations,
        groups
    }

    // console.log('updated configurations: ', configurationsToSave);

    return configurationsToSave;
}

export const createNewNumerator = (configurations, newNumeratorInfo) => {

  const metaDataVersion = configurations.metaDataVersion; 
  const numerators = configurations.numerators;
  const coreIndicators = configurations.coreIndicators;
  const dataSets = configurations.dataSets;
  const denominatorRelations = configurations.denominatorRelations;
  const denominators = configurations.denominators;
  const externalRelations = configurations.externalRelations; 
  const numeratorRelations = configurations.numeratorRelations;
  const groups = configurations.groups;
  const newCode = newNumeratorInfo.code;

  // construct a numerator object
  const newNumerator = {
    code: newCode,
    comparison: "ou",
    consistency: 33,
    core: true,
    custom: true,
    dataElementOperandID: newNumeratorInfo.dataElementOperandID,
    dataID: newNumeratorInfo.dataID,
    dataSetID: newNumeratorInfo.dataSetID,
    definition: newNumeratorInfo.definition,
    extremeOutlier: 3,
    missing: 90,
    moderateOutlier: 2,
    name: newNumeratorInfo.name,
    trend: "constant"
  }

  const configurationsToSave = {
    metaDataVersion,
    numerators:[... numerators, newNumerator],
    coreIndicators: [...coreIndicators, newCode],
    dataSets,
    denominators,
    denominatorRelations,
    externalRelations,
    numeratorRelations,
    groups: updateGroups(groups, newNumeratorInfo)
  }

  return configurationsToSave;
}

export const updateConfigurations = (configurations, configurationType, updateType, configsUpdateInfo) => {
   
  const metaDataVersion = configurations.metaDataVersion; 
  const numerators = configurations.numerators;
  const coreIndicators = configurations.coreIndicators;
  const dataSets = configurations.dataSets;
  const denominatorRelations = configurations.denominatorRelations;
  const denominators = configurations.denominators;
  const externalRelations = configurations.externalRelations; 
  const numeratorRelations = configurations.numeratorRelations;
  const groups = configurations.groups;

  let configurationsToSave = {};

  switch (configurationType) {
    case 'numerators':
      configurationsToSave = {
        metaDataVersion,
        numerators: updateNumerator(numerators, configsUpdateInfo),
        coreIndicators,
        dataSets,
        denominators,
        denominatorRelations,
        externalRelations,
        numeratorRelations,
        groups
      }
      break;
    case 'groups':
      configurationsToSave = {
        metaDataVersion,
        numerators,
        coreIndicators,
        dataSets,
        denominators,
        denominatorRelations,
        externalRelations,
        numeratorRelations,
        groups: updateOneGroup(groups, configsUpdateInfo, updateType)
      }
      break;
    case 'parameters':
      configurationsToSave = {
        metaDataVersion,
        numerators:  updateNumeratorParameters(numerators, configsUpdateInfo),
        coreIndicators,
        dataSets,
        denominators,
        denominatorRelations,
        externalRelations,
        numeratorRelations,
        groups
      }
      break;
  
    default:
      break;
  }


// console.log('updated configurations: ', configurationsToSave);

return configurationsToSave;
}

// TODO: can u use the spread operator ?
const clearNumerator = (numerators, numeratorToUpdate) => {
    const numerator = numerators.find(numerator => numerator.code === numeratorToUpdate.code);
  if (numerator) {
    numerator.dataSetID = null;
    numerator.dataID = null;
  }
  return numerators;
}

// TODO: can u use the spread operator ?
// TODO: check all changed data and update them accordingly. i.e: core, groups, etc
const updateNumerator = (numerators, updatedNumerator) => {
    const numerator = numerators.find(numerator => numerator.code === updatedNumerator.code);
  if (numerator) {
    // numerator.dataSetID = updatedNumerator.dataSetID;
    // numerator.dataID = updatedNumerator.dataID;
    numerator.name = updatedNumerator.name;
    numerator.definition = updatedNumerator.definition;
  }
  return numerators;
}

const updateNumeratorParameters = (numerators, updatedNumerators) => {
//   const numerator = numerators.find(numerator => numerator.code === updatedNumerator.code);
// if (numerator) {
//   // numerator.dataSetID = updatedNumerator.dataSetID;
//   // numerator.dataID = updatedNumerator.dataID;
//   numerator.name = updatedNumerator.name;
//   numerator.definition = updatedNumerator.definition;
// }
// return numerators;

for (let i = 0; i < numerators.length; i++) {
  const currentNumerator = numerators[i];
  for (let j = 0; j < updatedNumerators.length; j++) {
    const currentUpdatedNumerator = updatedNumerators[j];
    if (currentNumerator.code == currentUpdatedNumerator.code) {
      //update the numerator with new values
      currentNumerator.comparison = currentUpdatedNumerator.comparison;
      currentNumerator.consistency = currentUpdatedNumerator.consistency;
      currentNumerator.extremeOutlier = currentUpdatedNumerator.extremeOutlier;
      currentNumerator.missing = currentUpdatedNumerator.missing;
      currentNumerator.moderateOutlier = currentUpdatedNumerator.moderateOutlier;
      currentNumerator.trend = currentUpdatedNumerator.trend;
    }
  }
}
return numerators;
}




const updateGroups = (groups, newNumeratorInfo) => {
  const chosenGroups = newNumeratorInfo.groups
  for (const key in chosenGroups) {
      const chosenGroup = chosenGroups[key];

        for (const key in groups) {
            const currentGroup = groups[key];
              if (currentGroup.code == chosenGroup) {
                currentGroup.members.push(newNumeratorInfo.code);
              }else {
              }
        }
  }  

  return groups;
}

const updateOneGroup = (groups, groupUpdateInfo, updateType) => {
        switch (updateType) {
          case 'update':
            for (const key in groups) {
                const currentGroup = groups[key];
                  if (currentGroup.code == groupUpdateInfo.groupCode) {
                    currentGroup.members.push(groupUpdateInfo.numeratorCode);
                    return groups;
                  }
            }
            break;
          case 'delete':

            const updatedGroups = groups.map(group => {
              if (group.code == groupUpdateInfo.groupCode) {
                group.members = group.members.filter(member => member != groupUpdateInfo.numeratorCode)
                
              }
              return group;
            });
            return updatedGroups;

          //   for (const key in groups) {
          //     const currentGroup = groups[key];
          //       if (currentGroup.code == groupUpdateInfo.groupCode) {
          //         let newGroup = currentGroup.members.filter(numerator => numerator !== groupUpdateInfo.numeratorCode);
          //         let newGroups = groups.filter(group => group.code !== newGroup.code );
          //         newGroups.push(newGroup);
          //         return newGroups
          //       }
          // }
            break;
          default:
            break;
        }

}