import { useSelector, useDispatch } from "react-redux";
import "./styles/reportpreview.css";
import {
  loadAnalytics,
} from "../datasource/dataset/dataset.source";
import { useDataQuery } from "@dhis2/app-runtime";
import {
  completenessLabel,
  mainHeaderLabel,
} from "../utils/report/ReportLabel.util";
import { CompletenessReport } from "./completness/CompletenessReport";
import { InternalConsistencyReport } from "./internalconsistency/InternalConsistencyReport";

const ReportPreview = () => {
  return (
    <div className="report-preview report-preview-container">
      <CompletenessReport
        main_title={mainHeaderLabel.summary}
        sub_title={completenessLabel.completeness}
      />
      <p></p>
      <InternalConsistencyReport
        main_title={mainHeaderLabel.internalConsistency}
        sub_title=""
      />
    </div>
  );
};

export default ReportPreview;
