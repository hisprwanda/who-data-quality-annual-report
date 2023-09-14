import React, { useState, useEffect } from "react";
import { SelectComponent } from "../select/SelectComponent";
import { Card, Divider, Input } from "@dhis2/ui";
import { fixedPeriodSource } from "../utils/period/FixedPeriod.source";
import { generateFixedPeriods } from "@dhis2/multi-calendar-dates";
import moment from "moment";
import { useDispatch } from "react-redux";
import Actions from "../utils/enum/Index";

// A functional component used to manage the fixed period component
const FixedPeriodComponent = function () {
  
  // A state variable used to keep the selected period
  let [selectedPeriodOption, setSelectedPeriodOption] = useState(fixedPeriodSource[0].name);

  // A state hook used to keep the processed
   let [processed, setProcessed] = useState([]);
   let [period, setPeriod] = useState('Select Period')
   let previousYear = moment(moment().format('YYYY-MM-DD')).year() - 1
   let actionDispatch = useDispatch()
  console.log(fixedPeriodSource)
   // A state hook to keep the period options
   let [periodTypeOptions, setPeriodTypeOptions] = useState([])
   // A state hook to keep the period options 
   let [periodOptions, setPeriodOptions] = useState([])

  // // Method used to process the selected period options
  // const processSelectedPeriodOption = (e) => {
  //   e.persist()
  //   const selectedKey = e.target.getAttribute('data-key')
  //   const selectedContent = e.target.textContent
  //   const params = {
  //     calendar: 'gregory',
  //     periodType: selectedKey,
  //     year: previousYear,
  //     locale: 'en'
  //   }
  //   const x = fixedPeriodSource.map(d => d.id)
  //   if(x.includes(selectedKey)) {
  //     setSelectedPeriodOption(selectedContent)
  //     const generatedPeriod = generateFixedPeriods(params)
  //     setProcessed(generatedPeriod)
  //     setPeriod('Select Period')
  //   }else{
  //     actionDispatch({type: 'Period Selection', payload: {period: selectedContent}})
  //     setPeriod(selectedContent)
  //   } 
  // }

  // const setPrecedingYearForReference = (year) => {
  //   actionDispatch({type: 'Preceding year for reference', payload: {year: year}})
  // }

  const processSelectedPeriodOption = (e) => {
    e.persist()
    console.log(e)
  }

  const processPeriodType = (e) => {
    e.persist()
    console.log(e.target)
  }

  const processPeriod = (e) => {
    e.persist()
    console.log(e.target)
  }

  return (
    <div>
      <div className="period-selection-container">
        <SelectComponent
          selectedOption={periodTypeOptions.length === 0 ? Actions.selectPeriodType : periodTypeOptions[0].name}
          options={periodTypeOptions}
          onSelect={processPeriodType}
          label="Period type"
          optionVisibility="flex"
        />
      </div>
      <Divider />
      <div className="period-selection-container">
        <Card>
          <SelectComponent
            selectedOption={periodOptions.length === 0 ? Actions.selectPeriod : periodOptions[0].name}
            options={periodOptions}
            onSelect={processPeriod}
            label="Period"
            optionVisibility="flex"
          />
        </Card>
      </div>
      <Divider />
      <div className="period-selection-container">
        <label>Preceding years for reference</label>
        <Input name="defaultName" onChange = {(name, value) => {setPrecedingYearForReference(name.value)}}  placeholder="0" />
      </div>
    </div>
  );
};

export default FixedPeriodComponent;
