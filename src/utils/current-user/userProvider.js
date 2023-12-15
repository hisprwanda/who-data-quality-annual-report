import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { LoadingSpinner } from '../../components/loading-spinner/LoadingSpinner.js'
import { DATASTORE_ID } from '../configurations/index.js'
import { UserContext } from './userContext.js'

const query = {
    user: {
        resource: 'me',
        params: {
            fields: [
                'id',
                'dataViewOrganisationUnits',
                'organisationUnits',
                'authorities',
                'userGroups',
            ],
        },
    },
    dataStoreSharing: {
        resource: `dataStore`,
        id: `${DATASTORE_ID}/metaData`,
    },
}

const getAuthorizedIDs = (allItems) =>
    !Array.isArray(allItems)
        ? []
        : [...allItems]
              .filter(({ access }) => access === 'rw------')
              .map(({ id }) => id)

export const UserProvider = ({ children }) => {
    const { loading, error, data } = useDataQuery(query)

    if (loading) {
        return <LoadingSpinner />
    }

    if (error) {
        return (
            <NoticeBox error>
                {i18n.t(
                    'It was not possible to retrieve user information for the current user or the sharing settings of the configurations.'
                )}
            </NoticeBox>
        )
    }

    const {
        dataViewOrganisationUnits,
        organisationUnits,
        authorities,
        id: userID,
        userGroups: meUserGroups,
    } = data?.user || {}

    const { userGroupAccesses, userAccesses } = data?.dataStoreSharing || {}

    const rootOrgUnits = (
        dataViewOrganisationUnits ??
        organisationUnits ??
        []
    ).map(({ id }) => id)

    const authorizedGroups = getAuthorizedIDs(userGroupAccesses)
    const authorizedUsers = getAuthorizedIDs(userAccesses)
    const meUserGroupIDs = meUserGroups.map(({ id }) => id)

    const isAuthorized =
        authorities?.includes('ALL') ||
        authorizedUsers.includes(userID) ||
        authorizedGroups.some((authorizedID) =>
            meUserGroupIDs.includes(authorizedID)
        )

    const providerValue = {
        isAuthorized,
        rootOrgUnits,
    }

    return (
        <UserContext.Provider value={providerValue}>
            {children}
        </UserContext.Provider>
    )
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
