import { useAlert, useDataEngine, useDataQuery } from '@dhis2/app-runtime'
import {
    Box,
    CenteredContent,
    CircularLoader,
    Layer,
    NoticeBox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useContext } from 'react'
import { configurationsReducer } from './configurationsReducer.js'

// todo:
// 4. set up a datastore key if one isn't already with default config (RWDQA-50)

const DATASTORE_KEY = process.env.REACT_APP_DHIS2_APP_DATASTORE_KEY || 'configurations'
const DATASTORE_ENDPOINT = 'dataStore/who-dqa/' + DATASTORE_KEY
const CONFIGURATIONS_QUERY = {
    configurations: {
        resource: DATASTORE_ENDPOINT,
    },
}

const LoadingSpinner = () => (
    <Layer>
        <CenteredContent>
            <CircularLoader />
        </CenteredContent>
    </Layer>
)

const ErrorInfo = ({ errorMessage }) => (
    <Box height={'100%'}>
        <CenteredContent>
            <NoticeBox
                error
                title={'Error when fetching report configurations'}
            >
                {errorMessage}
            </NoticeBox>
        </CenteredContent>
    </Box>
)
ErrorInfo.propTypes = { errorMessage: PropTypes.string }

// These contexts are separated so that 'update' consumers don't
// necessarily rerender when the `configurations` object updates
// and vice versa (it's a small optimization)
const ConfigurationsContext = React.createContext()
const SetConfigurationsContext = React.createContext()

/**
 * This will fetch configurations once, then maintain it in state.
 * Further updates should be reflected locally without needing to refetch
 */
export const ConfigurationsProvider = ({ children }) => {
    const [configurations, setConfigurations] = useState({})
    const { loading, error, data } = useDataQuery(CONFIGURATIONS_QUERY, {
        onComplete: (data) => {
            setConfigurations(data.configurations)
        },
        // todo: on error, check if the datastore key doesn't exist yet.
        // if not, create one
    })

    if (loading) {
        return <LoadingSpinner />
    }

    if (error) {
        console.error(error)
        return (
            <ErrorInfo errorMessage={error.details?.message || error.message} />
        )
    }

    // this check helps avoid crashes during hot-reloads in development
    if (!data) {
        return null
    }

    return (
        <ConfigurationsContext.Provider value={configurations}>
            <SetConfigurationsContext.Provider value={setConfigurations}>
                {children}
            </SetConfigurationsContext.Provider>
        </ConfigurationsContext.Provider>
    )
}
ConfigurationsProvider.propTypes = {
    children: PropTypes.node,
}

/** Returns just the configuration state */
export const useConfigurations = () => {
    const configurations = useContext(ConfigurationsContext)

    if (!configurations) {
        throw new Error(
            'useConfigurations must be used inside of a ConfigurationsProvider'
        )
    }

    return configurations
}

const UPDATE_CONFIGURATIONS_MUTATION = {
    resource: DATASTORE_ENDPOINT,
    type: 'update',
    data: ({ newConfigurations }) => newConfigurations,
}

/**
 * Returns updateConfigurations, which accepts a complete new configuration object,
 * updates the `configurations` state locally, and syncs the new configurations
 * with the server. It also handles errors with the network request
 */
export const useUpdateConfigurations = () => {
    const setConfigurations = useContext(SetConfigurationsContext)
    const engine = useDataEngine()
    const { show } = useAlert(
        ({ errorMessage }) => 'Configurations update failed: ' + errorMessage,
        { critical: true }
    )

    if (!setConfigurations) {
        throw new Error(
            'useUpdateConfigurations must be used inside of a ConfigurationsProvider'
        )
    }

    const updateConfigurations = React.useCallback(
        async (newConfigurations) => {
            // update lastUpdate property in configurations
            // todo: do here or in configurations reducer?
            newConfigurations.lastUpdated = new Date().toISOString()
            let configurationsBackup
            // set local configurations object (optimistically)
            // use a function as the arg to avoid needing a dependency on `configurations`
            setConfigurations((prevConfigurations) => {
                // save a backup in case the mutation fails
                configurationsBackup = prevConfigurations
                return newConfigurations
            })
            try {
                // update the configurations on the server
                await engine.mutate(UPDATE_CONFIGURATIONS_MUTATION, {
                    variables: { newConfigurations },
                })
            } catch (err) {
                // if it fails, roll back to previous configurations locally
                setConfigurations(configurationsBackup)
                // and alert the error
                show({ errorMessage: err.details?.message || err.message })
                console.error(err, { details: err.details })
            }
        },
        [setConfigurations, engine, show]
    )

    return updateConfigurations
}

/**
 * Returns a `dispatch` function, intended to a `data` parameter with the shape
 * { type, payload }.
 * type is an action type, which can be found in configurationsReducer.js
 * payload is the required information to complete the relevant action
 *
 * Invokes the reducer function found in configurationsReducer.js to get a new
 * configurations object, then sets the local state to that new object,
 * attempts to sync that object with the server, and handles any errors
 *
 * Doesn't exactly use `useReducer` under the hood, but matches the same
 * behavior, pattern, and function signature, so the guidelines at
 * https://react.dev/reference/react/useReducer are relevant and helpful.
 * (`useState` is used here to help integrate with optimistic updates and
 * error checking)
 */
export const useConfigurationsDispatch = () => {
    const setConfigurations = useContext(SetConfigurationsContext)
    const engine = useDataEngine()
    const { show } = useAlert(
        ({ errorMessage }) => 'Configurations update failed: ' + errorMessage,
        { critical: true }
    )

    if (!setConfigurations) {
        throw new Error(
            'useUpdateConfigurations must be used inside of a ConfigurationsProvider'
        )
    }

    const dispatch = React.useCallback(
        async ({ type, payload }) => {
            let configurationsBackup
            let newConfigurations
            // set local configurations object (optimistically)
            // use a function as an arg to get previous value without needing
            // a dependency on `configurations`
            setConfigurations((prevConfigurations) => {
                // save a backup in case the mutation fails
                configurationsBackup = prevConfigurations
                // use reducer to get the new configurations object
                newConfigurations = configurationsReducer(prevConfigurations, {
                    type,
                    payload,
                })
                return newConfigurations
            })
            try {
                // update the configurations on the server
                await engine.mutate(UPDATE_CONFIGURATIONS_MUTATION, {
                    variables: { newConfigurations },
                })
            } catch (err) {
                // if it fails, roll back to previous configurations locally
                setConfigurations(configurationsBackup)
                // and alert the error
                show({ errorMessage: err.details?.message || err.message })
                console.error(err, { details: err.details })
            }
        },
        [setConfigurations, engine, show]
    )

    return dispatch
}
