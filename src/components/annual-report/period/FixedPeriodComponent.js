import React, { useState, useEffect } from "react";
import { SelectComponent } from "../select/SelectComponent";
import { Card, Divider, Input } from "@dhis2/ui";

const FixedPeriodComponent = function ({ processSelectedPeriod }) {
  const processNumber = (e) => {
    e.persist();
  };
  let options = [
    { displayName: "First", id: 1 },
    { displayName: "Second", id: 2 },
    { displayName: "Second", id: 3 },
  ];
  return (
    <div>
      <div className="period-selection-container">
        <SelectComponent options={options} />
      </div>
      <Divider />
      <div className="period-selection-container">
        <Card>
          <SelectComponent options={options} />
        </Card>
      </div>
      <Divider />
      <div className="period-selection-container">
        <Input
          name="defaultName"
          onChange={() => {}}
          placeholder="Hold the place"
        />
      </div>
    </div>
  );
};

export default FixedPeriodComponent;
