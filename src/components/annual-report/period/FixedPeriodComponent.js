import React, { useState, useEffect } from 'react'
import { SelectComponent } from '../select/SelectComponent'
import { Card, Divider, Input } from '@dhis2/ui'
import { fixedPeriodSource } from '../utils/period/FixedPeriod.source'
import { generateFixedPeriods } from '@dhis2/multi-calendar-dates'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import Actions from '../utils/enum/Index'

// A functional component used to manage the fixed period component
const FixedPeriodComponent = function () {
    // VARIABLE DECLATION SECTION
    // ********************
    // A variable for keeping the previous year
    let previousYear = moment(moment().format('YYYY-MM-DD')).year() - 1
    let selectedPeriodType = fixedPeriodSource[0]
    // ********************
    // END OF VARIABLE SECTION

    // HOOKS DECLARATION SECTION
    // ********************

    // A state selector hook
    let stateStoreSelector = useSelector(state => state)
    console.log(stateStoreSelector)
    // A hook to dispatch an action to the reducer
    let actionDispatch = useDispatch()
    // A state hook to keep the period options
    let [periodTypeOptions, setPeriodTypeOptions] = useState(fixedPeriodSource)
    // A state hook to keep the period options
    let [periodOptions, setPeriodOptions] = useState([])
    // *********************
    // END OF HOOKS SECTION

    // METHOD DECLARATION
    // *****************
    const processSelectedPeriodOption = e => {
        e.persist()
        console.log(e)
    }

    const setPrecedingYearForReference = year => {
        actionDispatch({
            type: 'Preceding year for reference',
            payload: { year: year },
        })
    }

    // Method to process the period types selection
    const processPeriodType = e => {
        e.persist()
        const selectedPeriodTypeTextContent = e.target.textContent
        const selectedPeriodTypeIsoValue = e.target.getAttribute('data-key')
        const params = {
            calendar: 'gregory',
            periodType: selectedPeriodTypeIsoValue,
            year: previousYear,
            locale: 'en',
        }
        const generatedFixedPeriod = generateFixedPeriods(params)
        selectedPeriodType = selectedPeriodTypeTextContent
        setPeriodOptions(generatedFixedPeriod)
        actionDispatch({type: Actions.changeSelectedPeriodTypeText, payload: {periodType: selectedPeriodTypeTextContent}})
    }

    // Method to process the selected period
    const processPeriod = e => {
        e.persist()
        const periodTextContent = e.target.textContent
        const periodIsoValue = e.target.getAttribute('data-key')
        actionDispatch({
            type: Actions.periodSelection,
            payload: { periodTextContent, periodIsoValue },
        })
    }

    // **********************
    // END OF METHOD DECLARATION

    return (
        <div>
            <div className="period-selection-container">
                <SelectComponent
                    selectedOption={selectedPeriodType.name}
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
                        selectedOption={
                            periodOptions.length === 0
                                ? Actions.selectPeriod
                                : periodOptions[0].name
                        }
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
                <Input
                    name="defaultName"
                    onChange={(name, value) => {
                        setPrecedingYearForReference(name.value)
                    }}
                    placeholder="0"
                />
            </div>
        </div>
    )
}

export default FixedPeriodComponent
