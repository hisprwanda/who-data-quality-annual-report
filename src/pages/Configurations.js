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

    if (!isAuthorized) {
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
                <ConfigTabs configurations={configurations} />
            </div>
        </DataItemNamesProvider>
    )
}
