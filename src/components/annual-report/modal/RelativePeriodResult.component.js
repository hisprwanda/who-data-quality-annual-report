import React, { useState } from 'react'
import { IconClock16 } from '@dhis2/ui-icons'

export const RelativePeriodResultComponent = () => {
    return (
        <div className='relative-period-result-component-parent'>
            <ul>
                <li>
                <span><IconClock16/> Months</span>
                </li>
                <li>
                <span><IconClock16/> Weeks</span>
                </li>
            </ul>
        </div>
    )
}