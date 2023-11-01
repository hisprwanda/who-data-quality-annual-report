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

    return (
        <SelectorBarItem
            label={i18n.t('Organisation unit')}
            value={getSelectionLabel({
                selectedOrgUnit,
                selectedOrgUnitLevel,
                orgUnitLevels,
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
                                        Number(selectedOrgUnitLevel) <=
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
    orgUnitLevels: PropTypes.array,
    rootOrgUnitsInfo: PropTypes.array,
    selectedOrgUnit: PropTypes.object,
    selectedOrgUnitLevel: PropTypes.string,
    setSelectedOrgUnit: PropTypes.func,
    setSelectedOrgUnitLevel: PropTypes.func,
}
