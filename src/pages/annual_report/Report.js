/*
Author: Joseph MANZI
Company: HISP Rwanda
Date: May, 30 2023
The component to manage the period modal
*/

// Import of key features


import { useDataQuery } from "@dhis2/app-runtime";
import { Button, SelectorBar, SelectorBarItem } from "@dhis2/ui";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style/report.css";
import down_allow from "../../assets/images/downarrow.png";
import {
  loadDataStore,
  loadOrganizationUnitGroups,
  loadOrganizationUnitLevels,
} from "../../components/annual-report/datasource/dataset/dataset.source.js";
import { OrganizationUnitGroupComponent } from "../../components/annual-report/OrganizationUnitGroup.js";
import { OrganizationUnitLevelComponent } from "../../components/annual-report/OrganizationUnitLevel.js";
import { OrgUnitComponent } from "../../components/annual-report/OrgUnit.Component.js";
import PeriodComponent from "../../components/annual-report/period/Period.component.js";
import Actions from "../../components/annual-report/utils/enum/Index.js";
import MenuBar from "../../components/menu-bar/MenuBar.js";
import { SettingsProcessor } from "../../utils/SettingsProcessor.js";
import { getConfigObjectsForAnalytics } from "../../utils/utils.js";
import ReportPreview from "../../components/annual-report/report-preview/ReportPreview";
// End of imports

// Start of the functional component definition
  
  //TODO: pick the group id selected
  // passi to the function to filter out configurations 
  // 

