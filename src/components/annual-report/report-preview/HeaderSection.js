import React from "react";
import "./styles/headersection.css";
import { completenessLabel } from "../utils/report/ReportLabel.util";
import { ReportDataSection } from "../report-data/ReportData";
import { useSelector, useDispatch } from "react-redux";

export const HeaderSection = ({ main_title, sub_title }) => {

  const storeSelector = useSelector(store => store)
  const actionDispatch = useDispatch()
  const availableDataset = storeSelector.selectedValue.configuredDataset
  const group = storeSelector.selectedValue.dataSet
  const allElements = storeSelector.selectedValue.element
  const orgUnitID = storeSelector.selectedValue.orgUnit.id
  const orgUnitChildren = storeSelector.selectedValue.orgUnit.children
  const period = storeSelector.period.selectedPeriod
  
  return (
    <div className="header-section-parent">
      <div className="header-section-parent-main-title">{main_title}</div>
      <div className="header-section-parent-sub-title">{sub_title}</div>
      <div className="header-section-sub-sub-title">
        <div>{completenessLabel.dataset}</div>
        <div>{completenessLabel.overallScore}</div>
        <div className="header-section-sub-sub-province">
          <div>{completenessLabel.divergentProvince}</div>
          <div>
            <div>{completenessLabel.num}</div>
            <div>{completenessLabel.percentage}</div>
          </div>
        </div>
      </div>
      <ReportDataSection/>
      
    </div>
  );
};
