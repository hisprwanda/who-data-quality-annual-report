import i18n from '@dhis2/d2-i18n'
import { CenteredContent, NoticeBox } from '@dhis2/ui'
import React from 'react'
import ConfigTabs from '../components/config-tabs/ConfigTabs.js'
import {
    DataItemNamesProvider,
    useConfigurations,
    useUserContext,
} from '../utils/index.js'
import styles from './Configurations.module.css'

export const Configurations = () => {
    const configurations = useConfigurations()
    const { isAuthorized } = useUserContext()

    if (isAuthorized) {
        return (
            <CenteredContent>
                <NoticeBox warning title={i18n.t('No access')}>
                    {i18n.t(
                        'You do not have access to the configurations module.'
                    )}
                </NoticeBox>
            </CenteredContent>
        )
    }

    return (
        <DataItemNamesProvider>
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
        </DataItemNamesProvider>
    )
}
