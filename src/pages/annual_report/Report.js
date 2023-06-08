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
import { Modal, ModalContent, Button, CustomTransfer, TransferOption, SingleSelect, SingleSelectOption, OrganisationUnitTree, ModalActions, ButtonStrip, Card, Box, Divider, MultiSelect, MultiSelectOption, MultiSelectField, ModalTitle } from '@dhis2/ui'
import { OrgUnitComponent } from '../../components/annual-report/OrgUnit.Component'
import { PeriodComponent } from '../../components/annual-report/Period.Component'
import { PeriodModal } from '../../components/annual-report/modal/PeriodModal'
import { IconEmptyFrame16 } from '@dhis2/ui'
// End of imports

// Start of the functional component definition
const Report = () => {

  // Hook used to display or hide the 
  const [visibility, toggleVisibility] = useState({
    'data_section': 'set-visible',
    'period_section': 'set-invisible',
    'orgunit_section': 'set-invisible'
  })

  const addSelectedElement = (e) => {
    //[e.selected[0],  ...selectedElement];
    console.log(`${e.selected}`);
  }

  let [selectedElement, setSelectedElement] = useState([])
  
  let [dataSetStatus, setDataSetStatus] = useState(true)

  let [dateElementStatus, setDataElementStatus] = useState(true)

  let [orgUnitStatus, setOrgnizationUnitStatus] = useState(true)

  // Hook used to display or hide different modal
  let [open, openModal] = useState(false)
  let [periodModalStatus, setPeriodModalStatus] = useState(true)
  // Function used to change the value of the variable used to hide or display the modal
  const manageModel = () => {
    open = ! open
    openModal(open)
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

  return (
    <div className='reportContainer'>
      <MenuBar />
      <PeriodModal visibility={periodModalStatus} changePeriodModalStatus={() => { setPeriodModalStatus }}/>
      <Modal hide={dateElementStatus} onClose={() => setDataElementStatus(true)} position="top">
          <ModalTitle>
            Please select Data Elements {periodModalStatus} -- 
          </ModalTitle>
          <ModalContent>
            <MultiSelect className="select" onChange={(e)=> { addSelectedElement(e)} } label="Select Data Elements" selected={selectedElement}>
                <MultiSelectOption label="Ambulance Total available at the beginning of the month  (h) " value="1" />
                <MultiSelectOption label="Adverse event type - specify other" value="2" />
                <MultiSelectOption label="Appointment date " value="3" />
                <MultiSelectOption label="Ambulance Credits at the beginning of the month " value="4" />
            </MultiSelect>
          </ModalContent>
          <ModalActions>
              <ButtonStrip end>
                  <Button onClick={() => {}} secondary>Close</Button>
              </ButtonStrip>
          </ModalActions>
      </Modal>

      <Modal hide={dataSetStatus} onClose={() => setDataSetStatus(true)} position="top">
          <ModalTitle>
            Please Select Data Sets
          </ModalTitle>
          <ModalContent>
            <MultiSelect className="select" onChange={(e)=> { addSelectedElement(e)} } label="Select Data Elements" selected={selectedElement}>
                <MultiSelectOption label="Malaria cases Weekly reporting" value="1" />
                <MultiSelectOption label="Child Death Monthly Summary (aggregated)" value="2" />
                <MultiSelectOption label="EPI e-tracker monthly aggregate" value="3" />
                <MultiSelectOption label="TB_01_Registration of Cases by Susceptibility, Age and Sex" value="4" />
            </MultiSelect>
          </ModalContent>
          <ModalActions>
              <ButtonStrip end>
                  <Button onClick={() => {}} secondary>Close</Button>
              </ButtonStrip>
          </ModalActions>
      </Modal>

      <Modal hide={orgUnitStatus} onClose={() => {setOrgnizationUnitStatus(true)}} position="top">
          <ModalTitle>
            Organization Unit
          </ModalTitle>
          <ModalContent>
            <div className='orgunit-parent'>
              <div className='orgunit-topsection'>
                <ul>
                  <li>
                    <span>
                    <IconEmptyFrame16/> User Organization Unit
                    </span>
                  </li>
                  <li>
                    <span>
                    <IconEmptyFrame16/> User Sub-Unit
                    </span>
                  </li>
                  <li>
                    <span>
                    <IconEmptyFrame16/> User Sub-2x-Unit
                    </span>
                  </li>
                </ul>
              </div>
              <div className='orgunit-middlesection'>
                <OrgUnitComponent/>
              </div>
              <div className='orgunit-bottomsection'>
                  <div>
                      <label>
                        Level
                      </label>
                      <SingleSelect className="select" onChange={() => {}} selected="1">
                        <SingleSelectOption label="Group one" value="1" />
                        <SingleSelectOption label="Group two" value="2" />
                        <SingleSelectOption label="Group three" value="3" />
                      </SingleSelect>
                  </div>
                  <div>
                    <label>
                        Group
                    </label>
                    <SingleSelect className="select" onChange={() => {}} selected="1">
                        <SingleSelectOption label="Group one" value="1" />
                        <SingleSelectOption label="Group two" value="2" />
                        <SingleSelectOption label="Group three" value="3" />
                    </SingleSelect>
                  </div>
              </div>
            </div>
          </ModalContent>
          <ModalActions>
              <ButtonStrip end>
                  <Button onClick={() => {}} secondary>Close</Button>
              </ButtonStrip>
          </ModalActions>
      </Modal>



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
                  <div className='core-selection-parent'>
                      <div className='data-element-section'>
                          <div>
                              <Button name="basic_button" onClick={()=>{}} value="orgunit" className='button button-label'>
                                <span className='button'>Data Elements</span>
                              </Button>
                          </div>
                          <div>
                              <Button name="basic_button" onClick={()=>{ () => setDataElementStatus(false) }} value="orgunit" className='button clickable-button'>
                                <span className='button' >...</span>
                              </Button>
                          </div>
                      </div>
                      <Divider />
                      <div className='data-set-section'>
                          <div>
                              <Button name="basic_button" onClick={()=>{}} value="orgunit" className='button button-label'>
                                <span className='button'>Data Sets</span>
                              </Button>
                          </div>
                          <div>
                              <Button name="basic_button" onClick={() => { () => setDataSetStatus(false) }} value="orgunit" className='button clickable-button'>
                                <span className='button'>...</span>
                              </Button>
                          </div>
                      </div>
                  </div>
                  <div className='selected-element-value'>
                      <div>
                          Results of choice
                      </div>
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
                          <Button name="basic_button" onClick={()=>{}} value="orgunit" className='button button-label'>
                            <span>Period</span>
                          </Button>
                      </div>
                      <div>
                          <Button name="basic_button" onClick={() => {() => setPeriodModalStatus(false)}} value="default" className='button'>
                          <span className='button-label'>...</span>
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
                        <Button name="basic_button" onClick={() => setOrgnizationUnitStatus(false)} value="default" className='button'>
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