import React, {useState} from 'react'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
export const DataSetGroupList = () => {

    let [dataSet, setDataSet] = useState("0")
    let [metricsType, setMetricsType] = useState("0")

    return (
        <div className='data-set-group-list-parent'>
            <div>
                <label>Data Set</label>
                <SingleSelect className="select" onChange={(e) => {setDataSet(e.selected)}} selected={dataSet}>
                    <SingleSelectOption label = "All Data Sets" value = "0"/>
                    <SingleSelectOption label = "Data set One" value = "Data set One" />
                    <SingleSelectOption label = "Data set Two" value = "Data set Two" />
                    <SingleSelectOption label = "Data set Three" value = "Data set three" />
                </SingleSelect>
            </div>
            <div>
                <label>Metrics Type</label>
                <SingleSelect className="select" onChange={(e) => {setMetricsType(e.selected)}} selected={metricsType}>
                    <SingleSelectOption label = "All Metrics Type" value = "0"/>
                    <SingleSelectOption label = "Metrics One" value = "Metrics One" />
                    <SingleSelectOption label = "Metrics Two" value = "Metrics Two" />
                    <SingleSelectOption label = "Metrics Three" value = "Metrics Three" />
                </SingleSelect>
            </div>
        </div>
    )
}