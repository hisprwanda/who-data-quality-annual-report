import { Box, CenteredContent, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useContext } from 'react'
import { LoadingSpinner } from '../../components/loading-spinner/LoadingSpinner.js'
import { useConfigurationsDispatchBase } from './useConfigurationsDispatchBase.js'
import { useSetUpConfigurations } from './useSetUpConfigurations.js'

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

/**
 * Returns a `dispatch` function, intended to a `data` parameter with the shape
 * { type, payload }.
 * type is an action type, which can be found in configurationsReducer.js;
 * payload is the required information to complete the relevant action.
 *
 * See useConfigurationsDispatchBase.js for more details
 */
export const useConfigurationsDispatch = () => {
    const setConfigurations = useContext(SetConfigurationsContext)
    const dispatch = useConfigurationsDispatchBase(setConfigurations)

    if (!setConfigurations) {
        throw new Error(
            'useUpdateConfigurations must be used inside of a ConfigurationsProvider'
        )
    }

    return dispatch
}
