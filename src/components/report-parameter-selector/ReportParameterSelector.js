import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, NoticeBox, SelectorBar } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import { useConfigurations } from '../../utils/index.js'
import { LoadingSpinner } from '../loading-spinner/LoadingSpinner.js'
import { getReportParameters } from './getReportParameters.js'
import { GroupSelector } from './GroupSelector.js'
import { OrgUnitSelector } from './OrgUnitSelector.js'
import { PeriodSelector } from './PeriodSelector.js'
import styles from './ReportParameterSelector.module.css'

const configQuery = {
    me: {
        resource: 'me',
        params: {
            fields: ['dataViewOrganisationUnits', 'organisationUnits'],
        },
    },
    orgUnitLevels: {
        resource: 'organisationUnitLevels',
        params: {
            paging: false,
            fields: ['id', 'displayName', 'level'],
            order: 'level:asc',
        },
    },
}

export const ReportParameterSelector = ({ setReportParameters }) => {
    const { loading, data, error } = useDataQuery(configQuery)
    const configurations = useConfigurations()

    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selectedOrgUnit, setSelectedOrgUnit] = useState({})
    const [selectedOrgUnitLevel, setSelectedOrgUnitLevel] = useState(null)
    const [selectedPeriods, setSelectedPeriods] = useState([])

    const reportGenerateEnabled =
        selectedGroup &&
        selectedOrgUnit.id &&
        selectedOrgUnitLevel &&
        selectedPeriods.length > 0
    const currentReportParameters = useMemo(
        () =>
            getReportParameters({
                groupID: selectedGroup,
                orgUnitID: selectedOrgUnit.id,
                boundaryOrgUnitLevel: selectedOrgUnit.level,
                configurations,
                orgUnitLevel: selectedOrgUnitLevel,
                periods: selectedPeriods,
            }),
        [
            selectedOrgUnit.id,
            selectedOrgUnit.level,
            selectedGroup,
            configurations,
            selectedOrgUnitLevel,
            selectedPeriods,
        ]
    )

    const generateReport = () => {
        setReportParameters(currentReportParameters)
    }

    if (loading) {
        return <LoadingSpinner />
    }

    if (error) {
        console.error(error)
        return (
            <div className={styles.noticeBoxContainer}>
                <NoticeBox error title="Report cannot be generated">
                    The app failed to retrieve required information about
                    organisation units. Without this information, the annual
                    report cannot be generated.
                </NoticeBox>
            </div>
        )
    }

    if (data) {
        return (
            <SelectorBar
                additionalContent={
                    <div className={styles.additionalContent}>
                        <Button
                            small
                            primary
                            onClick={generateReport}
                            disabled={!reportGenerateEnabled}
                        >
                            {i18n.t('Generate report')}
                        </Button>
                        <Button small>{i18n.t('Print')}</Button>
                    </div>
                }
            >
                <GroupSelector
                    groups={configurations?.groups}
                    selectedGroup={selectedGroup}
                    setSelectedGroup={setSelectedGroup}
                />
                <OrgUnitSelector
                    orgUnitLevels={data?.orgUnitLevels?.organisationUnitLevels}
                    rootOrgUnitsInfo={
                        data?.me?.dataViewOrganisationUnits?.length
                            ? data.me.dataViewOrganisationUnits
                            : data.me.organisationUnits
                    }
                    selectedOrgUnit={selectedOrgUnit}
                    setSelectedOrgUnit={setSelectedOrgUnit}
                    selectedOrgUnitLevel={selectedOrgUnitLevel}
                    setSelectedOrgUnitLevel={setSelectedOrgUnitLevel}
                />
                <PeriodSelector
                    selectedPeriods={selectedPeriods}
                    setSelectedPeriods={setSelectedPeriods}
                />
            </SelectorBar>
        )
    }
}
ReportParameterSelector.propTypes = {
    setReportParameters: PropTypes.func,
}
