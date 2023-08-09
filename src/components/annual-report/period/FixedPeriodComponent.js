import React, {useState, useEffect} from "react";
import down_allow from "../../../assets/images/downarrow.png";
import { fixedPeriodSource, year } from "../utils/period/FixedPeriod.source";
import { processFixedPeriod } from "../utils/period/fixedPeriod.util";
import { useDispatch, useSelector } from "react-redux";


const FixedPeriodComponent = function () {

  let fixedPeriods = fixedPeriodSource
  const periods = [{names: 'Year', id: 'Year'}, {names: 'Month', id: 'Month'}, {names: 'Weekly', id: 'Weekly'}, {names: 'Daily', id: 'Daily'}]
  let [relativePeriodSelected, setRelativePeriodSelected] = useState(fixedPeriodSource[0])
  let cssVariables = document.querySelector(':root')
  let computedStyles = getComputedStyle(cssVariables)
  const fixed = processFixedPeriod(relativePeriodSelected)
  const [chosenPeriod, setChosenPeriod] = useState('')
  let choosePeriod = function(e) {
    cssVariables.style.setProperty('--visibility', 'none')
  }

  useEffect(() => {
    cssVariables.style.setProperty('--visibility', 'none')
    dispatchEvent({type: 'Change Fixed Period', payload: {period: chosenPeriod, year: 3500}})
  }, [chosenPeriod])

  let displayShowable = function(e) {
    cssVariables.style.setProperty('--visibility', 'block')
  }

  let selectedElementStore = useSelector((state) => state);
  let dispatchEvent = useDispatch()
  
  return (
    <div>
      <div className="fixed-period-group">
        <div className="fixed-period-select-title">
          <div className="fixed-period-title-parent">
            <label>Period type {
                selectedElementStore.period.fixedPeriod.period
              }</label>
            <div className="fixed-period-title" onClick={(e) => {e.persist(); displayShowable(e)}}>
              <div className="fixed-period-select-title-data">
                {chosenPeriod}
              </div>
              <div className="fixed-period-select-title-icon">
                <img src={down_allow} />
              </div>
            </div>
            <div className="fixed-period-title-showable">
              <ul>
                {
                  fixedPeriods.map(info => (
                    <li onClick={(e) => {e.persist(); setChosenPeriod(e.target.textContent)}} key={info}>{info}</li>
                  ))
                }
              </ul>
               
            </div>
          </div>
          <div>
            <label>Year</label>
            <input type="number"/>
          </div>
        </div>
        <div className="select-options">
        
        </div>
      </div>
    </div>
  );
};

export default FixedPeriodComponent;
