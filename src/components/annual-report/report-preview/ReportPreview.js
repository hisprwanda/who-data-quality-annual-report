import { useState, useEffect } from "react"
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

  let storeSelector = useSelector(store => store)
  let storeDispatch = useDispatch()
  
  let { loading, error, data } = useDataQuery(
    loadAnalytics,
    {},
    {},
    {},
    {},
    {}
  );
  let response = useDataQuery(loadAnalyticsInformation(), {}, {}, {}, {}, {});

  console.log(storeSelector)

  return (
    <div className="report-preview report-preview-container">
      <ParentHeader
        main_title={mainHeaderLabel.summary}
        sub_title={completenessLabel.completeness}
      />
      <DataSection
        main_title={completenessLabel.completenessOfFacilityReporting}
        sub_title={completenessLabel.percentageOfExpectedAndCompleted}
      />
    </div>
  );
};

export default ReportPreview;
