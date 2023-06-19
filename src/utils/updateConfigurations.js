import {useState, useEffect} from 'react'
//TODO: get the current configurations & assign it to an object [ plan to use a global context API ]
//TODO: Create different states in which to assign different parts of configurations ex:   const [numerators, setNumerators] = useState([]);
//TODO: manupulate these objects and assign them back to the configurations object
//TODO: populate these objects properties using spread syntax (...).
//TODO: send back the updated object and test it. 


export const updateConfigurations = (configurations, configurationType, updateType, identifier) => {
   
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
        numerators: updateNumerator(numerators, identifier),
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

const updateNumerator = (numerators, code) => {
    console.log('deleting numerator: ', code);
    const numerator = numerators.find(numerator => numerator.code === code);
  if (numerator) {
    numerator.dataSetID = null;
    numerator.dataID = null;
  }
  return numerators;
}