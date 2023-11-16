import { useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useContext } from 'react'
import { useConfigurations } from './configurations/index.js'

/**
 * This is a kinda unusual feature set to fetch the names of all the metadata
 * used in the app configurations. Returns a map of [id]: value pairs. Combines
 * data elements, indicators, and data sets in one object
 */

const MetadataNamesContext = React.createContext(new Map())

const METADATA_NAMES_QUERY = {
    dataElements: {
        resource: 'dataElements',
        params: ({ dataItemIDs }) => ({
            filter: `id:in:[${dataItemIDs.join(',')}]`,
            // default fields are id, displayName
            paging: false,
        }),
    },
    indicators: {
        resource: 'indicators',
        params: ({ dataItemIDs }) => ({
            filter: `id:in:[${dataItemIDs.join(',')}]`,
            paging: false,
        }),
    },
    dataSets: {
        resource: 'dataSets',
        params: ({ dataSetIDs }) => ({
            filter: `id:in:[${dataSetIDs.join(',')}]`,
            paging: false,
        }),
    },
}

const emptyMap = new Map() // save useState from remaking this every render
export const MetadataNamesProvider = ({ children }) => {
    const [metadataNames, setMetadataNames] = useState(emptyMap)
    const configurations = useConfigurations()
    const engine = useDataEngine()

    useEffect(() => {
        // compile IDs from numerators, denominators, and external relations
        const dataItemIDs = new Set()
        const dataSetIDs = new Set()
        configurations.numerators.forEach(({ dataID, dataSetID }) => {
            if (dataID) {
                dataItemIDs.add(dataID)
            }
            if (dataID === 'fbfJHSPpUQD') {
                console.log({ dataID, dataSetID })
            }
            if (dataSetID?.length) {
                // dataSetID could be a string or an array
                if (Array.isArray(dataSetID)) {
                    // console.log({ dataID, dataSetIDs })
                    dataSetID.forEach((id) => dataSetIDs.add(id))
                } else {
                    dataSetIDs.add(dataSetID)
                }
            }
        })
        configurations.denominators.forEach(({ dataID }) => {
            if (dataID) {
                dataItemIDs.add(dataID)
            }
        })
        configurations.externalRelations.forEach(({ externalData }) => {
            if (externalData) {
                dataItemIDs.add(externalData)
            }
        })

        // use IDs to fetch names
        engine
            .query(METADATA_NAMES_QUERY, {
                variables: {
                    // convert sets to arrays
                    dataItemIDs: [...dataItemIDs],
                    dataSetIDs: [...dataSetIDs],
                },
            })
            .then((data) => {
                // set up a map with all our new IDs and names
                // (different object types are all in the same map)
                const newMetadataNames = new Map()
                const addToMap = ({ id, displayName }) =>
                    newMetadataNames.set(id, displayName)
                data.dataElements.dataElements.forEach(addToMap)
                data.indicators.indicators.forEach(addToMap)
                data.dataSets.dataSets.forEach(addToMap)
                setMetadataNames(newMetadataNames)
            })
    }, [
        configurations.numerators,
        configurations.denominators,
        configurations.externalRelations,
        engine,
    ])

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
