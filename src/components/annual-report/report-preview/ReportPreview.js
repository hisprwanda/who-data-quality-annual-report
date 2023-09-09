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
  loadDataStore,
} from "../datasource/dataset/dataset.source";
import { useDataQuery } from "@dhis2/app-runtime";
import {
  completenessLabel,
  mainHeaderLabel,
} from "../utils/report/ReportLabel.util";
import { HeaderSection } from "./HeaderSection";
import { ParentHeader } from "./ParentHeader";
import { DataSection } from "./DataSection";
import { CompletenessReport } from "./completness/CompletenessReport";
import { InternalConsistencyReport } from "./internalconsistency/InternalConsistencyReport";
import { processReportData } from "../utils/report/GenerateReportData";

const ReportPreview = ({status}) => {

  let { loading, error, data } = useDataQuery(loadDataStore);

  if(data) {
    const dataSetInfo = data.results.dataSets.map(dt => {
      return {
        dataset: dt.id,
        threshold: dt.threshold
      }
    })

    const reportData = processReportData(dataSetInfo)
    console.log(reportData)
  }

  return (
    <div className="report-preview report-preview-container">
      report status {status.toString()}
    </div>
  );
};

export default ReportPreview;
