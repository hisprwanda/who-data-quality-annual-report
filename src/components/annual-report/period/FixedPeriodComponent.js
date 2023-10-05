import { generateFixedPeriods } from '@dhis2/multi-calendar-dates'
import { Card, Divider, Input } from '@dhis2/ui'
import moment from 'moment'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SelectComponent } from '../select/SelectComponent.js'
import Actions from '../utils/enum/Index.js'
import { fixedPeriodSource } from '../utils/period/FixedPeriod.source.js'

// A functional component used to manage the fixed period component
const FixedPeriodComponent = function () {
    // VARIABLE DECLATION SECTION
    // ********************
    // A variable for keeping the previous year
    const previousYear = moment(moment().format('YYYY-MM-DD')).year() - 1

    // ********************
    // END OF VARIABLE SECTION

    // HOOKS DECLARATION SECTION
    // ********************

    // A state selector hook
    const stateStoreSelector = useSelector((state) => state)
    // A hook to dispatch an action to the reducer
    const actionDispatch = useDispatch()
    // A state hook to keep the period options
    const [periodTypeOptions] = useState(fixedPeriodSource)
    // A state hook to keep the period options
    const [periodOptions, setPeriodOptions] = useState([])
    // *********************
    // END OF HOOKS SECTION

    // METHOD DECLARATION
    // *****************

    const setPrecedingYearForReference = (year) => {
        actionDispatch({
            type: 'Preceding year for reference',
            payload: { year: year },
        })
    }

    // Method to process the period types selection
    const processPeriodType = (e) => {
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
        setPeriodOptions(generatedFixedPeriod)
        actionDispatch({
            type: Actions.periodSelection,
            payload: {
                periodTextContent: generatedFixedPeriod[0].name,
                periodIsoValue: generatedFixedPeriod[0].id,
            },
        })
        actionDispatch({
            type: Actions.changeSelectedPeriodTypeText,
            payload: { periodType: selectedPeriodTypeTextContent },
        })
    }

    // Method to process the selected period
    const processPeriod = (e) => {
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
                    selectedOption={
                        stateStoreSelector.period.selectedPeriodTypeTextContent
                    }
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
                            stateStoreSelector.period.selectedPeriodTextContent
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
                    onChange={(name) => {
                        setPrecedingYearForReference(name.value)
                    }}
                    placeholder="0"
                />
            </div>
        </div>
    )
}

export default FixedPeriodComponent
