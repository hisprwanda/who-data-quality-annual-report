import React, {useState, useEffect} from 'react'
import { OrganisationUnitTree } from '@dhis2/ui';
import { useSelector, useDispatch } from 'react-redux'
import { useDataQuery } from '@dhis2/app-runtime';
import { loadOrganizationUnit } from './datasource/dataset/dataset.source';

export const OrgUnitComponent = () => {
    
  let storeRef = useSelector(state => state)
  let dispatch = useDispatch()

  let [orgUnitState, setOrgUnitState] = useState(storeRef.selectedValue.orgUnit)
  let selectedOU = storeRef.selectedValue.orgUnit.path
  let [id, setID] = useState(0)
  
  useEffect(() => {
    dispatch({type: 'Change Org Unit', payload: {displayName: orgUnitState.displayName, path: orgUnitState.path, id: orgUnitState.id, children: orgUnitState.children}})
  }, [orgUnitState])

  return (
      <OrganisationUnitTree name="Hjw70Lodtf2" onChange={(e) => setOrgUnitState(e)}
        isUserDataViewFallback={true}
        roots={
          ['Hjw70Lodtf2']
        }
        selected={[
          orgUnitState.path
        ]}
      />
  );
}