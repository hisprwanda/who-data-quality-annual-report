import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Field,
    OrganisationUnitTree,
    Radio,
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
    disaggregationType,
}) => {
    let label = ''
    label += selectedOrgUnit.displayName ?? ''
    const hasDisaggregation =
        disaggregationType === 'level'
            ? selectedOrgUnitLevel
            : selectedOrgUnitGroup
    label += label && hasDisaggregation ? '; ' : ''
    if (disaggregationType === 'level' && selectedOrgUnitLevel) {
        label += selectedOrgUnitLevel.displayName
    } else if (disaggregationType === 'group' && selectedOrgUnitGroup) {
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
    setSelectedOrgUnitLevel,
    selectedOrgUnitGroup,
    setSelectedOrgUnitGroup,
    disaggregationType,
    setDisaggregationType,
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
                disaggregationType,
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
                    <Field label={i18n.t('Disaggregate by')}>
                        <Radio
                            checked={disaggregationType === 'level'}
                            label={i18n.t('Level')}
                            value="level"
                            onChange={() => setDisaggregationType('level')}
                        />
                        <Radio
                            checked={disaggregationType === 'group'}
                            label={i18n.t('Group')}
                            value="group"
                            onChange={() => setDisaggregationType('group')}
                        />
                    </Field>
                    {disaggregationType === 'level' ? (
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
                        >
                            {orgUnitLevels
                                .filter(({ level }) => {
                                    return (
                                        level >
                                        Number(selectedOrgUnit?.level ?? 1)
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
                    ) : (
                        <SingleSelectField
                            label={i18n.t('Choose an organisation unit group')}
                            selected={selectedOrgUnitGroup?.id ?? ''}
                            onChange={({ selected }) => {
                                const newSelected = orgUnitGroups?.find(
                                    (group) => group.id === selected
                                )
                                setSelectedOrgUnitGroup(newSelected)
                            }}
                            filterable
                        >
                            {orgUnitGroups?.map(({ id, displayName }) => (
                                <SingleSelectOption
                                    key={id}
                                    value={id}
                                    label={displayName}
                                />
                            ))}
                        </SingleSelectField>
                    )}
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
    disaggregationType: PropTypes.string,
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
    setDisaggregationType: PropTypes.func,
    setSelectedOrgUnit: PropTypes.func,
    setSelectedOrgUnitGroup: PropTypes.func,
    setSelectedOrgUnitLevel: PropTypes.func,
}
