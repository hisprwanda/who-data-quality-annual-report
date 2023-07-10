import React, { useState } from 'react'
import { Modal, ModalActions, ModalTitle, ModalContent, ButtonStrip, Button, SingleSelect, SingleSelectField, SingleSelectOption, Divider } from '@dhis2/ui'
import {IconArrowLeftMulti24, IconArrowRightMulti24, IconArrowLeft24, IconArrowRight24} from '@dhis2/ui'
import './style/periodmodal.css'
import { FixedPeriodElement } from '../FixedPeriodElement'
import { RelativePeriodComponent } from '../RelativePeriod.component'
import { RelativePeriodResultComponent } from '../RelativePeriodResult.component'

export const PeriodModal = (props) => {

    let [selectedPeriod, setSelectedPeriod] = useState('Relative')
    let [modalStatus, setModalStatus] = useState(props.status)

    return (
        <Modal hide={props.status} onClose={ () => {props.changePeriodModalStatus(true)}} position="top" fluid>
            <ModalTitle>
                Period
            </ModalTitle>
            <ModalContent>
                
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

            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={() => {props.changePeriodModalStatus(true)}} >Hide</Button>
                </ButtonStrip>
                <div className='divider'></div>
                <ButtonStrip end>
                    <Button onClick={() => {}} primary>Update</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>

    );

}