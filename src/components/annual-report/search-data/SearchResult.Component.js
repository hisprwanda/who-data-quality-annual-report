import React, {useState} from 'react'
import {IconDimensionEventDataItem16} from '@dhis2/ui-icons'

export const SearchResultComponent = () => {

    return (
        <div>
           
            <ul>
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