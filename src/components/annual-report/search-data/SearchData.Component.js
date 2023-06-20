import React, { useRef, useEffect } from 'react'
import './styles/search_section.css'
import { SingleSelect, SingleSelectOption, Input } from '@dhis2/ui';
import { SearchResultComponent } from './SearchResult.Component';
import { useState } from 'react'
import { IndicatorGroupList } from './IndicatorGroupList';
import { DataElementGroupList } from './DataElementGroupList';
import { DataSetGroupList } from './DataSetGroupList';
import {IconDimensionEventDataItem16} from '@dhis2/ui-icons'


export const SearchDataComponent = (props) => {

    let [selectedItem, setSelectedItem] = useState("0")
    const myRef = useRef()
    let [trackedElementVisibility, setTrackedElementVisibility] = useState(false)
    let [pageIncrementer, setPageIncrementor] = useState(1)

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
                                Data Type -- {pageIncrementer} {typeof(trackedElementVisibility)}
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
            <div>
                <ul>
                    {
                        props.info && props.info.results.dataItems.map(item => <li key={item.id}><span className='search-result-data'><span className='icon-size'><IconDimensionEventDataItem16 className="icon-size"/></span><span>{item.displayName}</span></span></li>)
                    }
                </ul>
                <div id='scroll-element' ref={myRef}>
                    Below it
                </div>
            </div>
        </div>
    );
}