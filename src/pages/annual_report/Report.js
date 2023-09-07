/*
Author: Joseph MANZI
Company: HISP Rwanda
Date: May, 30 2023
The component to manage the period modal
*/

// Import of key features

import { useState, useEffect } from "react";
import React from "react";
import MenuBar from "../../components/menu-bar/MenuBar";
import "./style/report.css";
import { Button, SelectorBar, SelectorBarItem } from "@dhis2/ui";
import {
  loadDataStore,
  loadOrgUnitLevels,
  loadOrganizationUnitGroups,
  loadOrganizationUnitLevels,
} from "../../components/annual-report/datasource/dataset/dataset.source";
import { useDataQuery } from "@dhis2/app-runtime";
import { OrgUnitComponent } from "../../components/annual-report/OrgUnit.Component";
import down_allow from "../../assets/images/downarrow.png";
import ReportPreview from "../../components/annual-report/report-preview/ReportPreview";
import { useDispatch, useSelector } from "react-redux";
import PeriodComponent from "../../components/annual-report/period/Period.component";
import { SettingsProcessor } from "../../utils/SettingsProcessor";
import { OrganizationUnitGroupComponent } from "../../components/annual-report/OrganizationUnitGroup";
import { OrganizationUnitLevelComponent } from "../../components/annual-report/OrganizationUnitLevel";
import Actions from "../../components/annual-report/utils/enum/Index";
// End of imports

// Start of the functional component definition
  
  //TODO: pick the group id selected
  // passi to the function to filter out configurations 
  // 

