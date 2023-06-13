import {
  Button,
  IconSubtractCircle16,
  TableCell,
  TableRow} from '@dhis2/ui'



// TODO: in the future, pass the data from a global state or context api 

import { Chip } from "@dhis2/ui-core";

export const getNumeratorMemberGroups = (configurations, code) => {
  const groups = configurations.groups;
  let memberGroups = []
  for (let key in groups) {
    const currentGroup = groups[key]
    for (let key in currentGroup.members) {
      const currentMember = currentGroup.members[key]
      if (currentMember === code) { memberGroups.push(currentGroup.displayName ) }
    }
  }

return  (
  <>
    {memberGroups.map((group, key) => 
          <Chip key={key} dense> {group} </Chip>
    )}
  </>
)

}

export const getNumeratorDataset = (configurations, dataSetID) => {
  const datasets = configurations.dataSets;
  
  for (let key in datasets) {
    const dataset = datasets[key]
    if (dataset.id === dataSetID) { 
      return dataset.name
    }
  }
}

export const getNumeratorDataElement = (configurations, dataID) => {
  const denominators = configurations.denominators;
  
  for (let key in denominators) {
    const denominator = denominators[key]
    if (denominator.dataID === dataID) { 
      return denominator.name
    }
  }
}

export const getNumeratorsInGroup = (numerators, group) => {
  const numeratorsInGroup = [];

  for (let key in numerators) {
    const numerator = numerators[key]
    if (group.members.includes(numerator.code)) { 
      numeratorsInGroup.push(numerator)
    }
  }

  return(
    <>
      {numeratorsInGroup.map((numerator, key ) => (

      <TableRow key={key}>
        <TableCell>
          {numerator.name}
        </TableCell>
        <TableCell>
          <Button
              name="Primary button" onClick={() => window.alert('It works!')} 
              basic button value="default" icon={<IconSubtractCircle16 />}> Clear
              </Button>
        </TableCell>
      </TableRow>


      ))
      }
    </>
  )
  
}