import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Field,
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
    selectedOrgUnitGroup,
}) => {
    let label = ''
    label += selectedOrgUnit.displayName ?? ''
    label += label && selectedOrgUnitLevel ? '; ' : ''
    if (selectedOrgUnitLevel) {
        label += selectedOrgUnitLevel.displayName
    }
    label += label && selectedOrgUnitGroup ? '; ' : ''
    if (selectedOrgUnitGroup) {
        label += selectedOrgUnitGroup.displayName
    }

    return label
}

export const OrgUnitSelector = ({
    orgUnitLevels,
    orgUnitGroups,
    rootOrgUnitsInfo,
    selectedOrgUnit,
    setSelectedOrgUnit,
    selectedOrgUnitLevel,
    selectedOrgUnitGroup,
    setSelectedOrgUnitLevel,
    setSelectedOrgUnitGroup,
}) => {
    const [open, setOpen] = useState(false)
    const rootOrgUnits = rootOrgUnitsInfo.map(({ id }) => id)

    return (
        <SelectorBarItem
            label={i18n.t('Organisation unit')}
            value={getSelectionLabel({
                selectedOrgUnit,
                selectedOrgUnitLevel,
                selectedOrgUnitGroup,
                orgUnitLevels,
                orgUnitGroups,
            })}
            open={open}
            setOpen={setOpen}
            noValueMessage={i18n.t('Choose an organisation unit')}
        >
            <div className={styles.menuContainer}>
                <div className={styles.inputsContainer}>
                    <Field label={i18n.t('Choose an organisation unit')}>
                        <div className={styles.orgUnitTreeScrollContainer}>
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
                                        Number(selectedOrgUnitLevel.level) <=
                                            computedLevel
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
                                    selectedOrgUnit?.path
                                        ? [selectedOrgUnit?.path]
                                        : []
                                }
                            />
                        </div>
                    </Field>
                    <SingleSelectField
                        label={i18n.t('Choose an organisation unit level')}
                        // format `selected` as just the ID so it's a string
                        selected={selectedOrgUnitLevel?.id ?? ''}
                        // parse the selected ID to save the full object in state
                        onChange={({ selected }) => {
                            const newSelected = orgUnitLevels.find(
                                (level) => level.id === selected
                            )
                            setSelectedOrgUnitLevel(newSelected)
                        }}
                        disabled={!!selectedOrgUnitGroup?.id}
                        clearable
                    >
                        {orgUnitLevels
                            .filter(({ level }) => {
                                return (
                                    level > Number(selectedOrgUnit?.level ?? 1)
                                )
                            })
                            .map(({ id, displayName }) => (
                                <SingleSelectOption
                                    key={id}
                                    value={id}
                                    label={displayName}
                                />
                            ))}
                    </SingleSelectField>
                    <SingleSelectField
                        label={i18n.t('Choose an organisation unit group')}
                        // format `selected` as just the ID so it's a string
                        selected={selectedOrgUnitGroup?.id ?? ''}
                        // parse the selected ID to save the full object in state
                        onChange={({ selected }) => {
                            const newSelected = orgUnitGroups.find(
                                (group) => group.id === selected
                            )
                            setSelectedOrgUnitGroup(newSelected)
                        }}
                        disabled={!!selectedOrgUnitLevel?.id}
                        clearable
                    >
                        {orgUnitGroups.map(({ id, displayName }) => (
                            <SingleSelectOption
                                key={id}
                                value={id}
                                label={displayName}
                            />
                        ))}
                    </SingleSelectField>
                </div>
                <Button
                    secondary
                    onClick={(_, e) => {
                        e.stopPropagation()
                        setOpen(false)
                    }}
                >
                    {i18n.t('Hide menu')}
                </Button>
            </div>
        </SelectorBarItem>
    )
}

OrgUnitSelector.propTypes = {
    orgUnitGroups: PropTypes.array,
    orgUnitLevels: PropTypes.array,
    rootOrgUnitsInfo: PropTypes.array,
    selectedOrgUnit: PropTypes.object,
    selectedOrgUnitGroup: PropTypes.shape({
        displayName: PropTypes.string,
        id: PropTypes.string,
    }),
    selectedOrgUnitLevel: PropTypes.shape({
        displayName: PropTypes.string,
        id: PropTypes.string,
        level: PropTypes.number,
    }),
    setSelectedOrgUnit: PropTypes.func,
    setSelectedOrgUnitGroup: PropTypes.func,
    setSelectedOrgUnitLevel: PropTypes.func,
}
