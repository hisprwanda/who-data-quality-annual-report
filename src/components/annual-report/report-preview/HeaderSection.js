import React from "react";
import "./styles/headersection.css";
import { completenessLabel } from "../utils/report/ReportLabel.util";
import { OrgUnitComponent } from "../OrgUnit.Component";

export const HeaderSection = ({ main_title, sub_title }) => {
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
      <div className="header-section-data-section">
        <div>{completenessLabel.dataset}</div>
        <div>{completenessLabel.overallScore}</div>
        <div className="header-section-">
          <div>4</div>
          <div>6</div>
        </div>
      </div>
    </div>
  );
};
