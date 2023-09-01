import React, { useState, useEffect } from "react";
import down_allow from "../../../assets/images/downarrow.png";
import { fixedPeriodSource, year } from "../utils/period/FixedPeriod.source";

const FixedPeriodComponent = function ({ processSelectedPeriod }) {
  
  return (
    <div>
      <div className="fixed-period-group">
        <div className="fixed-period-select-title">
          <div className="fixed-period-title-parent">
            <div className="fixed-period-title">
              <div className="fixed-period-select-title-data">
                Choose period
              </div>
              <div className="fixed-period-select-title-icon">
                <img src={down_allow} />
              </div>
            </div>
            <div className="fixed-period-title-showable">
              <ul>
                {fixedPeriodSource.map((pe) => (
                  <li key={pe.id} onClick={processSelectedPeriod}>
                    {pe.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="fixed-period-year-selector">
            <div className="year-section-display">Year</div>
            <div className="year-section-display-showable">Showable</div>
          </div>
        </div>
        <div className="select-options"></div>
      </div>
    </div>
  );
};

export default FixedPeriodComponent;
