import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { LoadingSpinner } from '../../components/loading-spinner/LoadingSpinner.js'
import { UserContext } from './userContext.js'

const query = {
    user: {
        resource: 'me',
        params: {
            fields: [
                'id',
                'dataViewOrganisationUnits',
                'organisationUnits',
                'userCredentials[userRoles[id,authorities]]',
            ],
        },
    },
}

export const UserProvider = ({ children }) => {
    const { loading, error, data } = useDataQuery(query)

    if (loading) {
        return <LoadingSpinner />
    }

    if (error) {
        return (
            <NoticeBox error>
                {i18n.t(
                    'It was not possible to retrieve user information for the current user.'
                )}
            </NoticeBox>
        )
    }

    const { dataViewOrganisationUnits, organisationUnits, userCredentials } =
        data?.user || {}

    const rootOrgUnits = (
        dataViewOrganisationUnits ??
        organisationUnits ??
        []
    ).map(({ id }) => id)

    const isAuthorized = (userCredentials?.userRoles ?? []).some(
        ({ authorities }) =>
            authorities.includes('ALL') ||
            authorities.includes('F_INDICATOR_PUBLIC_ADD')
    )

    const providerValue = {
        isAuthorized,
        rootOrgUnits,
    }
    console.log(providerValue)

    return (
        <UserContext.Provider value={providerValue}>
            {children}
        </UserContext.Provider>
    )
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
