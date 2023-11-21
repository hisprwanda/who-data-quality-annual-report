import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, SelectorBar } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
// import { Link } from 'react-router-dom'
import { useConfigurations } from '../../utils/index.js'
import { GenerateReportTooltip } from './GenerateReportButtonTooltip.js'
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

const updateHistory = (to) => {
    window.history.pushState({}, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
}

export const Link = ({ to, children }) => (
    <>
        <span
            onClick={() => {
                updateHistory(to)
            }}
        >
            {children}
        </span>
        <style>
            {`
        span * {
            text-decoration: underline;
            cursor: pointer;
        }
    `}
        </style>
    </>
)

Link.propTypes = {
    children: PropTypes.node,
    to: PropTypes.string,
}

const LinkButton = ({ isReportPage }) => {
    if (!isReportPage) {
        return (
            <Link to="/">
                <Button small>{i18n.t('Exit configurations')}</Button>
            </Link>
        )
    }
    return (
        <Link to="/#/configurations">
            <Button small>{i18n.t('Configurations')}</Button>
        </Link>
    )
}

LinkButton.propTypes = {
    isReportPage: PropTypes.bool,
}

export const ReportParameterSelector = ({
    setReportParameters,
    isReportPage,
}) => {
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
                orgUnitLevels: data?.orgUnitLevels.organisationUnitLevels,
                periods: selectedPeriods,
            }),
        [
            selectedOrgUnit.id,
            selectedOrgUnit.level,
            selectedGroup,
            configurations,
            selectedOrgUnitLevel,
            selectedPeriods,
            data,
        ]
    )

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
            <SelectorBar
                additionalContent={
                    <div className={styles.additionalContentContainer}>
                        <LinkButton isReportPage={isReportPage} />
                    </div>
                }
            >
                <GroupSelector
                    groups={configurations?.groups}
                    selectedGroup={selectedGroup}
                    setSelectedGroup={setSelectedGroup}
                    disabled={!isReportPage}
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
                    disabled={!isReportPage}
                />
                <PeriodSelector
                    selectedPeriods={selectedPeriods}
                    setSelectedPeriods={setSelectedPeriods}
                    disabled={!isReportPage}
                />
                <div className={styles.generateReportButtonContainer}>
                    <GenerateReportTooltip
                        disabled={!isReportPage || !reportGenerateEnabled}
                        isReportPage={isReportPage}
                    >
                        <Button
                            small
                            primary
                            onClick={generateReport}
                            disabled={!isReportPage || !reportGenerateEnabled}
                        >
                            {i18n.t('Generate report')}
                        </Button>
                    </GenerateReportTooltip>
                </div>
            </SelectorBar>
        )
    }
}
ReportParameterSelector.propTypes = {
    isReportPage: PropTypes.bool,
    setReportParameters: PropTypes.func,
}
