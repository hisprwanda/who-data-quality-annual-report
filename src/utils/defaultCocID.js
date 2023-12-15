import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useMemo, useContext } from 'react'

const DEFAULT_COC_QUERY = {
    defaultCoc: {
        resource: 'categoryOptionCombos',
        params: {
            filter: 'name:eq:default',
            fields: 'id',
        },
    },
}

const DefaultCocIDContext = React.createContext()

export const DefaultCocIDProvider = ({ children }) => {
    const { data, loading, error } = useDataQuery(DEFAULT_COC_QUERY)

    const contextValue = useMemo(
        () => ({
            defaultCocID: data?.defaultCoc.categoryOptionCombos[0].id,
            loading,
            error,
        }),
        [data, loading, error]
    )

    return (
        <DefaultCocIDContext.Provider value={contextValue}>
            {children}
        </DefaultCocIDContext.Provider>
    )
}
DefaultCocIDProvider.propTypes = {
    children: PropTypes.node,
}

export const useDefaultCocID = () => {
    return useContext(DefaultCocIDContext)
}
