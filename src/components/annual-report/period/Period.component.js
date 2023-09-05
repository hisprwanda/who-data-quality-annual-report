import React from "react";

import "./style/index.css";

import FixedPeriodComponent from "./FixedPeriodComponent";

const PeriodComponent = function () {
  const processSelectedPeriod = (e) => {
    e.persist();
  };

  return (
    <div className="period-showable-container">
      <div className="period-selection">
        <FixedPeriodComponent processSelectedPeriod={processSelectedPeriod} />
      </div>
    </div>
  );
};

export default PeriodComponent;
