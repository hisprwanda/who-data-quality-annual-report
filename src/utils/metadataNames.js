import { useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useConfigurations } from './configurations/index.js'

/**
 * This is a kinda unusual feature set to fetch the names of all the metadata
 * used in the app configurations. Returns a map of [id]: value pairs. Combines
 * data elements and indicators into one object
 */

const MetadataNamesContext = React.createContext(new Map())

const DATA_ITEM_NAMES_QUERY = {
    dataElements: {
        resource: 'dataElements',
        params: ({ dataItemIDsString }) => ({
            filter: `id:in:[${dataItemIDsString}]`,
            // default fields are id, displayName
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
export const MetadataNamesProvider = ({ children }) => {
    const [metadataNames, setMetadataNames] = useState(emptyMap)
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
                const newMetadataNames = new Map()
                const addToMap = ({ id, displayName }) =>
                    newMetadataNames.set(id, displayName)
                data.dataElements.dataElements.forEach(addToMap)
                data.indicators.indicators.forEach(addToMap)
                // data.dataSets.dataSets.forEach(addToMap)
                setMetadataNames(newMetadataNames)
            })
    }, [engine, dataItemIDsString])

    // designed to not block the UI while loading, since it's fairly non-essential

    return (
        <MetadataNamesContext.Provider value={metadataNames}>
            {children}
        </MetadataNamesContext.Provider>
    )
}
MetadataNamesProvider.propTypes = { children: PropTypes.node }

export const useMetadataNames = () => {
    const metadataNames = useContext(MetadataNamesContext)

    if (metadataNames === undefined) {
        throw new Error(
            'useMetadataNames must be used within a MetadataNamesProvider'
        )
    }

    return metadataNames
}
