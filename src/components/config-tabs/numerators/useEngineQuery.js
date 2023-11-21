import { useDataEngine } from '@dhis2/app-runtime'
import React, { useState } from 'react'

/**
 * This util is useful in a component where you might want to make different
 * queries based on the context: you can choose the query at fetch time and
 * the `error` and `loading` states are consolidated
 */
export const useEngineQuery = () => {
    const engine = useDataEngine()
    const [data, setData] = useState()
    const [loading, setLoading] = useState()
    const [error, setError] = useState()

    const fetch = React.useCallback(
        async (query, variables) => {
            setLoading(true)
            setError(false)
            try {
                const data = await engine.query(query, { variables })
                setData(data)
                setLoading(false)
                return data
            } catch (err) {
                setError(err)
                setLoading(false)
                throw err // won't crash the app; can be useful to catch
            }
        },
        [engine]
    )

    return { data, loading, error, fetch }
}
