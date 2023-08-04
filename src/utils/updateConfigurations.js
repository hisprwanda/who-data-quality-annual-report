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

    console.log('updated configurations: ', configurationsToSave);

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
    dataElementOperandID: 'newNumeratorInfo.dataElementOperandID',
    dataID: 'newNumeratorInfo.dataID',
    dataSetID: 'newNumeratorInfo.dataSetID',
    definition: 'newNumeratorInfo.definition',
    extremeOutlier: 3,
    missing: 90,
    moderateOutlier: 2,
    name: 'newNumeratorInfo.name',
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

export const updateConfigurations = (configurations, configurationType, updateType, updatedNumerator, groupUpdateInfo) => {
   
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
        numerators: updateNumerator(numerators, updatedNumerator),
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
        numerators: numerators,
        coreIndicators,
        dataSets,
        denominators,
        denominatorRelations,
        externalRelations,
        numeratorRelations,
        groups: addNumeratorToGroups(groups, groupUpdateInfo)
      }
      break;
  
    default:
      break;
  }


console.log('updated configurations: ', configurationsToSave);

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



const updateGroups = (groups, newNumeratorInfo) => {
  console.log('Groups before: ', groups);
  const chosenGroups = newNumeratorInfo.groups
  console.log('Chosen groups ', chosenGroups);
  for (const key in chosenGroups) {
      const chosenGroup = chosenGroups[key];
        console.log('chosen group: ', chosenGroup);

        for (const key in groups) {
            const currentGroup = groups[key];
              if (currentGroup.code == chosenGroup) {
                currentGroup.members.push(newNumeratorInfo.code);
                console.log('current group after update: ', currentGroup);
              }else {
                console.log('Not equal');
              }
        }
  }  
  console.log('Groups after: ', groups);

  return groups;
}

const addNumeratorToGroups = (groups, groupUpdateInfo) => {
        for (const key in groups) {
            const currentGroup = groups[key];
              if (currentGroup.code == groupUpdateInfo.groupCode) {
                console.log('currentGroup', currentGroup)
                currentGroup.members.push(groupUpdateInfo.numeratorCode);
                console.log('current group after update: ', currentGroup);
              }
        }

  return groups;
}