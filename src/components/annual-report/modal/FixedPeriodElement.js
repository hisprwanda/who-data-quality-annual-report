import React from 'react'
import { SingleSelect, SingleSelectField, SingleSelectOption, Input } from '@dhis2/ui'


export const FixedPeriodElement = () => {
    return (
        <div className='fixed-element-parent'>
            <div>
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
            <div>
                <label>
                    Year
                </label>
                <Input max="2030" min="2023" name="defaultName" onChange={() => {}} step="1" type="number" />
            </div>
        </div>
    );
}