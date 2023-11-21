import i18n from '@dhis2/d2-i18n'
import { Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

export const GenerateReportTooltip = ({ disabled, isReportPage, children }) => {
    return disabled ? (
        <Tooltip
            content={
                !isReportPage
                    ? i18n.t('Report must be generated from report page.')
                    : i18n.t(
                          'Group, Organisation unit, Organisation unit level, period, and comparison periods must all be selected before a report can be generated.'
                      )
            }
        >
            {children}
        </Tooltip>
    ) : (
        <>{children}</>
    )
}

GenerateReportTooltip.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    isReportPage: PropTypes.bool,
}
