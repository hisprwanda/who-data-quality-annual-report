import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { Link } from 'react-router-dom'
import ConfigTabs from '../components/config-tabs/ConfigTabs.js'
import { DataItemNamesProvider, useConfigurations } from '../utils/index.js'
import styles from './Configurations.module.css'

export const Configurations = () => {
    const configurations = useConfigurations()

    return (
        <>
            <div className={styles.exitConfigurationsContainer}>
                <div className={styles.exitConfigurationsButtonContainer}>
                    <Link to="/">
                        <Button small>{i18n.t('Exit configurations')}</Button>
                    </Link>
                </div>
            </div>
            <DataItemNamesProvider>
                <div className={styles.configurationsContainer}>
                    <ConfigTabs configurations={configurations} />
                </div>
            </DataItemNamesProvider>
        </>
    )
}
