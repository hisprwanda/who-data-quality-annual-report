import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { useConfigurations } from '../../utils/index.js'
import { CORE_GROUP_CODE } from '../report-parameter-selector/index.js'
import styles from './ReportPrintHeader.module.css'

/** Shown only in print to indicate report parameters */
export const ReportPrintHeader = ({ reportParameters }) => {
    const configurations = useConfigurations()

    const groupName = React.useMemo(() => {
        if (!reportParameters?.groupID) {
            return null
        }
        if (reportParameters.groupID === CORE_GROUP_CODE) {
            return i18n.t('[Core]')
        }
        const group = configurations.groups.find(
            (group) => group.code === reportParameters.groupID
        )
        return group.name
    }, [configurations, reportParameters])

    if (!reportParameters || Object.keys(reportParameters).length === 0) {
        return null
    }

    const { orgUnitName, orgUnitLevelName, periods } = reportParameters

    return (
        <div className={styles.showOnlyInPrint}>
            <h1 className={styles.title}>
                {i18n.t('Data Quality Annual Report')}
            </h1>
            <div className={styles.parametersContainer}>
                <p className={styles.parameterLine}>
                    <strong>{i18n.t('Data: ', { nsSeparator: '-:-' })}</strong>
                    {groupName}
                </p>
                <p className={styles.parameterLine}>
                    <strong>
                        {i18n.t('Organisation unit: ', { nsSeparator: '-:-' })}
                    </strong>
                    {`${orgUnitName} > ${orgUnitLevelName}`}
                </p>
                <p className={styles.parameterLine}>
                    <strong>
                        {i18n.t('Period: ', { nsSeparator: '-:-' })}
                    </strong>
                    {i18n.t('{{period}}; {{years}} years for reference', {
                        period: periods[0].name,
                        years: periods.length - 1,
                    })}
                </p>
            </div>
        </div>
    )
}
ReportPrintHeader.propTypes = {
    reportParameters: PropTypes.object,
}
