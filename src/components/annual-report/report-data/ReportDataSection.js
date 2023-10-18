import React, { useState, useEffect } from "react";
import {
  getHttpRequest,
  loadDatasetInformation,
  loadOrganizationUnit,
  loadReportingRate,
  loadReportingRateOnTime,
} from "../datasource/dataset/dataset.source";
import { completenessLabel } from "../utils/report/ReportLabel.util";

export const ReportDataSection = ({
  group,
  element,
  orgUnit,
  children,
  period,
  dataset,
  moreinfo,
  reporttype,
}) => {
  let [orgUnitLevel, setOrgUnitLevel] = useState(0);
  let [displayDataset, setDisplayDataSet] = useState("");
  let [displayDatasetNumber, setDisplayDatasetNumber] = useState(0);
  let [completenessPercentage, setCompletenessPercentage] = useState(0);

  useEffect(() => {
    const response = loadOrganizationUnit(orgUnit);
    response
      .then((res) => setOrgUnitLevel(res.data.children[0].level))
      .catch((err) => console.log(err));

    const datasetResponse = loadDatasetInformation(dataset);
    datasetResponse
      .then((res) => setDisplayDataSet(res.data.dataSets[0].displayName))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (reporttype === "Completeness of facility reporting") {
      const reportingRateResponse = loadReportingRate(
        dataset,
        orgUnit,
        orgUnitLevel,
        "2022"
      );
      reportingRateResponse
        .then((rate) => setCompletenessPercentage(rate.data.rows[0][3]))
        .catch((err) => console.log(err));
    }
    if (reporttype === "Timeliness of facility reporting") {
      const reportingRateOnTimeResponse = loadReportingRateOnTime(
        dataset,
        orgUnit,
        orgUnitLevel
      );
      reportingRateOnTimeResponse
        .then((rate) => setCompletenessPercentage(rate.data.rows[0][3]))
        .catch((err) => console.log(err));
    }
  }, [orgUnitLevel]);

  const ratingDataSection = (
    dataset,
    moreinfo,
    percentage,
    datasetNum,
    percentageNum,
    reporttype
  ) => {
    return (
      <div>
        <div className="header-section-data-section">
          <div>
            {dataset} - {moreinfo}
          </div>
          <div>{percentage}%</div>
          <div className="header-section-">
            <div>{datasetNum}</div>
            <div>{percentageNum}</div>
          </div>
        </div>
      </div>
    );
  };

  const completenessDataSection = (dataset, moreinfo, percentage, datasetNum) => {
    return (
      <div>
        <div className="header-section-data-section">
          <div>
            {dataset} - {moreinfo}
          </div>
          <div>{percentage}%</div>
          <div className="header-section">
            <div style={{width: '100%', textAlign: 'center'}}>{datasetNum}</div>
          </div>
        </div>
      </div>
    );
  };

  if(reporttype === 'Completeness of dataset' || reporttype === 'Completeness of indicator') {
    return completenessDataSection(displayDataset, moreinfo, completenessPercentage, completenessLabel.percentageNum)
  }else{
    console.log(reporttype)
    return ratingDataSection(
      displayDataset,
      moreinfo,
      completenessPercentage,
      displayDatasetNumber,
      completenessLabel.percentageNum
    );
  }
  
};
