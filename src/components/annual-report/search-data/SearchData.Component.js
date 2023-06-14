import React from 'react'
import './styles/search_section.css'
import { SingleSelect, SingleSelectOption, Input } from '@dhis2/ui';
import { SearchResultComponent } from './SearchResult.Component';

export const SearchDataComponent = () => {
    return (
        <div className='search-data-parent'>
            <div>
                <ul>
                    <li>
                        <Input name = "defaultName" onChange = {() => {}} placeholder = "Search by data item name" /> 
                    </li>
                    <li>
                        <label>
                            Data Type
                        </label>
                        <SingleSelect className="select" onChange={() => {}}>
                            <SingleSelectOption label = "Indicators" value = "1" />
                            <SingleSelectOption label = "Data Element" value = "2" />
                            <SingleSelectOption label = "Data Set" value = "3" />
                            <SingleSelectOption label = "Data Set" value = "3" />
                        </SingleSelect>
                    </li>
                </ul>
            </div>
            <div>
                <SearchResultComponent />
            </div>
        </div>
    );
}