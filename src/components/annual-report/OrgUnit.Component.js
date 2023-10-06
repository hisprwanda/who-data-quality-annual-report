import React from "react";
import { OrganisationUnitTree } from "@dhis2/ui";
import { useSelector, useDispatch } from "react-redux";
import Actions from "./utils/enum/Index";

export const OrgUnitComponent = () => {
  
  //A variable for referencing the redux store 
  let storeRef = useSelector((state) => state);
  let dispatch = useDispatch();
  
  const changeOrgUnitSelectionSet = (e) => {
    const ouID = e.id;
    const ouPath = e.path;
    let storedOu = storeRef.selectedValue.orgUnitSet
    let storedOuID = storeRef.selectedValue.orgUnitIDSet
    let duplicateOrgUnitID = storedOuID.filter(o => o === ouID)
    let duplicateOrgUnitPath = storedOu.filter(o => o === ouPath)
    
    // Removal of the duplicate orgunit paths and the org unit ids
    storedOu = duplicateOrgUnitPath.length === 0 ? [...storedOu, ouPath] : storedOu.filter(o => o !== ouPath)
    storedOuID = duplicateOrgUnitID.length === 0 ? [...storedOuID, ouID] : storedOuID.filter(o => o !== ouID)

    // Dispatching the actions to the redux store
    dispatch({type: Actions.changeOrgUnitID, payload: {id: storedOuID}})
    dispatch({ type: Actions.changeOrgUnitSet, payload: { ou: storedOu } });
  
  };

  return (
    <div className="orgunit-parent-container">
      <OrganisationUnitTree
        name="country org unit"
        onChange={(e) => changeOrgUnitSelectionSet(e)}
        isUserDataViewFallback={true}
        roots={["Hjw70Lodtf2"]}
        selected={storeRef.selectedValue.orgUnitSet}
      />
    </div>
  );
};
