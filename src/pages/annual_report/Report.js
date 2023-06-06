/*
Author: Joseph MANZI
Company: HISP Rwanda
Date: May, 30 2023
The page used to present the user interface for the user to manage the reports
*/

// Import of key features 

import {useState} from 'react'
import React from 'react'
import MenuBar from '../../components/menu-bar/MenuBar'
import './style/report.css'
import { resources } from '../../assets/str-resources/report-section'
import { Modal, ModalContent, Button, CustomTransfer, TransferOption, SingleSelect, SingleSelectOption, OrganisationUnitTree, ModalActions, ButtonStrip, Card, Box, Divider } from '@dhis2/ui'
import { OrgUnitComponent } from '../../components/annual-report/OrgUnit.Component'
import { PeriodComponent } from '../../components/annual-report/Period.Component'

// End of imports

// Start of the functional component definition
const Report = () => {

  // Hook used to display or hide the 
  const [visibility, toggleVisibility] = useState({
    'data_section': 'set-visible',
    'period_section': 'set-invisible',
    'orgunit_section': 'set-invisible'
  })

  // Hook used to display or hide different modal
  let [open, openModal] = useState(false)
  let [periodModal, openPeriodModal] = useState(false)
  // Function used to change the value of the variable used to hide or display the modal
  const manageModel = () => {
    open = ! open
    openModal(open)
  }

  const managePeriodModal = () => {
    periodModal = ! periodModal
    openPeriodModal(periodModal)
  }

  // Method used to 
  const setToggleState = (event) => {
    
    let data_section = 'set-invisible';
    let period_section = 'set-invisible';
    let orgunit_section = 'set-invisible';

    const id = event.currentTarget.id;

    if(id === 'period_') {
      data_section = 'set-invisible';
      period_section = 'set-visible';
      orgunit_section = 'set-invisible';
    }

    if(id === 'orgunit_') {
      data_section = 'set-invisible';
      period_section = 'set-invisible';
      orgunit_section = 'set-visible';
    }

    if(id === 'data_') {
      data_section = 'set-visible';
      period_section = 'set-invisible';
      orgunit_section = 'set-invisible';
    }

    toggleVisibility({
      'data_section': data_section,
      'period_section': period_section,
      'orgunit_section': orgunit_section
    })

  }

  let modal = ''
  if(open){
    modal = <Modal><ModalContent><OrgUnitComponent/></ModalContent><ModalActions><ButtonStrip end><Button onClick={manageModel} secondary>Hide</Button><Button onClick={manageModel} primary>Update</Button></ButtonStrip></ModalActions></Modal>
  }
  let periodModalTrigger = ''
  if(periodModal) {
    periodModalTrigger = modal = <Modal><ModalContent><PeriodComponent/></ModalContent><ModalActions><ButtonStrip end><Button onClick={managePeriodModal} secondary>Hide</Button><Button onClick={managePeriodModal} primary>Update</Button></ButtonStrip></ModalActions></Modal>
  }
  return (
    <div className='reportContainer'>
      <MenuBar />
      {modal}
        <div className='topParagraph'>
          <p>{resources.report_title}</p>
        </div>

        <div className='configsContainer'>
            <div className='configRows'>
              <div className='title' onClick={setToggleState} id='data_'>
                {resources.data}
              </div>
              <div className={visibility['data_section']} id='data-section'>
                <div>
                  <div>
                      <Box width="100%">
                            <Card>
                              <label>Data Elements</label>
                              <SingleSelect className="select" onChange={() => {console.log('Doing change element')}} selected='General Service'>
                                <SingleSelectOption label="General Service" value="General Service" />
                                <SingleSelectOption label="Maternity" value="Maternity" />
                                <SingleSelectOption label="Malaria" value="Malaria" />
                                <SingleSelectOption label="OPD" value="OPD" />
                              </SingleSelect>
                            </Card>
                      </Box>  
                  </div>
                  <div>
                      <Box width="100%">
                            <Card>
                                <label>Data Sets</label>
                                <SingleSelect className="select" onChange={() => {console.log('Doing change element')}} selected='General Service'>
                                  <SingleSelectOption label="General Service" value="General Service" />
                                  <SingleSelectOption label="Maternity" value="Maternity" />
                                  <SingleSelectOption label="Malaria" value="Malaria" />
                                  <SingleSelectOption label="OPD" value="OPD" />
                                </SingleSelect>
                              </Card>
                          </Box>  
                  </div>
                </div>

              </div>
            </div>

            <div className='configRows'>
              <div className='title' onClick={setToggleState} id='period_'>
                {resources.period}
              </div>
              <div className={visibility['period_section']} id='period-section'>
                  <div>
                      <div>
                          <Button name="basic_button" onClick={()=>{}} value="orgunit" className='button'>
                            <span className='button'>Period</span>
                          </Button>
                      </div>
                      <div>
                          <Button name="basic_button" onClick={managePeriodModal} value="default" className='button'>
                          <span className='button'>...</span>
                          </Button>
                      </div>
                  </div>
              </div>
            </div>

            <div className='configRows'>
              <div className='title' onClick={setToggleState} id='orgunit_'>
                {resources.orgunit}
              </div>
              <div className={visibility['orgunit_section']} id='orgunit_section'>
                
                  <div>
                    <div>
                        <Button name="basic_button" onClick={()=>{}} value="orgunit" className='button'>
                          <span className='button'>Organization Unit</span>
                        </Button>
                    </div>
                    <div>
                        <Button name="basic_button" onClick={manageModel} value="default" className='button'>
                          <span className='button'>...</span>
                        </Button>
                    </div>
                  </div>
                
              </div>
            </div>            
        </div>
        <div className='bottom-section'>
              <div>
                <div>
                    <Button name="Primary button" onClick={manageModel} primary value="default" className='button'>
                        <span className='button'>Generate</span>
                    </Button>
                </div>
                <div>
                    <Button name="basic_button" onClick={manageModel} value="default" className='button'>
                        <span className='button'>Print</span>
                    </Button>
                </div>
              </div>
            </div>
    </div>
  )
}

export default Report