const Report = function () {
  // Redux state selector hook
  let selectedElementStore = useSelector((state) => state.selectedValue);
  let storeStateSelector = useSelector((state) => state);
  // Redux state dispatch hook
  let dispatch = useDispatch();

  // End of hook for managing org unit modal
  let [_dataStore, setDataStore] = useState(loadDataStore);

  // State hook for settings
  let [_settings, setSettings] = useState([]);
  // End of the hook for managing settings

  // State for organization groups
  let [organizationUnitGroup, setOrganizationUnitGroup] = useState([]);
  let [organizationUnitLevel, setOrganizationUnitLevel] = useState([]);

  // Hook for managing levels
  let [selectedLevel, setSelectedLevel] = useState("Select Levels");
  // Hook for managing groups
  let [selectedGroup, setSelectedGroup] = useState("Select Groups");

  let [orgUnitLevelNum, setOrgUnitLevelNum] = useState(0)

  let [reportStatus, setReportStatus] = useState(false);

  let selectedItem = selectedElementStore.dataSet;
  let [filteredItem, setFilteredItem] = useState([]);
  let [elements, setElements] = useState();
  let [configuredDataSet, setConfiguredDataSet] = useState();
  let [orgUnitLevelVisibility, setOrgUnitLevelVisibility] = useState("none");
  let [orgUnitGroupVisibility, setOrgUnitGroupVisibility] = useState("none");

  let reportLoader = (orgUnit, period, group) => {
    dispatch({ type: "Change Report View Status", payload: { status: true } });
  };
  let { loading, error, data } = useDataQuery(_dataStore, {}, {}, {}, {}, {});
  let orgUnitLevelResponse = useDataQuery(loadOrgUnitLevels);



  let settings = [];
  if (data) {
    settings = SettingsProcessor(data);
  }
  useEffect(() => {
    let settings = data !== undefined ? SettingsProcessor(data) : [];
    setSettings(settings.setting);
    setElements(Array.from(new Set(settings.elements)));
    setConfiguredDataSet(Array.from(new Set(settings.dataset)));
  }, [data]);

  useEffect(() => {
    dispatch({
      type: "Change Configured Dataset",
      payload: { dataset: configuredDataSet },
    });
  }, [configuredDataSet]);

  useEffect(() => {
    dispatch({ type: "Change Element", payload: { elements } });
  }, [elements]);

  useEffect(() => {
    dispatch({type: Actions.changeOrgUnitLevel, payload: {level: orgUnitLevelNum}})
  }, [orgUnitLevelNum])

  // Definition of use effect hooks
  useEffect(() => {
    let groups = data?.results.groups.filter((i) => i.code === selectedItem);
    setFilteredItem(groups);
    dispatch({ type: "Change Group", payload: selectedItem });
  }, [selectedItem]);

  useEffect(() => {
    reportStatus != reportStatus;
  }, [reportStatus]);

  let setSelectedDataSet = function (chosenElement) {
    dispatch({ type: "Change Dataset", payload: { el: chosenElement } });
  };

  //Loading organization unit group
  useEffect(() => {
    // Load organization unit groups
    loadOrganizationUnitGroups()
      .then((org) => {
        dispatch({
          type: "Add Organization Unit Group",
          payload: { group: org.data.organisationUnitGroups },
        });
        setOrganizationUnitGroup(org.data.organisationUnitGroups);
      })
      .catch((err) => console.log(err));

    // Load organization unit levels
    loadOrganizationUnitLevels().then((ou) => {
      setOrganizationUnitLevel(ou.data);
    });
  }, []);

  let selectedGroupInfo = (e) => {
    e.persist();
    e.stopPropagation();
    setSelectedGroup(e.target.textContent);
    setOrgUnitGroupVisibility("none");
  };

  let selectedLevelInfo = (e) => {
    e.persist();
    e.stopPropagation();
    setSelectedLevel(e.target.textContent);
    setOrgUnitLevelNum(e.target.getAttribute('level'))
    setOrgUnitLevelVisibility("none");
  };

  let [periodVisibility, setPeriodVisibility] = useState("none");
  let [_dataGroupVisibility, _setDataGroupVisibility] = useState(false);
  let [_orgUnitVisibility, _setOrgUnitVisibility] = useState(false);
  let [_periodVisibility, _setPeriodVisibility] = useState(false);

  const toggleSelectedLevel = (e) => {
    e.persist();
    setOrgUnitLevelVisibility((prev) => (prev === "none" ? "flex" : "none"));
    setOrgUnitGroupVisibility("none");
  };

  const toggleSelectedGroup = (e) => {
    e.persist();
    setOrgUnitGroupVisibility((prev) => (prev === "none" ? "flex" : "none"));
    setOrgUnitLevelVisibility("none");
  };

  // Method used to generate the object used to generate the report
  const generateReport = () => {

    // Variable used to store the preveious years for reference
    const yearsForReference = storeStateSelector.selectedValue.precedingYearForReference
    // Variable used to store the selected organization unit array
    const selectedOrgUnitLevel = storeStateSelector.selectedValue.orgUnitLevel
    // Variable used to store the selected period
    const userSelectedPeriod = storeStateSelector.period.selectedPeriod
    // Variable used to store the periods calculated through the loop
    let periods = []
    // Variable used to store the dataset extracted from the configuration
    const dataSets = storeStateSelector.selectedValue.configuredDataset
    const dataElements = storeStateSelector.selectedValue.element
    const orgUnits = storeStateSelector.selectedValue.orgUnitIDSet
    const orgUnitLevel = `LEVEL-${selectedOrgUnitLevel}`
    let userSelectedPeriodCopy = userSelectedPeriod
    let minYear = userSelectedPeriod - yearsForReference
    
    // Loop used to generate the period, the minYear is the minimum year
    while(userSelectedPeriodCopy >= minYear) {
      periods = [...periods, userSelectedPeriodCopy]
      userSelectedPeriodCopy -= 1
    }
    // The object used for the generating the report
    let requestObj = {
      periods,
      currentPeriod: userSelectedPeriod,
      dataSets,
      dataElements,
      orgUnits,
      orgUnitLevel
    }
    console.log(requestObj)
  }
  return (
    <div className="reportContainer">
      <MenuBar />
      <div className="for-selector-bar">
        <SelectorBar
          additionalContent={
            <div className="additional-content">
              <span>
                <Button small primary onClick={generateReport}>
                  Generate report
                </Button>
              </span>
              <span>
                <Button small>Print</Button>
              </span>
            </div>
          }
          style={{ width: "800px" }}
        >
          <div>
            <SelectorBarItem
              label="Group"
              value={selectedItem}
              open={_dataGroupVisibility}
              setOpen={() => _setDataGroupVisibility((prev) => !prev)}
            >
              <div
                className="data-set-info"
                style={{ width: "100%", display: "block" }}
              >
                <ul>
                  {_settings?.map((element, info) => {
                    return (
                      <li
                        key={element.code}
                        onClick={(e) => {
                          e.persist();
                          setSelectedDataSet(e.target.textContent);
                        }}
                      >
                        {element.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </SelectorBarItem>
          </div>
          <div>
            <SelectorBarItem
              label="Organisation Unit"
              value=""
              open={_orgUnitVisibility}
              setOpen={() => _setOrgUnitVisibility((prev) => !prev)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ width: "500px" }}
              >
                <OrgUnitComponent />
              </div>

              <div className="level-and-group">
                <div className="level">
                  <div
                    className="selected-level"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectedGroup(e);
                    }}
                  >
                    <div className="select-title-data">{selectedGroup}</div>
                    <div className="select-title-icon">
                      <img src={down_allow} />
                    </div>
                  </div>
                  <div
                    className="showable-group"
                    style={{ display: orgUnitGroupVisibility }}
                  >
                    <ul>
                      <OrganizationUnitGroupComponent
                        group={organizationUnitGroup}
                        selectedGroupInfo={selectedGroupInfo}
                      />
                    </ul>
                  </div>
                </div>
                <div className="group">
                  <div
                    className="selected-group"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectedLevel(e);
                    }}
                  >
                    <div className="select-title-data">{selectedLevel}</div>
                    <div className="select-title-icon">
                      <img src={down_allow} />
                    </div>
                  </div>
                  <div
                    className="showable-level"
                    style={{ display: orgUnitLevelVisibility }}
                  >
                    <ul>
                      <OrganizationUnitLevelComponent
                        level={organizationUnitLevel}
                        selectedLevelInfo={selectedLevelInfo}
                      />
                    </ul>
                  </div>
                </div>
              </div>

              <div className="update-or-close">
                <div>
                  <span>Selected: </span>
                  {selectedElementStore.orgUnitSet.length} org units
                </div>
              </div>
            </SelectorBarItem>
          </div>
          <div>
            <SelectorBarItem
              label="Period"
              value={storeStateSelector.period.selectedPeriod}
              open={_periodVisibility}
              setOpen={() => _setPeriodVisibility((prev) => !prev)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ width: "400px" }}
              >
                <PeriodComponent />
              </div>
            </SelectorBarItem>
          </div>
        </SelectorBar>
      </div>
    </div>
  );
};

export default Report;
