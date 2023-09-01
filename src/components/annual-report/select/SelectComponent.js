import React from "react";
import "./style/select.css";
import down_allow from "../../../assets/images/downarrow.png";

export const SelectComponent = ({ options }) => {
  return (
    <div className="select-parent-container">
      <div className="select-header-section">
        <div className="select-item-selected">Choose period</div>
        <div className="select-header-icon">
          <img src={down_allow} />
        </div>
      </div>
      <div className="select-item-options">
        <ul>
          {options.map((opt) => (
            <li key={opt.id}>
              {opt.displayName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