const Report = function () {
  // Redux state selector hooks
  const selectedElementStore = useSelector((state) => state.selectedValue);
  
  const storeStateSelector = useSelector((state) => state);
  // Redux state dispatch hook
  const dispatch = useDispatch();

  const [_dataStore] = useState(loadDataStore);

  // State hook for settings
  const [_settings, setSettings] = useState([]);
  // End of the hook for managing settings

  // State for organization groups
  const [organizationUnitGroup, setOrganizationUnitGroup] = useState([]);
  const [organizationUnitLevel, setOrganizationUnitLevel] = useState([]);

  // Hook for managing levels
  const [selectedLevel, setSelectedLevel] = useState("Select Levels");
  // Hook for managing groups
  const [selectedGroup, setSelectedGroup] = useState("Select Groups");

  const [orgUnitLevelNum, setOrgUnitLevelNum] = useState(0)

  const [reportStatus, setReportStatus] = useState(false);

  const selectedGroupName = selectedElementStore.groupName;
  const [elements, setElements] = useState();
  const [configuredDataSet, setConfiguredDataSet] = useState();
  const [orgUnitLevelVisibility, setOrgUnitLevelVisibility] = useState("none");
  const [orgUnitGroupVisibility, setOrgUnitGroupVisibility] = useState("none");

  const { loading, error, data } = useDataQuery(_dataStore, {}, {}, {}, {}, {});
  loading && console.log(loading)
  error && console.log(error)

  useEffect(() => {
    const settings = data !== undefined ? SettingsProcessor(data) : [];
    setSettings(settings.setting);
    setElements(Array.from(new Set(settings.elements)));
    setConfiguredDataSet(Array.from(new Set(settings.dataset)));
  }, [data]);

  useEffect(() => {
    dispatch({
      type: Actions.changeConfiguredDataset,
      payload: { dataset: configuredDataSet },
    });
  }, [configuredDataSet]);

  useEffect(() => {
    dispatch({ type: Actions.changeElement, payload: { elements } });
  }, [elements]);

  useEffect(() => {
    dispatch({type: Actions.changeOrgUnitLevel, payload: {level: orgUnitLevelNum}})
  }, [orgUnitLevelNum])

  // Definition of use effect hooks
  useEffect(() => {
    //setFilteredItem(groups);
    dispatch({ type: Actions.changeGroup, payload: selectedGroupName });
  }, [selectedGroupName]);

  // Function used to process the selected group, it gets the selected group names and code and dispatches action to redux
  const setSelectedDataSet = function (selectedGroup, groupCode) {
    dispatch({ type: Actions.changeDataset, payload: { group: selectedGroup, groupCode } });
  };

  // Utils function used to process the date in iso format, this accepts the date in iso format, preceding year and returns an array of preceding years
  const getPeriodsFromSelectedPeriodAndPrecedingYear = (date, precedingYear) => {
    let _yearSection = date?.length > 4 ? date.substring(0, 4): date
    const _monthSection = date?.length > 4 ? date.substring(4, date.length) : ''
    let _periods = [storeStateSelector.period.selectedPeriodIsoValue]
    // Using the number of preceding years and the selected period in order to get the array of the preceding years
    if(parseInt(precedingYear) > 0){
      for(let i = 0; i < parseInt(precedingYear); i++) {
        _yearSection -= 1
        _periods = [..._periods, `${_yearSection}${_monthSection}`]
      }
    }
    return _periods
  }

  //Loading organization unit group
  useEffect(() => {
    // Load organization unit groups
    loadOrganizationUnitGroups()
      .then((org) => {
        dispatch({
          type: Actions.addOrganizationUnitGroup,
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

  // Process the selected the org unit group information
  const selectedGroupInfo = (e) => {
    e.persist();
    e.stopPropagation();
    setSelectedGroup(e.target.textContent);
    setOrgUnitGroupVisibility("none");
  };

  // Process the selected the org unit level information. 
  const selectedLevelInfo = (e) => {
    e.persist();
    e.stopPropagation();
    setSelectedLevel(e.target.textContent);
    setOrgUnitLevelNum(e.target.getAttribute('level'))
    setOrgUnitLevelVisibility("none");
  };

  const [_dataGroupVisibility, _setDataGroupVisibility] = useState(false);
  const [_orgUnitVisibility, _setOrgUnitVisibility] = useState(false);
  const [_periodVisibility, _setPeriodVisibility] = useState(false);

  // Toggle the visibility of the selected org unit level
  const toggleSelectedLevel = (e) => {
    e.persist();
    setOrgUnitLevelVisibility((prev) => (prev === "none" ? "flex" : "none"));
    setOrgUnitGroupVisibility("none");
  };

  // Toggle the visibility of the selected org unit group
  const toggleSelectedGroup = (e) => {
    e.persist();
    setOrgUnitGroupVisibility((prev) => (prev === "none" ? "flex" : "none"));
    setOrgUnitLevelVisibility("none");
  };

  // Method used to generate the object used to generate the report
  const generateReport = () => {
    
    // Variables to capture the group name and group code
    const {groupCode} = selectedElementStore
    // Variable used to get the config
    const configurationForAnalytics = getConfigObjectsForAnalytics(data.results, groupCode)
    // Variable for the preceding year for reference
    const _precedingYearForReference = storeStateSelector.selectedValue.precedingYearForReference
    // Variable for selected period
    const _selectedPeriod = storeStateSelector.period.selectedPeriodIsoValue
    // Variable for processed periods calcutalated using selected period and preceding year for reference
    const _periods = getPeriodsFromSelectedPeriodAndPrecedingYear(_selectedPeriod, _precedingYearForReference)
    // Calculation of the information to be used for the generation of the report
    
    //******************************
    const _currentPeriod = _periods.length > 0 ? _periods[0] : []
    const _datasets = Object.keys(configurationForAnalytics.dataSets)
    const _dataElements = Object.keys(configurationForAnalytics.dataElementsAndIndicators)
    const _orgUnits = storeStateSelector.selectedValue.orgUnitIDSet
    const _orgUnitLevel = storeStateSelector.selectedValue.orgUnitLevel
    //******************************
    
    // The object that structures the reponse used to generate the report
    const _response =  {
      dataSets: _datasets,
      dataElements: _dataElements,
      orgUnits: _orgUnits,
      orgUnitLevel: `LEVEL-${_orgUnitLevel}`,
      periods: _periods,
      currentPeriod: _currentPeriod
    }
    setReportStatus(true)
  
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
              value={selectedGroupName}
              open={_dataGroupVisibility}
              setOpen={() => _setDataGroupVisibility((prev) => !prev)}
            >
              <div
                className="data-set-info"
                style={{ width: "100%", display: "block" }}
              >
                <ul>
                  {_settings?.map((element) => {
                    return (
                      <li
                        key={element.code}
                        g-code={element.code}
                        onClick={(e) => {
                          e.persist();
                          setSelectedDataSet(e.target.textContent, e.target.getAttribute('g-code'));
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
      
      {reportStatus && <ReportPreview />}
    </div>
  );
};

export default Report;
