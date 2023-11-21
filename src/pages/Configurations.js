import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import ConfigTabs from '../components/config-tabs/ConfigTabs.js'
import { DataItemNamesProvider, useConfigurations } from '../utils/index.js'
import styles from './Configurations.module.css'

export const Configurations = ({ setIsReportPage }) => {
    const configurations = useConfigurations()
    useEffect(() => {
        setIsReportPage(false)
    })

    return (
        <DataItemNamesProvider>
            <div className={styles.configurationsContainer}>
                <ConfigTabs configurations={configurations} />
            </div>
        </DataItemNamesProvider>
    )
}

Configurations.propTypes = {
    setIsReportPage: PropTypes.func,
}
