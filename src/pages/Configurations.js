import React from 'react'
import ConfigTabs from '../components/config-tabs/ConfigTabs.js'
import { MetadataNamesProvider, useConfigurations } from '../utils/index.js'
import styles from './Configurations.module.css'

export const Configurations = () => {
    const configurations = useConfigurations()

    return (
        <MetadataNamesProvider>
            <div className={styles.configurationsContainer}>
                <div className={styles.subContainer}>
                    <div className={styles.descriptionText}>
                        <p>
                            This module is used for configuring the WHO Data
                            Quality Annual Report, and mapping the proposed data
                            quality indicators to data elements and indicators
                            in the DHIS 2 database. This configuration is used
                            as the basis for the Annual Report, and the
                            numerator and numerator group configuration is also
                            used for the Dashboard.
                        </p>
                    </div>

                    <div>
                        <ConfigTabs configurations={configurations} />
                    </div>
                </div>
            </div>
        </MetadataNamesProvider>
    )
}
