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
import './style/slide.css'
import { resources } from '../../assets/str-resources/report-section'
import { Modal, ModalContent, Button, CustomTransfer, TransferOption, SingleSelect, SingleSelectOption, OrganisationUnitTree, ModalActions, ButtonStrip, Card, Box, Divider, MultiSelect, MultiSelectOption, MultiSelectField, ModalTitle, Checkbox } from '@dhis2/ui'
import { OrgUnitComponent } from '../../components/annual-report/OrgUnit.Component'
import { PeriodComponent } from '../../components/annual-report/Period.Component'
import { PeriodModal } from '../../components/annual-report/modal/PeriodModal'
import { ChildComponent } from '../../components/annual-report/ChildComponent'

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
    console.log(e.target);
    counting += 1
    setCounting(counting)
  }

  let [counting, setCounting] = useState(0)

  let [selectedElement, setSelectedElement] = useState([])
  
  let [dataSetStatus, setDataSetStatus] = useState(true)

  let [dateElementStatus, setDataElementStatus] = useState(true)

  let [orgUnitStatus, setOrgnizationUnitStatus] = useState(true)

  let [orgUnitGroupsStatus, setOrgUnitGroupStatus] = useState(true)

  let [orgUnitLevelStatus, setOrgUnitLevelStatus] = useState(true)

  let [dataElementGroupStatus, setDataElementGroupsStatus] = useState(true)

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
      
      <Modal hide={dataElementGroupStatus} onClose={() => setDataElementGroupsStatus(true)} position="top">
          <ModalTitle>
            Data Element Groups
          </ModalTitle>
          <ModalContent>
            <MultiSelect className="select" onChange={(e)=> { addSelectedElement(e)} } label="Select Data Elements" selected={selectedElement}>
                <MultiSelectOption label="Immunization" value="1" />
                <MultiSelectOption label="Child Death Audit" value="2" />
                <MultiSelectOption label="TB Treatement information" value="3" />
                <MultiSelectOption label="LPS Program Enrollment Information" value="4" />
            </MultiSelect>
            <Divider/>
            <div className='group-element-selected'>
              <ul>
                <li>
                    <Checkbox label="Ambulance_Fuel (c)" name="Ex" onBlur = { () => {} } onChange = { () => {} } onFocus = { () => {}} valid value = "valid"   />
                </li>
                <li>
                    <Checkbox label="Adherence on ART_FSW" name="Ex" onBlur = { () => {} } onChange = { () => {} } onFocus = { () => {}} valid value = "valid"   />
                </li>
                <li>
                    <Checkbox label="Ambulance operations status" name="Ex" onBlur = { () => {} } onChange = { () => {} } onFocus = { () => {}} valid value = "valid"   />
                </li>
              </ul>
            </div>
          </ModalContent>
          <ModalActions>
              <ButtonStrip end>
                  <Button onClick={() => {}} secondary>Close</Button>
              </ButtonStrip>
          </ModalActions>
      </Modal>

      <Modal hide={dateElementStatus} onClose={() => setDataElementStatus(true)} position="top">
          <ModalTitle>
            Data Elements 
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
            Data Sets
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

      <Modal hide={ orgUnitStatus } onClose={() => setOrgnizationUnitStatus(true)} position="top">
          <ModalTitle>
            Organization Unit
          </ModalTitle>
          <ModalContent>
            <div className='orgunit-parent'>
              <div className='orgunit-topsection'>
                <ul>
                  <li>
                    <span>
                      User Organization Unit
                    </span>
                  </li>
                  <li>
                    <span>
                      User Sub-Unit
                    </span>
                  </li>
                  <li>
                    <span>
                      User Sub-2x-Unit
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
                        <SingleSelectOption label="Province" value="1" />
                        <SingleSelectOption label="District" value="2" />
                        <SingleSelectOption label="Sector" value="3" />
                        <SingleSelectOption label="Cell" value="3" />
                      </SingleSelect>
                  </div>
                  <div>
                    <label>
                        Group
                    </label>
                    <SingleSelect className="select" onChange={() => {}} selected="1">
                        <SingleSelectOption label="Eastern Province" value="1" />
                        <SingleSelectOption label="Southern Province" value="2" />
                        <SingleSelectOption label="Northern Province" value="3" />
                        <SingleSelectOption label="Western Province" value="3" />
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


      <Modal hide={orgUnitGroupsStatus} onClose={() => setOrgUnitGroupStatus(true)} position="top">
          <ModalTitle>
             Organization Unit Groups 
          </ModalTitle>
          <ModalContent>
            <MultiSelect className="select" onChange={(e)=> { addSelectedElement(e)} } label="Select Data Elements" selected={selectedElement}>
                <MultiSelectOption label="Eastern Province" value="1" />
                <MultiSelectOption label="Northern Province" value="2" />
                <MultiSelectOption label="Southern Province" value="3" />
                <MultiSelectOption label="Western Province" value="4" />
            </MultiSelect>
          </ModalContent>
          <ModalActions>
              <ButtonStrip end>
                  <Button onClick={() => {}} secondary>Close</Button>
              </ButtonStrip>
          </ModalActions>
      </Modal>


      <Modal hide={orgUnitLevelStatus} onClose={() => setOrgUnitLevelStatus(true)} position="top">
          <ModalTitle>
             Organization Unit Levels 
          </ModalTitle>
          <ModalContent>
            <MultiSelect className="select" onChange={(e)=> { addSelectedElement(e)} } label="Select Data Elements" selected={selectedElement}>
                <MultiSelectOption label="Province" value="1" />
                <MultiSelectOption label="District" value="2" />
                <MultiSelectOption label="Sector" value="3" />
                <MultiSelectOption label="Cell" value="4" />
            </MultiSelect>
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
                      <ChildComponent counting={counting} exampleFunction={addSelectedElement}/>
                      <div className='data-set-section'>
                          <div>
                              <Button name="basic_button" onClick={()=>{}} value="orgunit" className='button button-label'>
                                <span>Data Sets</span>
                              </Button>
                          </div>
                          <div>
                              <Button name="basic_button" onClick={() => setDataElementStatus(false) } value="orgunit" className='button clickable-button'>
                                ...
                              </Button>
                          </div>
                      </div>
                  </div>
                  <div className='selected-element-value'>
                      <div>
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
                          <Button name="basic_button" onClick={() => setPeriodModalStatus(false) } value="default" className='button'>
                              ...
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
                        <Button name="basic_button" onClick={()=>{}} value="orgunit" className='button button-label'>
                          <span>Organization Unit</span>
                        </Button>
                    </div>
                    <div>
                        <Button name="basic_button" onClick={() => setOrgnizationUnitStatus(false) } value="default" className='button'>
                          <span>...</span>
                        </Button>
                    </div>
                  </div>

                  <div>
                    <div>
                        <Button name="basic_button" onClick={()=>{}} value="orgunit" className='button button-label'>
                          <span>Groups</span>
                        </Button>
                    </div>
                    <div>
                        <Button name="basic_button" onClick={() => setOrgUnitGroupStatus(false) } value="default" className='button'>
                          <span>...</span>
                        </Button>
                    </div>
                  </div>

                  <div>
                    <div>
                        <Button name="basic_button" onClick={()=>{}} value="orgunit" className='button button-label'>
                          <span>Level</span>
                        </Button>
                    </div>
                    <div>
                        <Button name="basic_button" onClick={() => setOrgUnitLevelStatus(false) } value="default" className='button'>
                          <span>...</span>
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
        <div className='report-container'>
          <div className='data-container'>
            <a href='#data-parent' className='first-anchor title'>Data</a>
            <div className='data-below' id='data-parent'>
              <div className='data-section-child'>

              </div>
            </div>
          </div>
          <div className='period-container'>
            <a href='#period-parent' className='period-anchor title'>Period</a>
            <div id='period-parent'></div>
          </div>
          <div className='orgunit-container'>
            <a href='#orgunit-parent' className='orgunit-anchor title'>Organization Unit</a>
            <div id='orgunit-parent'></div>
          </div>
        </div>
    </div>
  )
}

export default Report