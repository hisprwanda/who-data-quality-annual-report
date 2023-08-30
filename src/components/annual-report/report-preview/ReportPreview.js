import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  ButtonStrip,
  DataTable,
  TableBody,
  TableHead,
  DataTableRow,
  DataTableColumnHeader,
  DataTableCell,
} from "@dhis2/ui";
import "./styles/reportpreview.css";
import logo from "../../../assets/images/WHO_logo.png";
import {
  loadAnalytics,
  loadAnalyticsInformation,
  loadDataElements,
} from "../datasource/dataset/dataset.source";
import { useDataQuery } from "@dhis2/app-runtime";
import {
  completenessLabel,
  mainHeaderLabel,
} from "../utils/report/ReportLabel.util";
import { HeaderSection } from "./HeaderSection";
import { ParentHeader } from "./ParentHeader";
import { DataSection } from "./DataSection";

const ReportPreview = () => {
  let storeSelector = useSelector((store) => store);
  let storeDispatch = useDispatch();
  let { loading, error, data } = useDataQuery(
    loadAnalytics,
    {},
    {},
    {},
    {},
    {}
  );

  const availableDataset = storeSelector.selectedValue.configuredDataset;
  const group = storeSelector.selectedValue.dataSet;
  const allElements = storeSelector.selectedValue.element;
  const orgUnitID = storeSelector.selectedValue.orgUnit.id;
  const orgUnitChildren = storeSelector.selectedValue.orgUnit.children;
  const period = storeSelector.period.selectedPeriod;
  //let response = useDataQuery(loadAnalyticsInformation(), {}, {}, {}, {}, {});
  let dataElementRequest = useDataQuery(loadDataElements(allElements, false));

  return (
    <div className="report-preview report-preview-container">
      <ParentHeader
        main_title={mainHeaderLabel.summary}
        sub_title={completenessLabel.completeness}
      />
      <DataSection
        main_title={completenessLabel.completenessOfFacilityReporting}
        sub_title={completenessLabel.percentageOfExpectedAndCompleted}
        more_info={completenessLabel.reportingRate}
        dataheader={completenessLabel.dataset}
      /> 
      <p></p>

      <DataSection
        main_title={completenessLabel.timelinessOfFacility}
        sub_title={completenessLabel.percentageOfExpectedEntered}
        more_info={completenessLabel.reportingRateOnTime}
        dataheader={completenessLabel.dataset}
      />
      <p></p>
      <DataSection
        main_title={completenessLabel.completenessOfIndicator}
        sub_title={completenessLabel.reportWhereValuesNotMissing}
        more_info={completenessLabel.reportingRateOnTime}
        dataheader={completenessLabel.indicator}
      />      
    </div>
  );
};

export default ReportPreview;
