import React, {useState} from 'react'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'

export const IndicatorGroupList = () => {

    let [selectedItem, setSelectedItem] = useState("0")
    return (
        <div className='indicator-group-parent'>
            <label>Indicator Group</label>
            <SingleSelect className="select" onChange={(e) => {console.log(e)}} selected={selectedItem}>
                <SingleSelectOption label = "All Types" value = "0"/>
                <SingleSelectOption label = "Group One" value = "Group One" />
                <SingleSelectOption label = "Group Two" value = "Group Two" />
                <SingleSelectOption label = "Group Three" value = "Group Three" />
            </SingleSelect>
        </div>
    )
}