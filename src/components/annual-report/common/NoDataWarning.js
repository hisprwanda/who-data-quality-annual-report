import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

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
