import i18n from '@dhis2/d2-i18n'
import React from 'react'
import logo from '../../assets/images/WHO_logo.png'
import styles from './InfoScreen.module.css'

const documentationLink =
    'https://www.ssb.no/en/helse/artikler-og-publikasjoner/manual-for-the-dhis2-quality-tool'

export const ReportInfoScreen = () => (
    <div className={styles.wrapperDiv}>
        <div>
            <img
                src={logo}
                height="100px"
                alt="World Health Organization logo"
                className={styles.logoImage}
            />
        </div>
        <div className={styles.headingText}>
            {i18n.t('WHO Data Quality Annual Report')}
        </div>
        <div className={styles.instructionsText}>
            {i18n.t(
                'Choose a group, organisation unit, and period from the top bar and then click "Generate report"'
            )}
        </div>
        <div className={styles.linkTextContainer}>
            <a
                className={styles.linkText}
                target="_blank"
                rel="noreferrer noopener"
                href={documentationLink}
            >
                {i18n.t('Learn more about the Data Quality Annual Report')}
            </a>
        </div>
    </div>
)

export const ConfigInfoScreen = () => (
    <div className={styles.wrapperDiv}>
        <div>
            <img
                src={logo}
                height="100px"
                alt="World Health Organization logo"
                className={styles.logoImage}
            />
        </div>
        <div className={styles.headingText}>
            {i18n.t('WHO Data Quality Annual Report - Configuration')}
        </div>
        <div className={styles.instructionsText}>
            {i18n.t(
                'This module is used for configuring the WHO Data Quality Annual Report, and mapping the proposed data quality indicators to data elements and indicators in the DHIS2 database.'
            )}
        </div>

        <div className={styles.instructionsTextTwo}>
            {i18n.t(
                'This configuration is used as the basis for the Annual Report.'
            )}
        </div>
        <div className={styles.linkTextContainer}>
            <a
                className={styles.linkText}
                target="_blank"
                rel="noreferrer noopener"
                href={documentationLink}
            >
                {i18n.t('Learn more about the Data Quality Annual Report')}
            </a>
        </div>
    </div>
)
