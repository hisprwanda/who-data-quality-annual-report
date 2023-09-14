import React, { useState, useEffect } from "react";

import "./style/index.css";

import FixedPeriodComponent from "./FixedPeriodComponent";

// A functional component used to manage the period selection
const PeriodComponent = function () {

  return (
    <div className="period-showable-container">
      <div className="period-selection">
        <FixedPeriodComponent />
      </div>
    </div>
  );
};

export default PeriodComponent;
