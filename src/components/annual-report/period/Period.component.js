import React, { useState, useEffect } from "react";
import {
  Button,
  IconArrowLeftMulti24,
  IconArrowRightMulti24,
  IconArrowLeft24,
  IconArrowRight24,
  IconClock16,
} from "@dhis2/ui";

import "./style/index.css";

import RelativePeriodComponent from "./RelativePeriod.component";
import FixedPeriodComponent from "./FixedPeriodComponent";
import { useSelector, useDispatch } from "react-redux";
import { processFixedPeriod } from "../utils/period/fixedPeriod.util";

const PeriodComponent = function () {
  let [chosenPeriodArr, setChosenPeriodArr] = useState([]);
  let [info, setInfo] = useState([]);
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
