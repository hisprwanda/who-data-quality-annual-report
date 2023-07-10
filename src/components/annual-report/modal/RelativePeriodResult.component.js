import React, { useState } from 'react'
import { IconClock16 } from '@dhis2/ui-icons'


export const RelativePeriodResultComponent = () => {
    return (
        <div className='relative-period-result-component-parent'>
            <ul>
                <li>
                    <span><IconClock16/> Today</span>
                </li>
                <li>
                    <span><IconClock16/> Yesterday</span>
                </li>
                <li>
                    <span><IconClock16/> Last 7 days</span>
                </li>
                <li>
                    <span><IconClock16/> Last 14 days</span>
                </li>
                <li>
                    <span><IconClock16/> Last 30 days</span>
                </li>
                <li>
                    <span><IconClock16/> Last 60 days</span>
                </li>
                <li>
                    <span><IconClock16/> Last 90 days</span>
                </li>
                <li>
                    <span><IconClock16/> Last 180 days</span>
                </li>
            </ul>
        </div>
    )
}