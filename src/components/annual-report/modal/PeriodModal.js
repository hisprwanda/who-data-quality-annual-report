import React from 'react'
import {useState} from 'react'
import { Modal, ModalActions, ModalTitle, ModalContent, ButtonStrip, Button, SingleSelect, SingleSelectField, SingleSelectOption, Divider } from '@dhis2/ui'
import {IconArrowLeftMulti24, IconArrowRightMulti24, IconArrowLeft24, IconArrowRight24} from '@dhis2/ui'
import './style/periodmodal.css'
import { SingleSelectElement } from './SingleSelectElement'
import { FixedPeriodElement } from './FixedPeriodElement'
import { RelativePeriodList } from './RelativePeriodList'
import { FixedPeriodList } from './FixedPeriodList'

export const PeriodModal = (props) => {

    let [selectedPeriod, setSelectedPeriod] = useState('Relative')
    //let [props.visibility, setVisibility] = useState(props.visibility)
    return (

        <Modal hide={props.visibility} onClose={ () => {props.changePeriodModalStatus}} position="top" large>
            <ModalTitle>
                Period
            </ModalTitle>
            <ModalContent>
                
                <div className='parent-element'>
                    <div className='data-source'>
                        <div className='data-source-menu'>
                            <ul>
                                <li onClick={(e) => {setSelectedPeriod('Relative')}} className='source-relative-period'>
                                    Relative Periods
                                </li>
                                <li onClick={(e) => {setSelectedPeriod('Fixed')}} className='source-fixed-period'>
                                    Fixed Periods
                                </li>
                            </ul>
                        </div>
                        <Divider/>
                        <div className='data-source-center'>
                            { selectedPeriod === 'Relative' ? <SingleSelectElement/> : <FixedPeriodElement/> }
                        </div>
                        <Divider/>
                        <div className='data-source-result'>
                            { selectedPeriod === 'Relative' ? <RelativePeriodList/> : <FixedPeriodList/>}
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
                    <div className='data-destination'>
                        <div>
                            Selected Period
                        </div>
                        <div>
                            No period selected
                        </div>
                    </div>
                </div>

            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={() => {}} primary>Close</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>

    );

}