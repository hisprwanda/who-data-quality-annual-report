import { useDataMutation, useAlert } from '@dhis2/app-runtime'
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
    IconAdd16,
    SingleSelect,
    SingleSelectOption,
    ButtonStrip,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { getNumeratorsInGroup } from '../../../utils/numeratorsMetadataData.js'
import { updateConfigurations } from '../../../utils/updateConfigurations.js'
// import ConfigTabs.module.css
import styles from '../ConfigTabs.module.css'
import { NumeratorGroupsTableItem } from './NumeratorGroupsTableItem.js'

// TODO: move different queries to their own file when they become many
const updateConfigurationsMutation = {
    resource: 'dataStore/who-dqa/configurations',
    type: 'update',
    data: ({ configurations }) => ({
        ...configurations,
        lastUpdated: new Date().toJSON(),
    }),
}

const AddGroupButton = () => {
    return (
        <div className="group">
            <h2>Add a new group</h2>
            <ButtonStrip end >
                <Button
                    name="Primary button"
                    primary
                    button
                    value="default"
                    icon={<IconAdd16 />}
                >
                    {' '}
                    Create a New Group
                </Button>
            </ButtonStrip>
        </div>
    )
}


export const NumeratorGroups = ({ toggleState, configurations }) => {
    const [groups, setGroups] = useState(null)
    const [numerators, setNumerators] = useState(null)
    const [selectedNumerator, setSelectedNumerator] = useState('NA')

    const [mutate] = useDataMutation(updateConfigurationsMutation)

    const handleNumeratorSelection = (selected) => {
        setSelectedNumerator(selected)
    }

    // A dynamic alert to communicate success or failure
    // TODO: put this one in a reusable function
    const { show } = useAlert(
        ({ message }) => message,
        ({ status }) => {
            if (status === 'success') {
                return { success: true }
            } else if (status === 'error') {
                return { critical: true }
            } else {
                return {}
            }
        }
    )

    const handleAddNumerator = async (numerator, group) => {
        if (group.members.includes(numerator)) {
            const message = 'This numerator is already a member of this group'
            show({ message, status: 'error' })
            setSelectedNumerator(null)
        } else {
            const groupUpdateInfo = {
                groupCode: group.code,
                numeratorCode: numerator,
            }

            const updatedConfigurations = updateConfigurations({
                configurations,
                configurationType: 'groups',
                updateType: 'update',
                configsUpdateInfo: groupUpdateInfo,
            })
            await mutate({ configurations: updatedConfigurations })
            const message = 'Numerator added successfully to the group'
            show({ message, status: 'success' })
            setSelectedNumerator(null)
        }
    }

    const onDeleteNumerator = async (group, numerator) => {
        const groupUpdateInfo = {
            groupCode: group,
            numeratorCode: numerator,
        }
        const updatedConfigurations = updateConfigurations({
            configurations,
            configurationType: 'groups',
            updateType: 'delete',
            configsUpdateInfo: groupUpdateInfo,
        })
        await mutate({ configurations: updatedConfigurations })
        const message = 'Numerator deleted successfully from the group'
        show({ message, status: 'success' })
    }

    useEffect(() => {
        setGroups(configurations.groups)
        setNumerators(configurations.numerators)
    }, [configurations])

    return (
        <div
            className={
                toggleState === 2 ? 'content  active-content' : 'content'
            }
        >
            <p>
                Add and remove numerators to/from groups, and to add new groups.
            </p>
            <hr />
            <div className={styles.groupsContainer}>
                {groups
                    ? groups.map((group, key) => (
                          <div key={key} className="group">
                              <h2>{group.name}</h2>
                              <Table>
                                  <TableHead>
                                      <TableRowHead>
                                        <TableCellHead>Data</TableCellHead>
                                        <TableCellHead className={styles.numeratoryGroupActions}>Actions </TableCellHead>
                                      </TableRowHead>
                                  </TableHead>
                                  <TableBody>
                                      {/* {getNumeratorsInGroup(
                                          numerators,
                                          group,
                                          onDeleteNumerator
                                      )} */}
                                      
                                      <NumeratorGroupsTableItem 
                                        numerators={numerators}
                                        group={group}
                                         />


                                      <TableRow>
                                          <TableCell>
                                              <SingleSelect
                                                  className="select"
                                                  onChange={(selected) =>
                                                      handleNumeratorSelection(
                                                          selected.selected
                                                      )
                                                  }
                                                  // placeholder="Select Numerator"
                                                  selected={selectedNumerator}
                                              >
                                                  <SingleSelectOption
                                                      label="Select Numerator"
                                                      value="NA"
                                                  />
                                                  {numerators.map(
                                                      (numerator, key) => (
                                                          <SingleSelectOption
                                                              label={
                                                                  numerator.name
                                                              }
                                                              value={
                                                                  numerator.code
                                                              }
                                                              key={key}
                                                          />
                                                      )
                                                  )}
                                              </SingleSelect>
                                          </TableCell>
                                          <TableCell>
                                            <ButtonStrip end >
                                                <Button
                                                    name="Primary button"
                                                    small
                                                    disabled={
                                                        selectedNumerator != 'NA'
                                                            ? false
                                                            : true
                                                    }
                                                    onClick={() =>
                                                        handleAddNumerator(
                                                            selectedNumerator,
                                                            group
                                                        )
                                                    }
                                                    primary
                                                    button
                                                    value="default"
                                                    icon={<IconAdd16 />}
                                                >
                                                    {' '}
                                                    Add Numerators
                                                </Button>
                                                <Button small name="Primary button" destructive button value="default"
                                                onClick={() =>
                                                    console.log('delete group', group.code)
                                                }

                                                >
                                                    {' '}
                                                    Delete Group
                                                </Button>
                                            </ButtonStrip>
                                          </TableCell>
                                      </TableRow>
                                  </TableBody>
                              </Table>
                          </div>
                      ))
                    : 
                    <div className="group">
                        <h2>No groups found</h2>
                    </div>
                    }
                    <AddGroupButton />
            </div>
        </div>
    )
}

NumeratorGroups.propTypes = {
    configurations: PropTypes.object,
    toggleState: PropTypes.string,
}
