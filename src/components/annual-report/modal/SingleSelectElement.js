import React from 'react'
import { SingleSelect, SingleSelectField, SingleSelectOption } from '@dhis2/ui'

export const SingleSelectElement = () => {

    return (
        <div className='emballage'>
            <label>
                Period Type
            </label>
            <SingleSelect className="select" onChange={()=>{}}>
                <SingleSelectOption label="Financial Years" value="1" />
                <SingleSelectOption label="Education Years" value="2" />
            </SingleSelect>
        </div>
    );

}