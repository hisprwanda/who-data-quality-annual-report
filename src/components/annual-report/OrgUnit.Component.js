import React, {useState} from 'react'
import { OrganisationUnitTree } from '@dhis2/ui';
import { useSelector, useDispatch } from 'react-redux'

export const OrgUnitComponent = () => {
    
  let storeRef = useSelector(state => state.selectedValue)
  let dispatch = useDispatch()

  const chooseSelectedElement = function(e) {
    dispatch({type: 'Change Org Unit', payload: {displayName: e.displayName, path: e.path}})
  }
  let x = storeRef
  let selectedOU = storeRef.orgUnit.path
  return (
      <OrganisationUnitTree name="Hjw70Lodtf2" onChange={(e) => chooseSelectedElement(e)}
        isUserDataViewFallback={true}
        roots={
          ['Hjw70Lodtf2']
        }
        selected={[
          selectedOU
        ]}
      />
  );
}