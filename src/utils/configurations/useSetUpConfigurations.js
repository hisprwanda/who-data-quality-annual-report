import { useDataEngine } from '@dhis2/app-runtime'
import { useState, useEffect, useCallback } from 'react'
import defaultConfigurations from '../../data/metadata.json'

// If in a dev environment, use a custom data store key if it's set.
// Otherwise, use "configurations" (if none is set or in production)
const DATASTORE_KEY =
    (process.env.NODE_ENV === 'development' &&
        process.env.REACT_APP_DHIS2_APP_DATASTORE_KEY) ||
    'configurations'
export const DATASTORE_ID = `who-dqa/${DATASTORE_KEY}`

const OLD_APP_DATASTORE_ID = 'dataQualityTool/settings'

const CONFIGURATIONS_QUERY = {
    configurations: {
        resource: 'dataStore',
        // could be for old app or new app settings
        id: ({ oldApp }) => (oldApp ? OLD_APP_DATASTORE_ID : DATASTORE_ID),
    },
}
const SET_UP_CONFIGURATIONS_MUTATION = {
    // would normally use 'id' property here instead of concatenating, but
    // 'id' isn't valid on 'create' type mutations
    resource: `dataStore/${DATASTORE_ID}`,
    type: 'create',
    data: ({ newConfigurations }) => newConfigurations,
}

// See https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-237/data-store.html#webapi_data_store_sharing
const DATASTORE_METADATA_QUERY = {
    dataStoreMetadata: { resource: `dataStore/${DATASTORE_ID}/metaData` },
}
const DATASTORE_SHARING_MUTATION = {
    resource: 'sharing',
    type: 'create',
    params: ({ id }) => ({ type: 'dataStore', id }),
    // new sharing settings:
    data: { object: { publicAccess: 'r-------' } },
}
const updateDatastoreSharing = async (engine) => {
    try {
        const data = await engine.query(DATASTORE_METADATA_QUERY)
        const dataStoreID = data.dataStoreMetadata.id
        await engine.mutate(DATASTORE_SHARING_MUTATION, {
            variables: { id: dataStoreID },
        })
    } catch (err) {
        console.error('Error updating datastore sharing settings')
        console.error(err)
    }
}

const convertOldConfigToNew = (oldConfigurations) => {
    // Add 'core' property directly on to numerators
    const { coreIndicators } = oldConfigurations
    const newNumerators = oldConfigurations.numerators.map((numerator) => {
        return { ...numerator, core: coreIndicators.includes(numerator.code) }
    })
    return { ...oldConfigurations, numerators: newNumerators }
}

export const useSetUpConfigurations = (setConfigurations) => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const fetchAndSetConfigurations = useCallback(async () => {
        try {
            const data = await engine.query(CONFIGURATIONS_QUERY)
            setConfigurations(data.configurations)
            setLoading(false)
            return
        } catch (err) {
            const needToSetUpDatastore = err.details?.httpStatusCode === 404
            if (!needToSetUpDatastore) {
                // error is from something else
                setError(err)
                setLoading(false)
                return
            }
        }

        // otherwise, try to set up the data store:
        // first check if thereare settings from the old app
        let newConfigurations
        try {
            const data = await engine.query(CONFIGURATIONS_QUERY, {
                variables: { oldApp: true },
            })
            console.log('Configurations from old app found; using those')
            newConfigurations = convertOldConfigToNew(data.configurations)

            // todo: prompt the user to confirm using old settings
        } catch (err) {
            const noConfigFound = err.details?.httpStatusCode === 404
            if (!noConfigFound) {
                // error is from something else; exit
                setError(err)
                setLoading(false)
                return
            }

            // otherwise, we can set up the default configurations
            console.log('No previous configurations found; setting up defaults')
            // (currently these defaults are also from the old app)
            newConfigurations = convertOldConfigToNew(defaultConfigurations)
        }

        // finally, send mutation of new configurations to set up data store
        try {
            console.log('Setting up data store key', DATASTORE_KEY)
            await engine.mutate(SET_UP_CONFIGURATIONS_MUTATION, {
                variables: { newConfigurations },
            })
            setConfigurations(newConfigurations)
            setLoading(false)
        } catch (err) {
            setError(err)
            setLoading(false)
            return
        }

        // And afterwards, update sharing for this datastore key to 'r-------'
        // (results aren't critical so it doesn't have to affect any state here)
        updateDatastoreSharing(engine)
    }, [engine, setConfigurations])

    useEffect(() => {
        fetchAndSetConfigurations()
    }, [fetchAndSetConfigurations])

    return { loading, error, refetch: fetchAndSetConfigurations }
}
