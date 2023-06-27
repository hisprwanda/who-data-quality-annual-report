import React, {useState} from 'react'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'

export const DataElementGroupList = () => {

    let [elementGroupSelectedItem, setElementGroupSelectedItem] = useState("0")
    let [disaggregationSelectedItem, setDisaggregationSelectedItem] = useState("0")

    return (
        <div className='data-element-group-list-parent'>
            <div>
                <label>Data Element Group</label>
                <SingleSelect className="select" onChange={(e) => {setElementGroupSelectedItem(e.selected)}} selected={elementGroupSelectedItem}>
                    <SingleSelectOption label = "All Types" value = "0"/>
                    <SingleSelectOption label = "Element Group One" value = "Element Group One" />
                    <SingleSelectOption label = "Element Group Two" value = "Element Group Two" />
                    <SingleSelectOption label = "Element Group Three" value = "Element Group Three" />
                </SingleSelect>
            </div>
            <div>
                <label>Disaggregation</label>
                <SingleSelect className="select" onChange={(e) => {setDisaggregationSelectedItem(e.selected)}} selected={disaggregationSelectedItem}>
                    <SingleSelectOption label = "All Types" value = "0"/>
                    <SingleSelectOption label = "Disaggregation One" value = "Disaggregation One" />
                    <SingleSelectOption label = "Disaggregation Two" value = "Disaggregation Two" />
                    <SingleSelectOption label = "Disaggregation Three" value = "Disaggregation Three" />
                </SingleSelect>
            </div>
        </div>
    )
}