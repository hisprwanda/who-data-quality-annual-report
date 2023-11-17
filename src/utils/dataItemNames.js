import { useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useConfigurations } from './configurations/index.js'

/**
 * This is a kinda unusual feature set to fetch the names of all the metadata
 * used in the app configurations. Returns a map of [id]: value pairs. Combines
 * data elements, data element operands, and indicators into one object
 */

const DataItemNames = React.createContext(new Map())

const DATA_ITEM_NAMES_QUERY = {
    dataElements: {
        resource: 'dataElements',
        params: ({ dataItemIDsString }) => ({
            filter: `id:in:[${dataItemIDsString}]`,
            // default fields are id, displayName
            paging: false,
        }),
    },
    dataElementOperands: {
        resource: 'dataElementOperands',
        params: ({ dataItemIDsString }) => ({
            filter: `id:in:[${dataItemIDsString}]`,
            fields: 'id,displayName',
            paging: false,
        }),
    },
    indicators: {
        resource: 'indicators',
        params: ({ dataItemIDsString }) => ({
            filter: `id:in:[${dataItemIDsString}]`,
            paging: false,
        }),
    },
}

const emptyMap = new Map() // save useState from remaking this every render
export const DataItemNamesProvider = ({ children }) => {
    const [dataItemNames, setDataItemNames] = useState(emptyMap)
    const configurations = useConfigurations()
    const engine = useDataEngine()

    // Calculate this is a string -- if the string hasn't changed, the request
    // won't need to refetch
    const dataItemIDsString = useMemo(() => {
        // compile IDs from numerators, denominators, and external relations
        const dataItemIDs = new Set()
        configurations.numerators.forEach(
            ({ dataID }) => dataID && dataItemIDs.add(dataID)
        )
        configurations.denominators.forEach(
            ({ dataID }) => dataID && dataItemIDs.add(dataID)
        )
        configurations.externalRelations.forEach(
            ({ externalData }) => externalData && dataItemIDs.add(externalData)
        )
        // return as comma-separated values
        return [...dataItemIDs].join(',')
    }, [configurations])

    useEffect(() => {
        // use IDs to fetch names
        engine
            .query(DATA_ITEM_NAMES_QUERY, { variables: { dataItemIDsString } })
            .then((data) => {
                // set up a map with all our new IDs and names
                // (different object types are all in the same map)
                const newDataItemNames = new Map()
                const addToMap = ({ id, displayName }) =>
                    newDataItemNames.set(id, displayName)
                data.dataElements.dataElements.forEach(addToMap)
                data.dataElementOperands.dataElementOperands.forEach(addToMap)
                data.indicators.indicators.forEach(addToMap)
                setDataItemNames(newDataItemNames)
            })
    }, [engine, dataItemIDsString])

    // designed to not block the UI while loading, since it's fairly non-essential

    return (
        <DataItemNames.Provider value={dataItemNames}>
            {children}
        </DataItemNames.Provider>
    )
}
DataItemNamesProvider.propTypes = { children: PropTypes.node }

export const useDataItemNames = () => {
    const dataItemNames = useContext(DataItemNames)

    if (dataItemNames === undefined) {
        throw new Error(
            'useDataItemNames must be used within a DataItemNamesProvider'
        )
    }

    return dataItemNames
}
