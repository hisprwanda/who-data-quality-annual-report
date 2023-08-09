import React, { useState, useEffect } from "react";
import {
  Button,
  IconArrowLeftMulti24,
  IconArrowRightMulti24,
  IconArrowLeft24,
  IconArrowRight24,
  IconClock16,
} from "@dhis2/ui";

import './style/index.css'

import RelativePeriodComponent from "./RelativePeriod.component";
import FixedPeriodComponent from "./FixedPeriodComponent";
import { useSelector, useDispatch } from "react-redux";
import { processFixedPeriod } from "../utils/period/fixedPeriod.util";

const PeriodComponent = function () {

  let [period, setPeriod] = useState('relative')
  let dispatch = useDispatch()
  let selector = useSelector((state) => state)
  let periodSelected = selector.period.fixedPeriod.period
  
  let [info, setInfo] = useState([])
  useEffect(() => {
    const x = processFixedPeriod(periodSelected)
    setInfo(x)
  }, [periodSelected])
  console.log(info)
  return (
    <div className="period-showable-container">
      <div className="period-selection">
        <div className="period-section-container">
          <div className="select-period-type">
            <ul>
              <li>
                <a
                  id="relative"
                  href="#"
                  onClick={(e) => {
                    e.persist();
                    setPeriod(e.target.id);
                  }}
                >
                  Relative Period
                </a>
              </li>
              <li>
                <a
                  id="fixed"
                  href="#"
                  onClick={(e) => {
                    e.persist();
                    setPeriod(e.target.id);
                  }}
                >
                  Fixed Period
                </a>
              </li>
            </ul>
          </div>
          <div className="period-suboptions">
            <div className="period-suboptions-container">
              <div className="period-suboptions-control">
                {period === 'relative' && <RelativePeriodComponent/>}
                {period === 'fixed' && <FixedPeriodComponent/>}
              </div>
            </div>
          </div>
          <div className="select-period-result">
            <ul>
               {
                 info.length > 0 && info.map(dt => (
                  <li key={dt}>
                    {dt}
                  </li>
                ))
               }
            </ul>
          </div>
        </div>
      </div>
      <div className="period-middle-section">
        <ul>
          <li>
            <Button
              name="Small button"
              onClick={() => {}}
              small
              value="default"
            >
              <IconArrowRightMulti24 />
            </Button>
          </li>
          <li>
            <Button
              name="Small button"
              onClick={() => {}}
              small
              value="default"
            >
              <IconArrowLeft24 />
            </Button>
          </li>
          <li>
            <Button
              name="Small button"
              onClick={() => {}}
              small
              value="default"
            >
              <IconArrowLeftMulti24 />
            </Button>
          </li>
          <li>
            <Button
              name="Small button"
              onClick={() => {}}
              small
              value="default"
            >
              <IconArrowRight24 />
            </Button>
          </li>
        </ul>
      </div>
      <div className="period-result">
        <div>Selected Period</div>
        <div></div>
      </div>
    </div>
  );
};

export default PeriodComponent;
