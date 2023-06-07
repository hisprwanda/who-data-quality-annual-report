import React from 'react'
import { SingleSelect, SingleSelectField, SingleSelectOption } from '@dhis2/ui'


export const FixedPeriodElement = () => {
    return (
        <div className='fixed-element-parent'>
            <div className='emballage'>
                <label>
                    Period Type
                </label>
                <SingleSelect className="select" onChange={()=>{}}>
                    <SingleSelectOption label="Yearly" value="1" />
                    <SingleSelectOption label="Monthly" value="2" />
                    <SingleSelectOption label="Weekly" value="3" />
                    <SingleSelectOption label="Daily" value="4" />
                </SingleSelect>
            </div>
            <div className='emballage'>
                <label>
                    Year
                </label>
                <SingleSelect className="select" onChange={()=>{}} placeholder="Select Year">
                    <SingleSelectOption label="2023" value="1" />
                    <SingleSelectOption label="2022" value="2" />
                    <SingleSelectOption label="2021" value="3" />
                    <SingleSelectOption label="2020" value="4" />
                    <SingleSelectOption label="2019" value="5" />
                </SingleSelect>
            </div>
        </div>
    );
}