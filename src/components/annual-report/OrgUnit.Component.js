import React, {useState, useEffect} from 'react'
import { OrganisationUnitTree } from '@dhis2/ui';
import { useSelector, useDispatch } from 'react-redux'

export const OrgUnitComponent = () => {
    
  let storeRef = useSelector(state => state)
  let dispatch = useDispatch()

  let [orgUnitState, setOrgUnitState] = useState(storeRef.selectedValue.orgUnit)
  let selectedOU = storeRef.selectedValue.orgUnit.path

  useEffect(() => {
    console.log(orgUnitState, 'changes')
    dispatch({type: 'Change Org Unit', payload: {displayName: orgUnitState.displayName, path: orgUnitState.path}})
  }, [orgUnitState])

  const chooseSelectedElement = function(e) {
    setOrgUnitState(e)
  }

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