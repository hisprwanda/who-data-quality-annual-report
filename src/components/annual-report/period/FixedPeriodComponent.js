import React, { useState, useEffect } from "react";
import { SelectComponent } from "../select/SelectComponent";
import { Card, Divider, Input } from "@dhis2/ui";
import { fixedPeriodSource } from "../utils/period/FixedPeriod.source";
import { generateFixedPeriods } from "@dhis2/multi-calendar-dates";
import moment from "moment";
import { useDispatch } from "react-redux";

const FixedPeriodComponent = function ({ processSelectedPeriod }) {
  
  let [selectedPeriodOption, setSelectedPeriodOption] = useState(fixedPeriodSource[0].name);

  let [processed, setProcessed] = useState([]);
  let [period, setPeriod] = useState('Select Period')
  let previousYear = moment(moment().format('YYYY-MM-DD')).year() - 1
  let actionDispatch = useDispatch()

  const processSelectedPeriodOption = (e) => {
    e.persist()
    const selectedKey = e.target.getAttribute('data-key')
    const selectedContent = e.target.textContent
    const params = {
      calendar: 'gregory',
      periodType: selectedKey,
      year: previousYear,
      locale: 'en'
    }
    const fpSource = fixedPeriodSource.map(d => d.id)
    
    if(fpSource.includes(selectedKey)) {
      setSelectedPeriodOption(selectedContent)
      const generatedPeriod = generateFixedPeriods(params)
      setProcessed(generatedPeriod)
      setPeriod('Select Period')
    }else{
      actionDispatch({type: 'Period Selection', payload: {period: selectedContent}})
      setPeriod(selectedContent)
    } 
  } 

  return (
    <div>
      <div className="period-selection-container">
        <SelectComponent
          selectedOption={selectedPeriodOption}
          options={fixedPeriodSource}
          onSelect={processSelectedPeriodOption}
          label="Period type"
          optionVisibility="flex"
        />
      </div>
      <Divider />
      <div className="period-selection-container">
        <Card>
          <SelectComponent
            selectedOption={period}
            options={processed}
            onSelect={processSelectedPeriodOption}
            label="Period"
            optionVisibility="flex"
          />
        </Card>
      </div>
      <Divider />
      <div className="period-selection-container">
        <label>Preceding years for reference</label>
        <Input name="defaultName" onChange={() => {}} placeholder="0" />
      </div>
    </div>
  );
};

export default FixedPeriodComponent;
