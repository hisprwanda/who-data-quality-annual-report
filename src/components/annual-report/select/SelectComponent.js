import React, {useState} from "react";
import "./style/select.css";

import down_allow from "../../../assets/images/downarrow.png";

export const SelectComponent = ({ options, onSelect, label, selectedOption, optionVisibility}) => {

  let [display, setDisplay] = useState('none')
  let [selectedOpt, setSelectedOpt] = useState(`Select ${label}`)
  let setVisibility = (e) => {
    setDisplay('none')
    onSelect(e, label)
    setSelectedOpt(e.target.textContent)
    console.log(label,e.target.textContent)
  }

  return (
    <div className="select-parent-container">
      <label>{label}</label>
      <div className="select-header-section" onClick={(e) => setDisplay('flex')}>
        <div className="select-item-selected">{selectedOption}</div>
        <div className="select-header-icon">
          <img src={down_allow} />
        </div>
      </div>
      <div className="select-item-options" style={{display}}>
        <ul>
          {options.map((opt) => (
            <li key={opt.id} onClick={setVisibility} data-key={opt.id}>
              {opt.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
