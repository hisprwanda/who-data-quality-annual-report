import React from 'react'
import { DataElementGroupSelect } from '../numerators/DataElementGroupsSelect.js'
import { DataElementSelect } from '../numerators/DataElementSelect.js'
import { DataElementTypeRadios } from '../numerators/DataElementTypeRadios.js'

export const DataMappingFormSection = () => {
    return (
        <div>
            {/* currently hidden until Indicator form is implemented: */}
            {/* <DataTypeRadios /> */}

            <DataElementTypeRadios />
            <DataElementGroupSelect />
            <DataElementSelect />
        </div>
    )
}
