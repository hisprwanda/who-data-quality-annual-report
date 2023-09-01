import React, { useRef, useEffect } from 'react'
import './styles/search_section.css'
import { SingleSelect, SingleSelectOption, Input } from '@dhis2/ui';
import { useState } from 'react'
import { IndicatorGroupList } from './IndicatorGroupList';
import { DataElementGroupList } from './DataElementGroupList';
import { DataSetGroupList } from './DataSetGroupList';
import { allDataTypesQuery, dataElementQuery, dataSetQuery, indicatorQuery, loadDataStore } from '../datasource/dataset/dataset.source';


export const SearchDataComponent = (props) => {

    let [selectedItem, setSelectedItem] = useState("0")
    const myRef = useRef()
    let [trackedElementVisibility, setTrackedElementVisibility] = useState(false)
    let [pageIncrementer, setPageIncrementor] = useState(1)
    let [allDataTypes, setAllDataTypes] = useState({})
    let [query, setQuery] = useState(allDataTypesQuery)
    let [clickedElement, setClickedElement] = useState('')

    let x = dataSetQuery
    let _dataSetQuery = dataSetQuery
    let _allDataTypesQuery = allDataTypesQuery
    let _dataElementQuery = dataElementQuery
    let _indicatorQuery = indicatorQuery

    useEffect(() => {
        if(selectedItem === 'Data Set'){
            setQuery('dataSets')
        }
    }, [selectedItem])

    useEffect(() => {
        props.clickedElement(clickedElement)
    }, [clickedElement])


    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0]
            setTrackedElementVisibility(entry.isIntersecting)
            trackedElementVisibility === true ? setPageIncrementor(prevCount => prevCount + 1) : ''
        })
        observer.observe(myRef.current)
    }, [])

    return (
        <div className='search-data-parent'>
            <div>
                <div>
                    <ul>
                        <li>
                            <Input name = "defaultName" onChange = {() => {}} placeholder = "Search by data item name" /> 
                        </li>
                        <li>
                            <label>
                                Data Type
                            </label>
                            <SingleSelect className="select" onChange={(e) => {setSelectedItem(e.selected)}} selected={selectedItem}>
                                <SingleSelectOption label = "All Types" value = "0"/>
                                <SingleSelectOption label = "Indicators" value = "Indicators" />
                                <SingleSelectOption label = "Data Element" value = "Data Element" />
                                <SingleSelectOption label = "Data Set" value = "Data Set" />
                            </SingleSelect>
                        </li>
                    </ul>
                </div>
                <div>
                    {
                        selectedItem === 'Indicators' && <IndicatorGroupList />
                    }
                    {
                        selectedItem === 'Data Element' && <DataElementGroupList />
                    }
                    {
                        selectedItem === 'Data Set' && <DataSetGroupList />
                    }
                    
                </div>
            </div>
            
        </div>
    );
}