import { useDataEngine, useAlert } from '@dhis2/app-runtime'
import { useCallback } from 'react'
import { configurationsReducer } from './configurationsReducer.js'
import { DATASTORE_ID } from './constants.js'

const UPDATE_CONFIGURATIONS_MUTATION = {
    resource: 'dataStore',
    id: DATASTORE_ID,
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
 * 
 * This hook is a 'base' that can be used in useSetUpConfigurations, before
 * the setConfigurations context is available, or for the 
 * useConfigurationsDispatch hook intended to be supported by the 
 * ConfigurationsProvider
 */
export const useConfigurationsDispatchBase = (setConfigurations) => {
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

    const dispatch = useCallback(
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
