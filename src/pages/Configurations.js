import { useDataQuery, useAlert } from '@dhis2/app-runtime'
import React, { useState, useEffect } from 'react'
import ConfigTabs from '../components/config-tabs/ConfigTabs.js'
import styles from './Configurations.module.css'

//TODO: use a global state or context api to share these settings accross components
const readDataStoreQuery = {
    dataStore: {
        resource: 'dataStore/who-dqa/configurations',
    },
}

export const Configurations = () => {
    // A dynamic alert to communicate success or failure
    // TODO: put this one in a reusable function
    // const { show } = useAlert(
    //     ({ message }) => message,
    //     ({ status }) => {
    //         if (status === 'success') {
    //             return { success: true }
    //         } else if (status === 'error') {
    //             return { critical: true }
    //         } else {
    //             return {}
    //         }
    //     }
    // )

    // running the query
    const { loading, error, data } = useDataQuery(readDataStoreQuery)

    let configurations = null

    if (data) {
        configurations = data.dataStore
    }

    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    return (
        <div className={styles.configurationsContainer}>
            <div className={styles.subContainer}>
                <div className={styles.descriptionText}>
                    <p>
                        This module is used for configuring the WHO Data Quality
                        Annual Report, and mapping the proposed data quality
                        indicators to data elements and indicators in the DHIS 2
                        database. This configuration is used as the basis for
                        the Annual Report, and the numerator and numerator group
                        configuration is also used for the Dashboard.
                    </p>
                </div>

                <div>
                    {configurations ? (
                        <ConfigTabs
                            loading={loading}
                            configurations={configurations}
                        />
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </div>
    )
}
