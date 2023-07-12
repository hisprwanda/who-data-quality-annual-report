/*
Author: Joseph MANZI
Company: HISP Rwanda
Date: May, 30 2023
The component to manage the period modal
*/

// Import of key features 

import {useState, useEffect} from 'react'
import React from 'react'
import MenuBar from '../../components/menu-bar/MenuBar'
import './style/report.css'
import { resources } from '../../assets/str-resources/report-section'
import { Button } from '@dhis2/ui'
import { DataSetModal } from '../../components/annual-report/modal/data-sets/DataSetModal'
import { PeriodModal } from '../../components/annual-report/modal/period/PeriodModal'
import { OrganizationUnitModal } from '../../components/annual-report/modal/organizationunit/OrganizationUnitModal'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import { loadDataStore } from '../../components/annual-report/datasource/dataset/dataset.source'
import { useDataQuery } from '@dhis2/app-runtime'
import { groupBy } from 'rxjs'
import { OrgUnitComponent } from '../../components/annual-report/OrgUnit.Component'
import { PeriodComponent } from '../../components/period/period.component'

// End of imports

// Start of the functional component definition
const Report = () => {

  // Hook for managing data set modals
  let [dataSetModalStatus, setDataSetModalStatus] = useState(true)
  // End of hook for managing data set modals

  // Hook for managing period modal
  let [periodModalStatus, setPeriodModalStatus] = useState(true)
  // End of hook for managing period modal

  // Hook for managing org unit modal
  let [orgUnitModalStatus, setOrgUnitModalStatus] = useState(true)
  // End of hook for managing org unit modal
  let [_dataStore, setDataStore] = useState(loadDataStore)

  let [selectedItem, setSelectedItem] = useState('0')
  let [filteredItem, setFilteredItem] = useState([])
  let [_selectedPeriod, setSelectedPeriod] = useState('2000')
  let [_selectedOrgUnit, setSelectedOrgUnit] = useState('Nyamata')
  let {loading, error, data} = useDataQuery(_dataStore, {}, {}, {}, {}, {})
  useEffect(() => {
    let groups = data?.results.groups.filter(i => i.code === selectedItem)
    setFilteredItem(groups) 
  }, [selectedItem])
  // console.log(data?.results.groups)
  // End of variable declaration
  return (
    <div className='reportContainer'>
      <MenuBar />
      <DataSetModal status = { dataSetModalStatus } changeDataModalStatus = {setDataSetModalStatus}/>
      <PeriodModal status = { periodModalStatus } changePeriodModalStatus = {setPeriodModalStatus} />
      <OrganizationUnitModal status = { orgUnitModalStatus } changeOrganisationUnitStatus = { setOrgUnitModalStatus } />
      <div className='menu-parent'>
          <div className='menu-parent-container'>
            <div className='data-set-container'>
              <div className='indication'>
                 <div>
                    Data Set
                 </div>
                 <div>
                    {selectedItem}
                 </div>
              </div>
              <div className='data-showable'>
                <ul>
                    {
                      data?.results.groups.map((element, info) => {
                          return <li key={element.code} onClick={(e) =>{e.persist(); setSelectedItem(e.target.textContent)}}>{element.name}</li>
                      })
                    }
                </ul>
              </div>
            </div>
            <div className='orgunit-container'>
              <div>
                Organization Unit
              </div>
              <div className='ou-showable'>
                <div>
                  <div>
                      <OrgUnitComponent/>
                  </div>
                </div>
              </div>
            </div>
            <div className='period-container'>
              <div>
                Period
              </div>
              <div className='period-showable'>
                <PeriodComponent/>
              </div>
            </div>
            <div>
              <div>
                  <div>
                      <Button name="Basic button" onClick={() => console.log('kigali')} default value="default">Load Report</Button>
                  </div>
                  <div>
                    <Button name="Primary button" onClick={console.log('done')} primary value="Print">Print</Button>
                  </div>
              </div>
              <div className='other-showable'>
                
              </div>
            </div>
          </div>
    
        </div>
        {/* <div className='report-container'>
          <div className='data-container'>
            <a href='#data-parent' className='first-anchor title'>Data</a>
            <div className='data-below' id='data-parent'>
              <div className='data-section-child'>
                  <label>Group</label>
                  <SingleSelect className="select" onChange={(e) => {setSelectedItem(e.selected)}} selected={selectedItem}>
                    <SingleSelectOption label = "Please select a group" value = "0"/>
                    {
                      data?.results.groups.map((element, info) => {
                          return <SingleSelectOption label = {element.name} value={element.code} key = {element.code}/>
                          console.log(element.code)
                      })
                    }
                  </SingleSelect>
              </div>
            </div>
          </div>
          <div className='period-container'>
            <a href='#period-parent' className='period-anchor title'>Period</a>
            <div id='period-parent'>
              <div className='data-section-child'>
                  <Button name="basic_button" onClick={() => setPeriodModalStatus(false) } value="default" className='button'>
                    <span>Choose Period</span>
                  </Button>
              </div>
            </div>
          </div>
          <div className='orgunit-container'>
            <a href='#orgunit-parent' className='orgunit-anchor title'>Organization Unit</a>
            <div id='orgunit-parent'>
            <div className='data-section-child'>
                  <Button name="basic_button" onClick={() => setOrgUnitModalStatus(false) } value="default" className='button'>
                    <span>Choose Organization Unit</span>
                  </Button>
              </div>
            </div>
          </div>
          <div className='action-container'>

            <ul>
              <li>
                  <Button name = "Primary button" onClick = {() => {}} primary value = "default">Generate</Button>
              </li>
              <li>
                  <Button name = "Basic button" onClick = {() => {}} basic value = "default">Print</Button>  
              </li>
            </ul>
          </div>
        </div> */}
        
    </div>
  )
}

export default Report