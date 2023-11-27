import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { useUserContext } from '../../../utils/index.js'
import styles from './InterpretationsField.module.css'

export const NoDataInfoBox = ({ subsection }) => (
    <NoticeBox
        title={i18n.t('There is no data for this {{sectionType}}', {
            sectionType: subsection ? i18n.t('subsection') : i18n.t('section'),
        })}
    />
)

NoDataInfoBox.propTypes = {
    subsection: PropTypes.bool,
}

export const SectionError = ({ error }) => (
    <NoticeBox
        error
        title={i18n.t('Something went wrong when retrieving data')}
    >
        {error?.message}
    </NoticeBox>
)

SectionError.propTypes = {
    error: PropTypes.object,
}

export const NoMappingsWarning = () => {
    const { isAuthorized } = useUserContext()
    return (
        <NoticeBox
            title={i18n.t(
                'The Data Quality Annual Report has not been configured'
            )}
        >
            {isAuthorized ? (
                <span>
                    Go to the{' '}
                    <Link to={'/configurations'}>configurations page</Link> to
                    set up the report.
                </span>
            ) : (
                <span>Contact your system administrator.</span>
            )}
        </NoticeBox>
    )
}

export const CouldNotCalculateOverall = ({ subOrgUnitLevelName }) => (
    <div className={styles.gridSpan2}>
        <NoticeBox>
            {i18n.t(
                'Could not calculate overall score. Calculations at {{subOrgUnitLevelName}} level were skipped.',
                { subOrgUnitLevelName }
            )}
        </NoticeBox>
    </div>
)

CouldNotCalculateOverall.propTypes = {
    subOrgUnitLevelName: PropTypes.string,
}

export const CouldNotCalculateSubOrgUnits = ({ invalidSubOrgUnitNames }) => (
    <div className={styles.gridSpan2}>
        <NoticeBox>
            {i18n.t(
                'Could not calculate score for the following: {{invalidSubOrgUnitNames}}.',
                {
                    invalidSubOrgUnitNames: invalidSubOrgUnitNames,
                    nsSeparator: '-:-',
                }
            )}
        </NoticeBox>
    </div>
)

CouldNotCalculateSubOrgUnits.propTypes = {
    invalidSubOrgUnitNames: PropTypes.string,
}

export const CouldNotCalculateLevels = ({ subOrgUnitLevelName }) => (
    <div className={styles.gridSpan2}>
        <NoticeBox>
            {i18n.t(
                'The requested level for this relation ({{subOrgUnitLevelName}}) is not retrievable.',
                { subOrgUnitLevelName }
            )}
        </NoticeBox>
    </div>
)

CouldNotCalculateLevels.propTypes = {
    subOrgUnitLevelName: PropTypes.string,
}
