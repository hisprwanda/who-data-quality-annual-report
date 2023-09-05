import React, {useState, useEffect} from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import {IconDimensionEventDataItem16} from '@dhis2/ui-icons'

export const TestQuery = (props) => {

    let [allDataTypes, setAllDataTypes] = useState({})
    let [query, setQuery] = useState(props.query)
    let {loading, error, data} = useDataQuery(query, {}, {}, {}, {}, {})
    let [_data, setData] = useState(data)

    const processClicked = (e) => {
        e.persist();
        const textContent = e.target.textContent
        props.clickedElement(textContent)
    }

    useEffect(()=> {
        setData(data)
    }, [data])

    useEffect(() => {
        setAllDataTypes(data)
    }, [data])

    return (
        <div>
            {
                <ul>
                    {
                        !!_data && _data.results?.[props.obj].map(item => <li key={item.id} onClick={(e) => processClicked(e)}><span className='search-result-data'><span className='icon-size'><IconDimensionEventDataItem16 className="icon-size"/></span><span val={item.displayName}>{item.displayName}</span></span></li>)
                    }
                </ul>
            }
        </div>
    )
}