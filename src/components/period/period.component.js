import React, { useState } from 'react'
import { Modal, ModalActions, ModalTitle, ModalContent, ButtonStrip, Button, SingleSelect, SingleSelectField, SingleSelectOption, Divider } from '@dhis2/ui'
import {IconArrowLeftMulti24, IconArrowRightMulti24, IconArrowLeft24, IconArrowRight24} from '@dhis2/ui'
import './style/periodmodal.css'
import { FixedPeriodElement } from './child/FixedPeriodElement'
import { RelativePeriodComponent } from './child/RelativePeriod.component'
import { RelativePeriodResultComponent } from './child/RelativePeriodResult.component'

export const PeriodComponent = (props) => {

    let [selectedPeriod, setSelectedPeriod] = useState('Relative')
    let [modalStatus, setModalStatus] = useState(props.status)

    return (
        <div>
            <div className='period-modal-parent-element'>
                    <div className='period-modal-data-source'>
                        <div className='period-modal-data-source-menu'>
                            <ul>
                                <li onClick={(e) => {setSelectedPeriod('Relative')}} className='source-relative-period'>
                                    Relative Periods
                                </li>
                                <li onClick={(e) => {setSelectedPeriod('Fixed')}} className='source-fixed-period'>
                                    Fixed Periods
                                </li>
                            </ul>
                        </div>
                        
                        <div className='period-modal-data-source-center'>
                            { selectedPeriod === 'Relative' ? <RelativePeriodComponent/> : <FixedPeriodElement/> }
                        </div>

                        <div className='period-modal-data-source-result'>
                            <RelativePeriodResultComponent />
                        </div>
                    </div>
                    <div className='transfer-element'>
                        <ul>
                            <li>
                                <Button name="Small button" onClick={() => {}} small value="default">
                                    <IconArrowRightMulti24/>
                                </Button>
                            </li>
                            <li>
                                <Button name="Small button" onClick={() => {}} small value="default">
                                    <IconArrowLeft24/>
                                </Button>
                            </li>
                            <li>
                                <Button name="Small button" onClick={() => {}} small value="default">
                                    <IconArrowLeftMulti24/>
                                </Button>
                            </li>
                            <li>
                                <Button name="Small button" onClick={() => {}} small value="default">
                                    <IconArrowRight24/>
                                </Button>
                            </li>
                        </ul>
                    </div>
                    <div className='period-modal-data-destination'>
                        <div>
                            Selected Period
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
        </div>
    );

}