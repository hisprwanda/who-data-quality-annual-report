import {
    Button,
    OrganisationUnitTree,
    SelectorBarItem,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './OrgUnitSelector.module.css'

const getSelectionLabel = ({
    selectedOrgUnit,
    selectedOrgUnitLevel,
    orgUnitLevels,
}) => {
    let label = ''
    label += selectedOrgUnit.displayName ?? ''
    label += label && selectedOrgUnitLevel ? '; ' : ''
    if (selectedOrgUnitLevel) {
        const orgUnitLevelName = orgUnitLevels.find(
            ({ level }) => String(level) === selectedOrgUnitLevel
        )?.displayName
        label += orgUnitLevelName
    }
    return label
}

export const OrgUnitSelector = ({
    orgUnitLevels,
    rootOrgUnitsInfo,
    selectedOrgUnit,
    setSelectedOrgUnit,
    selectedOrgUnitLevel,
    setSelectedOrgUnitLevel,
}) => {
    const [open, setOpen] = useState(false)
    const rootOrgUnits = rootOrgUnitsInfo.map(({ id }) => id)
    orgUnitLevels.map((oul) => ({ ...oul, level: Number(oul.level) }))
    orgUnitLevels.sort((a, b) => {
        return Number(a.level) - Number(b.level)
    })
    return (
        <SelectorBarItem
            label="Organisation unit"
            value={getSelectionLabel({
                selectedOrgUnit,
                selectedOrgUnitLevel,
                orgUnitLevels,
            })}
            open={open}
            setOpen={setOpen}
            noValueMessage={'Choose an organisation unit'}
        >
            <div className={styles.container}>
                <div className={styles.orgUnitTreeContainer}>
                    <span className={styles.orgUnitSpan}>
                        Choose an organisation unit
                    </span>
                    <OrganisationUnitTree
                        singleSelect
                        onChange={(orgUnit, e) => {
                            e.stopPropagation()
                            // level is not included on selected; would be better to amend
                            const computedLevel = (
                                orgUnit.path.match(/\//g) || []
                            ).length
                            // clear out selected level if selected org unit is too low
                            if (
                                selectedOrgUnitLevel &&
                                Number(selectedOrgUnitLevel) <= computedLevel
                            ) {
                                setSelectedOrgUnitLevel(null)
                            }
                            setSelectedOrgUnit({
                                ...orgUnit,
                                level: computedLevel,
                            })
                        }}
                        isUserDataViewFallback={true}
                        roots={rootOrgUnits}
                        selected={
                            selectedOrgUnit?.path ? [selectedOrgUnit?.path] : []
                        }
                    />
                </div>
                <div className={styles.orgUnitTreeContainer}>
                    <SingleSelectField
                        label={'Choose an organisation unit level'}
                        selected={selectedOrgUnitLevel ?? ''}
                        onChange={({ selected }) =>
                            setSelectedOrgUnitLevel(selected)
                        }
                    >
                        {orgUnitLevels
                            .filter(({ level }) => {
                                return (
                                    level > Number(selectedOrgUnit?.level ?? 1)
                                )
                            })
                            .map(({ id, displayName, level }) => (
                                <SingleSelectOption
                                    key={id}
                                    value={String(level)}
                                    label={displayName}
                                />
                            ))}
                    </SingleSelectField>
                </div>
                <div className={styles.buttonContainer}>
                    <Button
                        small
                        primary
                        onClick={(_, e) => {
                            e.stopPropagation()
                            setOpen(false)
                        }}
                    >
                        Hide
                    </Button>
                </div>
            </div>
        </SelectorBarItem>
    )
}

OrgUnitSelector.propTypes = {
    orgUnitLevels: PropTypes.array,
    rootOrgUnitsInfo: PropTypes.array,
    selectedOrgUnit: PropTypes.object,
    selectedOrgUnitLevel: PropTypes.string,
    setSelectedOrgUnit: PropTypes.func,
    setSelectedOrgUnitLevel: PropTypes.func,
}
