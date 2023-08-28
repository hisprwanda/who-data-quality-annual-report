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
import {
  Button,
  IconArrowLeftMulti24,
  IconArrowRightMulti24,
  IconArrowLeft24,
  IconArrowRight24,
  IconClock16,
} from "@dhis2/ui";
import { DataSetModal } from "../../components/annual-report/modal/data-sets/DataSetModal";
import { PeriodModal } from "../../components/annual-report/modal/period/PeriodModal";
import { OrganizationUnitModal } from "../../components/annual-report/modal/organizationunit/OrganizationUnitModal";
import { loadDataStore, loadAnalytics } from "../../components/annual-report/datasource/dataset/dataset.source";
import { useDataQuery } from "@dhis2/app-runtime";
import { OrgUnitComponent } from "../../components/annual-report/OrgUnit.Component";
import down_allow from "../../assets/images/downarrow.png";
import ReportPreview from "../../components/annual-report/report-preview/ReportPreview";
import { useDispatch, useSelector } from "react-redux";
import PeriodComponent from "../../components/annual-report/period/Period.component";
import { getAnalytics } from "../../components/annual-report/utils/enum/HttpRequest.util";
import { SettingsProcessor } from "../../utils/SettingsProcessor";

// End of imports

// Start of the functional component definition
const Report = function () {
  // Redux state selector hook
  let selectedElementStore = useSelector((state) => state.selectedValue);
  let storeStateSelector = useSelector(state => state)
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
  let [_settings, setSettings] = useState([])
  // End of the hook for managing settings 

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

  let reportLoader = (orgUnit, period, group) => {
    dispatch({type: 'Change Report View Status', payload: {status: true}})
    console.log(orgUnit, period, group)
  }
  let { loading, error, data } = useDataQuery(_dataStore, {}, {}, {}, {}, {})
  
  useEffect(() => { 
    let settings = data !== undefined ? SettingsProcessor(data) : []
    setSettings(settings)
  }, [data])
  
  // Definition of use effect hooks
  useEffect(() => {
    let groups = data?.results.groups.filter((i) => i.code === selectedItem);
    setFilteredItem(groups);
    dispatch({type: 'Change Group', payload: selectedItem})
    console.log(storeStateSelector)
  }, [selectedItem]);

  useEffect(() => {
    reportStatus != reportStatus;
  }, reportStatus);

  useEffect(() => {
    console.log(selectedGroup);
  }, [selectedGroup]);

  useEffect(() => {
    console.log(selectedLevel);
  }, [selectedLevel]);

  let setSelectedDataSet = function (chosenElement) {
    dispatch({ type: "Change Dataset", payload: { el: chosenElement } });
  };

  return (
    <div className="reportContainer">
      <MenuBar />
      <DataSetModal
        status={dataSetModalStatus}
        changeDataModalStatus={setDataSetModalStatus}
      />
      <PeriodModal
        status={periodModalStatus}
        changePeriodModalStatus={setPeriodModalStatus}
      />
      <OrganizationUnitModal
        status={orgUnitModalStatus}
        changeOrganisationUnitStatus={setOrgUnitModalStatus}
      />
      <div className="menu-parent">
        <div className="menu-parent-container">
          <div className="data-set-container">
            <div className="dataset-indication">
              <div>Group</div>
              <div>{selectedItem}</div>
              <div>
                <img src={down_allow} />
              </div>
            </div>
            <div className="data-showable">
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
          </div>
          <div className="orgunit-container">
            <div className="ou-indication">
              <div>Organisation Unit</div>
              <div>{_selectedOrgUnit}</div>
              <div>
                <img src={down_allow} />
              </div>
            </div>
            <div className="ou-showable">
              <div>
                <OrgUnitComponent />
              </div>
              <div className="dividing"></div>
              <div className="level-and-groups">
                <div className="level">
                  <div className="select-title">
                    <div className="select-title-data">{selectedLevel}</div>
                    <div className="select-title-icon">
                      <img src={down_allow} />
                    </div>
                  </div>
                  <div className="select-options">
                    <ul>
                      <li
                        onClick={(e) => {
                          e.persist();
                          setSelectedLevel(e.target.textContent);
                        }}
                      >
                        Province
                      </li>
                      <li
                        onClick={(e) => {
                          e.persist();
                          setSelectedLevel(e.target.textContent);
                        }}
                      >
                        District
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="group">
                  <div className="select-title">
                    <div className="select-title-data">{selectedGroup}</div>
                    <div className="select-title-icon">
                      <img src={down_allow} />
                    </div>
                  </div>
                  <div className="select-options">
                    <ul>
                      <li
                        onClick={(e) => {
                          e.persist();
                          setSelectedGroup(e.target.textContent);
                        }}
                      >
                        Military Hospital
                      </li>
                      <li
                        onClick={(e) => {
                          e.persist();
                          setSelectedGroup(e.target.textContent);
                        }}
                      >
                        District Province
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="period-container">
            <div className="period-indication">
              <div>Period</div>
              <div>{_selectedPeriod}</div>
              <div>
                <img src={down_allow} />
              </div>
            </div>
            <div className="period-showable">
              <PeriodComponent />
            </div>
          </div>
          <div>
            <div>
              <div>
                <Button
                  name="Basic button"
                  onClick={() => reportLoader(_selectedOrgUnit, storeStateSelector.period.selectedPeriod, selectedItem)}
                  default
                  value="default"
                >
                  Generate Report
                </Button>
              </div>
              <div>
                <Button
                  name="Primary button"
                  primary
                  value="Print"
                >
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="report-section">{storeStateSelector.reportViewStatus && <ReportPreview />}</div>
    </div>
  );
};

export default Report;
