import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, SelectorBar } from '@dhis2/ui'
import React, { useMemo, useState } from 'react'
import { ReportData } from '../../components/annual-report/report-data/ReportData.js'
import {
    GroupSelector,
    OrgUnitSelector,
    PeriodSelector,
} from '../../components/context-selection/index.js'
import MenuBar from '../../components/menu-bar/MenuBar.js'
import { getReportParameters } from './getReportParameters.js'
import styles from './Report.module.css'

const configQuery = {
    configuration: {
        resource: 'dataStore/who-dqa/configurations',
    },
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

const Report = () => {
    const { loading, data, error } = useDataQuery(configQuery)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selectedOrgUnit, setSelectedOrgUnit] = useState({})
    const [selectedOrgUnitLevel, setSelectedOrgUnitLevel] = useState(null)
    const [selectedPeriods, setSelectedPeriods] = useState([])

    const configuration = data?.configuration
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
                configuration,
                orgUnitLevel: selectedOrgUnitLevel,
                periods: selectedPeriods,
            }),
        [
            
            selectedOrgUnit.id,
            selectedOrgUnit.level,
            selectedGroup,
            configuration,
            selectedOrgUnitLevel,
            selectedPeriods,
        ,
        ]
    )
    const [reportParameters, setReportParameters] = useState({})

    const generateReport = () => {
        setReportParameters(currentReportParameters)
    }

    if (loading) {
        return <span>Loading</span>
    }

    if (error) {
        console.error(error)
        return <span>Error</span>
    }

    if (data) {
        return (
            <>
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
                        groups={configuration?.groups}
                        selectedGroup={selectedGroup}
                        setSelectedGroup={setSelectedGroup}
                    />
                    <OrgUnitSelector
                        orgUnitLevels={
                            data?.orgUnitLevels?.organisationUnitLevels
                        }
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
                <ReportData reportParameters={reportParameters} />
            </>
        )
    }
}

const ReportContainer = () => {
    return (
        <>
            <MenuBar />
            <Report />
        </>
    )
}

export default ReportContainer
