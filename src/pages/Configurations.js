import React from 'react'
import ConfigTabs from '../components/config-tabs/ConfigTabs.js'
import { DataItemNamesProvider, useConfigurations } from '../utils/index.js'
import styles from './Configurations.module.css'

export const Configurations = () => {
    const configurations = useConfigurations()

    return (
        <DataItemNamesProvider>
            <div className={styles.configurationsContainer}>
                <ConfigTabs configurations={configurations} />
            </div>
        </DataItemNamesProvider>
    )
}
