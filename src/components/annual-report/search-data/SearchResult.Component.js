import React from 'react'
import {IconDimensionEventDataItem16} from '@dhis2/ui-icons'


export const SearchResultComponent = () => {
    return (
        <div>
            <ul>
                <li>
                    <span>
                        <IconDimensionEventDataItem16 />
                    </span>
                    <span>
                        First Option
                    </span>
                </li>
                <li>
                    <span>
                        <IconDimensionEventDataItem16 />
                    </span>
                    <span>
                        Second Option
                    </span>
                </li>
                <li>
                    <span className='icon-size'>
                        <IconDimensionEventDataItem16 className="icon-size"/>
                    </span>
                    <span>
                        Second Option
                    </span>
                </li>
            </ul>
        </div>
    );
}