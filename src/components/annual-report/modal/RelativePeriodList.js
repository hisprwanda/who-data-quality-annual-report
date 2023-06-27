import React from 'react'
import {IconClock16} from '@dhis2/ui'

export const RelativePeriodList = () => {
    return (
        <div className='fixed-period-list'>
            <ul>
                <li><span><IconClock16/> This financial year</span></li>
                <li><span><IconClock16/> Last financial year</span></li>
                <li><span><IconClock16/> Last 5 financial years</span></li>
            </ul>
        </div>
    );
}