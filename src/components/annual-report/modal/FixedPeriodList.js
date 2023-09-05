import React from 'react'
import {IconClock16} from '@dhis2/ui'

export const FixedPeriodList = () => {
    return (
        <div className='fixed-period-list'>
            <ul>
                <li>
                    <span><IconClock16/> 2023 </span>
                </li>
                <li>
                    <span> <IconClock16/> 2022 </span>
                </li>
                <li>
                    <span><IconClock16/> 2021 </span>
                </li>
                <li>
                    <span><IconClock16/> 2020 </span>
                </li>
                <li>
                    <span><IconClock16/> 2019 </span>
                </li>
            </ul>
        </div>
    );
}