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
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { getNumeratorsInGroup } from '../../../utils/numeratorsMetadataData.js'
import { updateConfigurations } from '../../../utils/updateConfigurations.js'

// TODO: move different queries to their own file when they become many
const updateConfigurationsMutation = {
    resource: 'dataStore/who-dqa/configurations',
    type: 'update',
    data: ({ configurations }) => ({
        ...configurations,
        lastUpdated: new Date().toJSON(),
    }),
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

            const updatedConfigurations = updateConfigurations(
                configurations,
                'groups',
                'update',
                groupUpdateInfo
            )
            await mutate({ configurations: updatedConfigurations })
            const message = 'Numerator added successfully to the group'
            show({ message, status: 'success' })
            setSelectedNumerator(null)
        }
    }

    const onRemoveNumerator = async (group, numerator) => {
        const groupUpdateInfo = {
            groupCode: group,
            numeratorCode: numerator,
        }
        const updatedConfigurations = updateConfigurations(
            configurations,
            'groups',
            'delete',
            groupUpdateInfo
        )
        await mutate({ configurations: updatedConfigurations })
        const message = 'Numerator deleted successfully from the group'
        show({ message, status: 'success' })
    }

    useEffect(() => {
        setGroups(configurations.groups)
        setNumerators(configurations.numerators)
    }, [])

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
            <div className="groupsContainer">
                {groups
                    ? groups.map((group, key) => (
                          <div key={key} className="group">
                              <h2>{group.name}</h2>
                              <Table>
                                  <TableHead>
                                      <TableRowHead>
                                          <TableCellHead>Data</TableCellHead>
                                          <TableCellHead>Actions</TableCellHead>
                                      </TableRowHead>
                                  </TableHead>
                                  <TableBody>
                                      {getNumeratorsInGroup(
                                          numerators,
                                          group,
                                          onRemoveNumerator
                                      )}

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
                                              <Button
                                                  name="Primary button"
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
                                          </TableCell>
                                      </TableRow>
                                  </TableBody>
                              </Table>
                          </div>
                      ))
                    : ''}
            </div>
        </div>
    )
}

NumeratorGroups.propTypes = {
    configurations: PropTypes.object,
    toggleState: PropTypes.number,
}
