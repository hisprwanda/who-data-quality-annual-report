import {useState, useEffect} from 'react'

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


export const updateConfigurations = (configurations, configurationType, updateType, updatedNumerator) => {
   
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
  numerators: updateNumerator(numerators, updatedNumerator),
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