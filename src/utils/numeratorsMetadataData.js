
// TODO: in the future, pass the data from a global state or context api 

import { Chip } from "@dhis2/ui-core";

export const getNumeratorMemberGroups = (configurations, code) => {
    const groups = configurations.groups;
    let memberGroups = []

    for (let index in groups) {
      const currentGroup = groups[index]
      for (let index in currentGroup.members) {
        const currentMember = currentGroup.members[index]
        // console.log('current member: ', currentMember);
        if (currentMember === code) { memberGroups.push(currentGroup.displayName ) }
      }
    }


    console.log('memberGroups:  ', memberGroups);
  return  (
    <>
    {memberGroups.map((group) => 
          <Chip dense> {group} </Chip>

    )}
      {/* <Chip>General Serivies andf fka fkjdfkadjf adkfjd fakjfkdafja f</Chip> */}
      {/* <Chip>Chipkdakjf;d a</Chip> */}
    </>
  )
  
}

