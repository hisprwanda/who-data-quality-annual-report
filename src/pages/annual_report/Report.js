import { useDataQuery } from '@dhis2/app-runtime'
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
    const [selectedPeriod, setSelectedPeriod] = useState(null)
    const [yearsForReference, setYearsForReference] = useState(3)

    const configuration = data?.configuration
    const reportGenerateEnabled =
        selectedGroup &&
        selectedOrgUnit.id &&
        selectedOrgUnitLevel &&
        selectedPeriod &&
        yearsForReference
    const currentReportParameters = useMemo(
        () =>
            getReportParameters({
                groupID: selectedGroup,
                orgUnitID: selectedOrgUnit.id,
                configuration,
                orgUnitLevel: selectedOrgUnitLevel,
                periodID: selectedPeriod?.id,
                yearsForReference,
            }),
        [
            selectedOrgUnit.id,
            selectedGroup,
            configuration,
            selectedOrgUnitLevel,
            selectedPeriod?.id,
            yearsForReference,
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
        return <span>error</span>
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
                                Generate report
                            </Button>
                            <Button small>Print</Button>
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
                        selectedPeriod={selectedPeriod}
                        setSelectedPeriod={setSelectedPeriod}
                        yearsForReference={yearsForReference}
                        setYearsForReference={setYearsForReference}
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
