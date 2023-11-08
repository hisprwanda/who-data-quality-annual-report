import { useDataEngine } from '@dhis2/app-runtime'
import { useState, useEffect, useCallback } from 'react'
import defaultConfigurations from './defaultConfigurations.json'

// If in a dev environment, use a custom data store key if it's set.
// Otherwise, use "configurations" (if none is set or in production)
const DATASTORE_KEY =
    (process.env.NODE_ENV === 'development' &&
        process.env.REACT_APP_DHIS2_APP_DATASTORE_KEY) ||
    'configurations'
export const DATASTORE_ENDPOINT = 'dataStore/who-dqa/' + DATASTORE_KEY

const CONFIGURATIONS_QUERY = {
    configurations: {
        resource: DATASTORE_ENDPOINT,
    },
}
const SET_UP_CONFIGURATIONS_MUTATION = {
    resource: DATASTORE_ENDPOINT,
    type: 'create',
    data: defaultConfigurations,
}

export const useSetUpConfigurations = (setConfigurations) => {
    const engine = useDataEngine()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const fetchAndSetConfigurations = useCallback(() => {
        return (
            engine
                // attempt to fetch configurations
                .query(CONFIGURATIONS_QUERY)
                // return configurations object to next handlers
                .then((data) => data.configurations)
                .catch((err) => {
                    // if the fetch failed, we might need to set up the data store
                    const { details } = err
                    const needToSetUpDatastore = details?.httpStatusCode === 404
                    if (needToSetUpDatastore) {
                        console.log('Setting up data store key', DATASTORE_KEY)
                        return (
                            engine
                                .mutate(SET_UP_CONFIGURATIONS_MUTATION)
                                // return 'defaultConfigurations' to the next handlers
                                .then(() => defaultConfigurations)
                        )
                    } else {
                        // otherwise, throw the error to the next handler
                        throw err
                    }
                })
                // if we got configurations, either from the fetch or the mutation,
                // set them
                .then((configurations) => {
                    setConfigurations(configurations)
                    setLoading(false)
                })
                // if there's still an error after attempting to set up the store,
                // handle that
                .catch((err) => {
                    setError(err)
                    setLoading(false)
                })
        )
    }, [engine, setConfigurations])

    useEffect(() => {
        fetchAndSetConfigurations()
    }, [fetchAndSetConfigurations])

    return { loading, error, refetch: fetchAndSetConfigurations }
}
