import React from "react";
import down_allow from "../../../assets/images/downarrow.png";
import { relativePeriodSource } from "../utils/period/RelativePeriod.source";

const RelativePeriodComponent = function () {

  let setRelativePeriodSelected = function (e) {
    // console.log(e);
  };
  let relativePeriodSelected = "";
  return (
    <div>
        Relative Period
      <div className="group">
        <div className="select-title">
          <div className="select-title-data">{relativePeriodSelected}</div>
          <div className="select-title-icon">
            <img src={down_allow} />
          </div>
        </div>
        <div className="select-options">
          <ul>
            <li
              onClick={(e) => {
                e.persist();
                setRelativePeriodSelected(e.target.textContent);
              }}
            >
              Days
            </li>
            <li
              onClick={(e) => {
                e.persist();
                setRelativePeriodSelected(e.target.textContent);
              }}
            >
              Weeks
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RelativePeriodComponent;
