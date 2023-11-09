import { useAlert, useDataEngine } from '@dhis2/app-runtime'
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
import {
    useSetUpConfigurations,
    DATASTORE_ENDPOINT,
} from './useSetUpConfigurations.js'

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
const RefetchConfigurationsContext = React.createContext()

/**
 * This will fetch configurations once, then maintain it in state.
 * Further updates should be reflected locally without needing to refetch
 */
export const ConfigurationsProvider = ({ children }) => {
    const [configurations, setConfigurations] = useState(null)
    const { loading, error, refetch } =
        useSetUpConfigurations(setConfigurations)

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
    if (!configurations) {
        return null
    }

    return (
        <ConfigurationsContext.Provider value={configurations}>
            <SetConfigurationsContext.Provider value={setConfigurations}>
                <RefetchConfigurationsContext.Provider value={refetch}>
                    {children}
                </RefetchConfigurationsContext.Provider>
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

    if (configurations === undefined) {
        throw new Error(
            'useConfigurations must be used inside of a ConfigurationsProvider'
        )
    }

    return configurations
}

/**
 * NOTE THAT THIS IS A HOLD-OVER TO HANDLE THE CURRENT STATE MANAGEMENT,
 * i.e. before refactoring to use the more optimized tools in this file like
 * useConfigurationsDispatch().
 *
 * This app should move towards not using this at all and instead using the
 * other tools in this file. At that point, this hook can be removed.
 * See the handling in Numerator Relations for examples
 */
export const useRefetchConfigurations = () => {
    const refetch = useContext(RefetchConfigurationsContext)

    if (refetch === undefined) {
        throw new Error(
            'useConfigurations must be used inside of a ConfigurationsProvider'
        )
    }

    return refetch
}

const UPDATE_CONFIGURATIONS_MUTATION = {
    resource: DATASTORE_ENDPOINT,
    type: 'update',
    data: ({ newConfigurations }) => newConfigurations,
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
