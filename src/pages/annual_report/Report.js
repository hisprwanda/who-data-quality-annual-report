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
import { Button } from "@dhis2/ui";
import { DataSetModal } from "../../components/annual-report/modal/data-sets/DataSetModal";
import { PeriodModal } from "../../components/annual-report/modal/period/PeriodModal";
import { OrganizationUnitModal } from "../../components/annual-report/modal/organizationunit/OrganizationUnitModal";
import {
  loadDataStore,
  loadAnalytics,
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
// End of imports


// report queries
const reportQueries = {
  reporting_rate_over_all_org_units: {
    resource: 'analytics.json',
    params: {
      dimension:"dx:YmRjo8j3F3M.REPORTING_RATE,ou:lZsCb6y0KDX,pe:2019;2020;2021;2022"
  },
}
  // reporting_rate_org_unit_level: {
  //   resource: 'analytics.json',
  //   params: {
  //     dimension: 'dx:YmRjo8j3F3M.REPORTING_RATE',
  //     dimension:'ou:lZsCb6y0KDX;LEVEL-2',
  //     dimension:'pe:2019;2020;2021;2022',
  //   }
  // },
  
};



// Start of the functional component definition

const Report = function () {
  // Redux state selector hook
  let selectedElementStore = useSelector((state) => state.selectedValue);
  let storeStateSelector = useSelector((state) => state);
  // Redux state dispatch hook
  let dispatch = useDispatch();

  // Hook for managing data set modals
  let [dataSetModalStatus, setDataSetModalStatus] = useState(true);
  // End of hook for managing data set modals

  // Hook for managing period modal
  let [periodModalStatus, setPeriodModalStatus] = useState(true);
  // End of hook for managing period modal

  // Hook for managing org unit modal
  let [orgUnitModalStatus, setOrgUnitModalStatus] = useState(true);
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

  let [reportStatus, setReportStatus] = useState(false);

  let selectedItem = selectedElementStore.dataSet;
  let [filteredItem, setFilteredItem] = useState([]);
  let _selectedPeriod = selectedElementStore.period;
  let _selectedOrgUnit = selectedElementStore.orgUnit.displayName;
  let [relativePeriodSelected, setRelativePeriodSelected] = useState("");
  let [elements, setElements] = useState();
  let [configuredDataSet, setConfiguredDataSet] = useState();
  let [groupVisibility, setGroupVisibility] = useState("none");
  let [orgUnitVisibility, setOrgUnitVisibility] = useState("none");
  let [orgUnitLevelVisibility, setOrgUnitLevelVisibility] = useState("none");
  let [orgUnitGroupVisibility, setOrgUnitGroupVisibility] = useState("none");

  let reportLoader = (orgUnit, period, group) => {
    dispatch({ type: "Change Report View Status", payload: { status: true } });
  };
  let { loading, error, data } = useDataQuery(_dataStore, {}, {}, {}, {}, {});

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
      setOrganizationUnitLevel(ou.data.organisationUnitLevels);
    });
  }, []);

  let selectedGroupInfo = (e) => {
    e.persist();
    setSelectedGroup(e.target.textContent);
    setOrgUnitGroupVisibility("none");
  };

  let selectedLevelInfo = (e) => {
    e.persist();
    setSelectedLevel(e.target.textContent);
    setOrgUnitLevelVisibility("some information");
  };
  let [x, setX] = useState("x")
  let [periodVisibility, setPeriodVisibility] = useState("none")

  return (
    <div className="reportContainer">
      <MenuBar />
      <OrganizationUnitModal
        status={orgUnitModalStatus}
        changeOrganisationUnitStatus={setOrgUnitModalStatus}
      />
      <div className="menu-parent">
        <div className="menu-parent-container">
          <div className="data-set-container">
            <div
              className="dataset-indication"
              onClick={() => setGroupVisibility("flex")}
            >
              <div>Group</div>
              <div>{selectedItem}</div>
              <div>
                <img src={down_allow} />
              </div>
            </div>
            <div className="data-showable" style={{ display: groupVisibility }}>
              <ul>
                {_settings?.map((element, info) => {
                  return (
                    <li
                      key={element.code}
                      onClick={(e) => {
                        e.persist();
                        setSelectedDataSet(e.target.textContent);
                        setGroupVisibility("none");
                      }}
                    >
                      {element.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="orgunit-container">
            <div
              className="ou-indication"
              onClick={() => setOrgUnitVisibility("flex")}
            >
              <div>Organisation Unit</div>
              <div></div>
              <div>
                <img src={down_allow} />
              </div>
            </div>
            <div className="ou-showable" style={{ display: orgUnitVisibility }}>
              <div>
                <OrgUnitComponent />
              </div>
              <div className="level-and-groups">
                <div
                  className="level"
                  onClick={() => setOrgUnitLevelVisibility("flex")}
                >
                  <div className="select-title">
                    <div className="select-title-data">{selectedLevel}</div>
                    <div className="select-title-icon">
                      <img src={down_allow} onClick={() => setOrgUnitLevelVisibility('none')}/>
                    </div>
                  </div>
                  <div
                    className="select-options"
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
                <div className="group">
                  <div
                    className="select-title"
                    onClick={() => setOrgUnitGroupVisibility("flex")}
                  >
                    <div className="select-title-data">{selectedGroup}</div>
                    <div className="select-title-icon">
                      <img src={down_allow} />
                    </div>
                  </div>
                  <div
                    className="select-options"
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
              </div>
              <div className="update-or-close">
                <div>
                  <span>Selected: </span>
                  {selectedElementStore.orgUnitSet.length - 1} org units{" "}
                  <span>
                    <Button small onClick={() => console.log("Deselect all")}>
                      Deselect All
                    </Button>
                  </span>
                </div>
                <div>
                  <Button primary small onClick={() => setOrgUnitVisibility("none")}>Hide</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="period-container">
            <div className="period-indication" onClick={() => setPeriodVisibility("flex")}>
              <div>Period</div>
              <div>{storeStateSelector.period.selectedPeriod}</div>
              <div>
                <img src={down_allow} />
              </div>
            </div>
            <div className="period-showable" style={{display: periodVisibility}}>
              <PeriodComponent />
              <div className="open-or-close">
                <Button small primary onClick={() => setPeriodVisibility('none')}>Hide</Button>  
              </div> 
            </div>
          </div>
          <div>
            <div>
              <div>
                <Button
                  name="Basic button"
                  onClick={() =>
                    reportLoader(
                      _selectedOrgUnit,
                      storeStateSelector.period.selectedPeriod,
                      selectedItem
                    )
                  }
                  default
                  value="default"
                >
                  Generate Report
                </Button>
              </div>
              <div>
                <Button name="Primary button" primary value="Print">
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="report-section">
        {storeStateSelector.reportViewStatus && <ReportPreview />}
      </div>
    </div>
  );
};

export default Report;
