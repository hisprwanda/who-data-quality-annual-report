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
// 1. fetch & share configurations with all consumers ✅
// 2. make a generic mutation function ✅
// 3. each mutation should 1) sync with the server 2) check for errors ✅✅
// - if there's an error, 1) roll back local state 2) show an error message ✅✅
// 4. set up a datastore key if one isn't already with default config (RWDQA-50)

// todo: edit endpoint
const DATASTORE_ENDPOINT = 'dataStore/who-dqa/configurationsKai'
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

const ConfigurationsContext = React.createContext()

/**
 * This will fetch configurations once, then maintain it in state.
 * Further updates should be reflected locally without needing to refetch
 */
export const ConfigurationsProvider = ({ children }) => {
    const [configurations, setConfigurations] = useState()
    const { loading, error } = useDataQuery(CONFIGURATIONS_QUERY, {
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
        return <ErrorInfo errorMessage={error.message} />
    }

    return (
        <ConfigurationsContext.Provider
            value={[configurations, setConfigurations]}
        >
            {children}
        </ConfigurationsContext.Provider>
    )
}
ConfigurationsProvider.propTypes = {
    children: PropTypes.node,
}

/** Returns just the configuration state */
export const useConfigurations = () => {
    const context = useContext(ConfigurationsContext)

    if (!context) {
        throw new Error(
            'useConfigurations must be used inside of a ConfigurationsProvider'
        )
    }

    // return just `configurations`, not `setConfigurations`
    return context[0]
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
const useUpdateConfigurations = () => {
    const context = useContext(ConfigurationsContext)
    const engine = useDataEngine()
    const { show } = useAlert(
        ({ errorMessage }) => 'Configurations update failed: ' + errorMessage,
        { critical: true }
    )

    if (!context) {
        throw new Error(
            'useUpdateConfigurations must be used inside of a ConfigurationsProvider'
        )
    }
    const [, setConfigurations] = context

    const updateConfigurations = React.useCallback(
        async (newConfigurations) => {
            // update lastUpdate property in configurations
            // todo: do here or in configurations reducer?
            newConfigurations.lastUpdated = new Date().toISOString()
            // set local configurations object (optimistically)
            let configurationsBackup
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
                console.error(err)
                // if it fails, roll back to previous configurations locally
                setConfigurations(configurationsBackup)
                // and alert the error
                show({ errorMessage: err.message })
            }
        },
        [setConfigurations, engine, show]
    )

    return updateConfigurations
}

export const useDispatchConfigurationsUpdate = () => {
    const configurations = useConfigurations()
    const updateConfigurations = useUpdateConfigurations()

    const dispatch = React.useCallback(
        ({ type, payload }) => {
            const newConfigurations = configurationsReducer(configurations, {
                type,
                payload,
            })
            updateConfigurations(newConfigurations)
        },
        [configurations, updateConfigurations]
    )

    return dispatch
}
