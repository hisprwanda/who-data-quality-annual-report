import React, { useState } from 'react'
import { SingleSelect, SingleSelectField, SingleSelectOption } from '@dhis2/ui'

export const RelativePeriodComponent = () => {

    let [selectedItem, setSelectedItem] = useState('0')
    return (
        <div className='relative-period-component-parent'>
            <label>
                Period Types
            </label>
            <SingleSelect className="select" onChange={(e) => {setSelectedItem(e.selected)}} selected={selectedItem}>
                <SingleSelectOption label="Days" value="0" />
                <SingleSelectOption label="Weeks" value="1" />
                <SingleSelectOption label="Bi-Weeks" value="2" />
                <SingleSelectOption label="Months" value="3" />
                <SingleSelectOption label="Bi-Months" value="4" />
                <SingleSelectOption label="Quarters" value="5" />
                <SingleSelectOption label="Six Months" value="6" />
                <SingleSelectOption label="Financial Years" value="7" />
                <SingleSelectOption label="Years" value="8" />
            </SingleSelect>
        </div>
    );

}