import React from 'react'

import './styles/datasection.css'
import { HeaderSection } from './HeaderSection'

export const DataSection = ({main_title, sub_title, more_info, dataheader}) => {
    return (
        <div className='data-section-container'>
            <HeaderSection main_title={main_title} sub_title={sub_title} moreinfo={more_info} dataheader={dataheader}/>
        </div>
    )
}