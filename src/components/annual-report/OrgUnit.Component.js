import React, { useState, useEffect, useMemo, useCallback } from "react";
import { OrganisationUnitTree } from "@dhis2/ui";
import { useSelector, useDispatch } from "react-redux";
import Actions from "./utils/enum/Index"; 

export const OrgUnitComponent = () => {
  let storeRef = useSelector((state) => state);
  let dispatch = useDispatch();
  let [orgUnitSelectionSet, setOrgUnitSelectionSet] = useState(['Hjw70Lodtf2']);
  let [orgUnitState, setOrgUnitState] = useState([]);
  let [orgUnitCurrentSelection, setOrgUnitCurrentSelection] = useState('')

  let changeOrgUnitSelectionSet = useCallback((e) => {
    e.stopPropagation()
    setOrgUnitSelectionSet(prev => [...prev, e.path])
    setOrgUnitCurrentSelection(e.path)
  }, [orgUnitSelectionSet]);

  useEffect(() => {
    dispatch({type: Actions.changeOrgUnitSet, payload: {ou: orgUnitSelectionSet}})    
  }, [orgUnitSelectionSet])

  useEffect(() => {
    let isSelectedValueExisting = orgUnitSelectionSet.filter(ou => ou === orgUnitCurrentSelection)
    let processedOrgUnit = isSelectedValueExisting.length > 1 ? orgUnitSelectionSet.filter(ou => ou !== orgUnitCurrentSelection) : orgUnitSelectionSet
    dispatch({type: Actions.changeOrgUnitSet, payload: {ou: processedOrgUnit}})
    setOrgUnitSelectionSet(processedOrgUnit)
  }, [orgUnitCurrentSelection])

  return (
    <div className="orgunit-parent-container">
      <OrganisationUnitTree
        name="country org unit"
        onChange={(e) => changeOrgUnitSelectionSet(e)}
        isUserDataViewFallback={true}
        roots={["Hjw70Lodtf2"]}
        selected={orgUnitSelectionSet}
      />
    </div>
  );
};
