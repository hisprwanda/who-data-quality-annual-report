import React from "react";
import { ParentHeader } from "../ParentHeader";
import { HeaderSection } from "../HeaderSection";
import {
  completenessLabel,
} from "../../utils/report/ReportLabel.util";
import { ReportDataSection } from "../../report-data/ReportDataSection";
import { useSelector, useDispatch } from "react-redux";
import './completeness.css'

export const CompletenessReport = ({ main_title, sub_title }) => {
    
  const storeSelector = useSelector(store => store)
  const actionDispatch = useDispatch()
  const availableDataset = storeSelector.selectedValue.configuredDataset
  const group = storeSelector.selectedValue.dataSet
  const allElements = storeSelector.selectedValue.element
  const orgUnitID = storeSelector.selectedValue.orgUnit.id
  const orgUnitChildren = storeSelector.selectedValue.orgUnit.children
  const period = storeSelector.period.selectedPeriod
  
  return (
    <div>
      <ParentHeader
        main_title={main_title}
        sub_title={sub_title}
        subtitle_display={true}
      />
      <HeaderSection
        main_title={completenessLabel.completenessOfFacilityReporting}
        sub_title={completenessLabel.percentageOfExpectedAndCompleted}
        more_info={completenessLabel.reportingRate}
        dataheader={completenessLabel.dataset}
        reporttype="indicator completeness"
      />
      <ReportDataSection group={group} element={allElements} orgUnit={orgUnitID} children={orgUnitChildren} period={period} dataset={availableDataset} moreinfo='Reporting rate' reporttype='Completeness of facility reporting'/>
      <p></p>
      <HeaderSection
        main_title={completenessLabel.timelinessOfFacility}
        sub_title={completenessLabel.percentageOfExpectedEntered}
        more_info={completenessLabel.reportingRateOnTime}
        dataheader={completenessLabel.dataset}
        reporttype="timeliness"
      />
      <ReportDataSection group={group} element={allElements} orgUnit={orgUnitID} children={orgUnitChildren} period={period} dataset={availableDataset} moreinfo='Reporting rate on time' reporttype='Timeliness of facility reporting'/>
      <p></p>
      <HeaderSection
        main_title={completenessLabel.completenessOfIndicator}
        sub_title={completenessLabel.reportWhereValuesNotMissing}
        more_info={completenessLabel.reportingRateOnTime}
        dataheader={completenessLabel.indicator}
        reporttype="indicator completeness"
      />
      <ReportDataSection group={group} element={allElements} orgUnit={orgUnitID} children={orgUnitChildren} period={period} dataset={availableDataset} moreinfo='Reporting rate on time' reporttype='Completeness of indicator'/>
      <p></p>
      <HeaderSection
        main_title={completenessLabel.consistencyOfDataSet}
        sub_title={completenessLabel.reportWhereValuesNotMissing}
        more_info={completenessLabel.reportingRateOnTime}
        dataheader={completenessLabel.indicator}
        reporttype="consistency"
      />
      <ReportDataSection group={group} element={allElements} orgUnit={orgUnitID} children={orgUnitChildren} period={period} dataset={availableDataset} moreinfo='Reporting rate' reporttype='Completeness of dataset'/>
      <ReportDataSection group={group} element={allElements} orgUnit={orgUnitID} children={orgUnitChildren} period={period} dataset={availableDataset} moreinfo='Reporting rate' reporttype='Completeness of dataset'/>
      <p></p>
    </div>
  );
};
