import React, { useState, useEffect } from "react";
import down_allow from "../../../assets/images/downarrow.png";
import { fixedPeriodSource, year } from "../utils/period/FixedPeriod.source";
import { SingleSelect, SingleSelectOption } from "@dhis2/ui";

const FixedPeriodComponent = function ({ processSelectedPeriod }) {
  const processNumber = (e) => {
    e.persist();
  };
  let data = 20;
  return (
    <div>
      <div className="fixed-period-group">
        <div className="fixed-period-select-title">
          <SingleSelect className="select" onChange={() => console.log()}>
            <SingleSelectOption label="option one" value="1" />
            <SingleSelectOption label="option two" value="2" />
            <SingleSelectOption label="option three" value="3" />
          </SingleSelect>
        </div>
        <div className="select-options"></div>
      </div>
    </div>
  );
};

export default FixedPeriodComponent;
