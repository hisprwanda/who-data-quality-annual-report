import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'

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
    // todo: if not an admin, say "contact a system administrator" instead
    return (
        <NoticeBox
            title={i18n.t(
                'The Data Quality Annual Report has not been configured'
            )}
        >
            Go to the <Link to={'/configurations'}>configurations page</Link> to
            set up the report.
        </NoticeBox>
    )
}
