import i18n from '@dhis2/d2-i18n'
import { Menu, MenuItem, SelectorBarItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './GroupSelector.module.css'

export const CORE_GROUP_CODE = 'core'

const MenuSelect = ({ values, selected, onChange }) => {
    return (
        <div className={styles.menuSelect}>
            <Menu>
                {values.map(({ value, label }) => (
                    <MenuItem
                        key={value || label}
                        dataValue={value}
                        label={label}
                        active={selected === value}
                        onClick={() => onChange({ selected: value })}
                    />
                ))}
            </Menu>
        </div>
    )
}

MenuSelect.propTypes = {
    selected: PropTypes.string,
    values: PropTypes.array,
    onChange: PropTypes.func,
}

export const GroupSelector = ({ groups, selectedGroup, setSelectedGroup }) => {
    const groupOptions = [
        { value: CORE_GROUP_CODE, label: i18n.t('[Core]') },
        ...groups.map(({ code, name }) => ({
            value: code,
            label: name,
        })),
    ]
    const [open, setOpen] = useState(false)

    const selectedLabel = groupOptions.find(
        (group) => group.value === selectedGroup
    )?.label
    return (
        <SelectorBarItem
            label={i18n.t('Group')}
            value={selectedLabel}
            open={open}
            setOpen={setOpen}
            noValueMessage={i18n.t('Choose a group')}
        >
            <MenuSelect
                values={groupOptions}
                selected={selectedGroup}
                onChange={({ selected }) => {
                    setSelectedGroup(selected)
                    setOpen(false)
                }}
            />
        </SelectorBarItem>
    )
}

GroupSelector.propTypes = {
    groups: PropTypes.array,
    selectedGroup: PropTypes.string,
    setSelectedGroup: PropTypes.func,
}
