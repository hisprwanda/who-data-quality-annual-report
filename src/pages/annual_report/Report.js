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
import { Button, IconArrowLeftMulti24, IconArrowRightMulti24, IconArrowLeft24, IconArrowRight24, IconClock16 } from '@dhis2/ui'
import { DataSetModal } from '../../components/annual-report/modal/data-sets/DataSetModal'
import { PeriodModal } from '../../components/annual-report/modal/period/PeriodModal'
import { OrganizationUnitModal } from '../../components/annual-report/modal/organizationunit/OrganizationUnitModal'
import { loadDataStore } from '../../components/annual-report/datasource/dataset/dataset.source'
import { useDataQuery } from '@dhis2/app-runtime'
import { OrgUnitComponent } from '../../components/annual-report/OrgUnit.Component'
import down_allow from '../../assets/images/downarrow.png'
import ReportPreview from '../../components/annual-report/report-preview/ReportPreview'
import { useDispatch, useSelector } from 'react-redux'

// End of imports

// Start of the functional component definition
const Report = function() {
  // Redux state selector hook
  let stateSelector = useSelector(state => state)
  // Redux state dispatch hook
  let dispatch = useDispatch()
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

  // Hook for managing levels
  let [selectedLevel, setSelectedLevel] = useState("Select Levels")
  // Hook for managing groups
  let [selectedGroup, setSelectedGroup] = useState("Select Groups")

  let [reportStatus, setReportStatus] = useState(false)

  let selectedItem = stateSelector.selectedValue.dataSet
  let [filteredItem, setFilteredItem] = useState([])
  let _selectedPeriod = stateSelector.selectedValue.period
  let _selectedOrgUnit = stateSelector.selectedValue.orgUnit
  let [relativePeriodSelected, setRelativePeriodSelected] = useState('')
  let {loading, error, data} = useDataQuery(_dataStore, {}, {}, {}, {}, {})
  
  // Definition of use effect hooks
  useEffect(() => {
    let groups = data?.results.groups.filter(i => i.code === selectedItem)
    setFilteredItem(groups) 
  }, [selectedItem])

  useEffect(() => {
    reportStatus != reportStatus
  }, reportStatus)

  useEffect(() => {
    console.log(selectedGroup);
  }, [selectedGroup])

  useEffect(() => {
    console.log(selectedLevel)
  }, [selectedLevel])

  let setSelectedDataSet = function(chosenElement) {
    dispatch( { type: 'Change Dataset', payload: { el: chosenElement } })
  }

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
              <div className='dataset-indication'>
                 <div>
                    Data set
                 </div>
                 <div>
                    {selectedItem}
                 </div>
                 <div>
                  <img src={down_allow}/>
                 </div>
              </div>
              <div className='data-showable'>
                <ul>
                    {
                      data?.results.groups.map((element, info) => {
                          return <li key={element.code} onClick={(e) =>{e.persist(); setSelectedDataSet(e.target.textContent)}}>{element.name}</li>
                      })
                    }
                </ul>
              </div>
            </div>
            <div className='orgunit-container'>
              <div className='ou-indication'>
                <div>
                    Organisation Unit
                 </div>
                 <div>
                    {_selectedOrgUnit}
                 </div>
                 <div>
                  <img src={down_allow}/>
                 </div>
              </div>
              <div className='ou-showable'>
                  <div>
                      <OrgUnitComponent/>
                  </div>
                  <div className='dividing'>
                    
                  </div>
                  <div className='level-and-groups'>
                      <div className='level'>
                          <div className='select-title'>
                            <div className='select-title-data'>
                              {selectedLevel}
                            </div>
                            <div className='select-title-icon'>
                              <img src={down_allow}/>
                            </div>
                          </div>
                          <div className='select-options'>
                            <ul>
                              <li onClick={(e) =>{e.persist(); setSelectedLevel(e.target.textContent)}}>
                                  Province
                              </li>
                              <li onClick={(e) =>{e.persist(); setSelectedLevel(e.target.textContent)}}>
                                  District
                              </li>
                            </ul>
                          </div>
                      </div>
                      <div className='group'>
                          <div className='select-title'>
                              <div className='select-title-data'>
                                {selectedGroup}
                              </div>
                              <div className='select-title-icon'>
                                <img src={down_allow}/>
                              </div>
                          </div>
                          <div className='select-options'>
                              <ul>
                                <li onClick={(e) =>{e.persist(); setSelectedGroup(e.target.textContent)}}>
                                    Military Hospital
                                </li>
                                <li onClick={(e) =>{e.persist(); setSelectedGroup(e.target.textContent)}}>
                                    District Province
                                </li>
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
            <div className='period-container'>
                <div className='period-indication'>
                  <div>
                    Period
                  </div>
                  <div>
                    {_selectedPeriod}
                  </div>
                  <div>
                    <img src={down_allow}/>
                  </div>
                </div>
              <div className='period-showable'>
                  <div className='period-showable-container'>
                      <div className='period-selection'>
                        <div className='period-section-container'>
                          <div className='select-period-type'>
                            <ul>
                              <li>
                                <a id='relative' href='#'>
                                  Relative Period
                                </a>
                              </li>
                              <li>
                                <a id = 'fixed' href='#'>
                                  Fixed Period
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div className='period-suboptions'>
                            <div className='period-suboptions-container'>
                              <div className='period-suboptions-title'>
                                Period Type
                              </div>
                              <div className='period-suboptions-control'>
                                <div className='group'>
                                  <div className='select-title'>
                                    <div className='select-title-data'>
                                      {relativePeriodSelected}
                                    </div>
                                    <div className='select-title-icon'>
                                      <img src={down_allow}/>
                                    </div>
                                  </div>
                                  <div className='select-options'>
                                    <ul>
                                      <li onClick={(e) =>{e.persist(); setRelativePeriodSelected(e.target.textContent)}}>
                                        Days
                                      </li>
                                      <li onClick={(e) =>{e.persist(); setRelativePeriodSelected(e.target.textContent)}}>
                                        Weeks
                                      </li>
                                      <li onClick={(e) =>{e.persist(); setRelativePeriodSelected(e.target.textContent)}}>
                                        Months
                                      </li>
                                      <li onClick={(e) =>{e.persist(); setRelativePeriodSelected(e.target.textContent)}}>
                                        Bi-Months
                                      </li>
                                      <li onClick={(e) =>{e.persist(); setRelativePeriodSelected(e.target.textContent)}}>
                                        Quarters
                                      </li>
                                      <li onClick={(e) =>{e.persist(); setRelativePeriodSelected(e.target.textContent)}}>
                                        Six Months
                                      </li>
                                      <li onClick={(e) =>{e.persist(); setRelativePeriodSelected(e.target.textContent)}}>
                                        Financial Year
                                      </li>
                                      <li onClick={(e) =>{e.persist(); setRelativePeriodSelected(e.target.textContent)}}>
                                        Years
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='select-period-result'>
                            <ul>
                                <li>
                                    <span><IconClock16/> Today</span>
                                </li>
                                <li>
                                    <span><IconClock16/> Yesterday</span>
                                </li>
                                <li>
                                    <span><IconClock16/> Last 7 days</span>
                                </li>
                                <li>
                                    <span><IconClock16/> Last 14 days</span>
                                </li>
                                <li>
                                    <span><IconClock16/> Last 30 days</span>
                                </li>
                                <li>
                                    <span><IconClock16/> Last 60 days</span>
                                </li>
                                <li>
                                    <span><IconClock16/> Last 90 days</span>
                                </li>
                                <li>
                                    <span><IconClock16/> Last 180 days</span>
                                </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className='period-middle-section'>
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
                      <div className='period-result'>
                        <div>
                          Selected Period
                        </div>
                        <div>
                        </div>
                      </div>
                  </div>
              </div>
            </div>
            <div>
              <div>
                  <div>
                      <Button name="Basic button" onClick={() => setReportStatus(true)} default value="default">Generate Report</Button>
                  </div>
                  <div>
                    <Button name="Primary button" onClick={console.log('done')} primary value="Print">Print</Button>
                  </div>
              </div>
            </div>
          </div>
    
        </div>
        
        <div className='report-section'>
          {reportStatus && <ReportPreview/>}
          
        </div>
    </div>
  )
}

export default Report