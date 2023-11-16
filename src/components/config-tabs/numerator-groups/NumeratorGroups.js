import { useAlert } from '@dhis2/app-runtime'
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
import React, { useState, useCallback } from 'react'
import {
    CREATE_NUMERATOR_GROUP,
    DELETE_NUMERATOR_GROUP,
    UPDATE_NUMERATOR_GROUP,
    useConfigurations,
    useConfigurationsDispatch,
} from '../../../utils/index.js'
import styles from '../ConfigTabs.module.css'
import { ConfirmationModal } from '../numerator-relations/ConfirmationModal.js'
import { AddNumeratorGroupModel } from './AddNumeratorGroupModel.js'
import { NumeratorGroupsTableItem } from './NumeratorGroupsTableItem.js'

const AddGroupButton = () => {
    const [addNewModalOpen, setAddNewModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setAddNewModalOpen(true), [])
    const closeModal = useCallback(() => setAddNewModalOpen(false), [])

    const addNewNumeratorGroup = useCallback(
        (newGroup) => {
            dispatch({
                type: CREATE_NUMERATOR_GROUP,
                payload: { newGroup },
            })
        },
        [dispatch]
    )

    return (
        <div className="group">
            <br />
            <Button
                name="Primary button"
                primary
                icon={<IconAdd16 />}
                onClick={openModal}
            >
                Create a New Group
            </Button>
            {addNewModalOpen && (
                <AddNumeratorGroupModel
                    onSave={addNewNumeratorGroup}
                    onClose={closeModal}
                />
            )}
        </div>
    )
}

const DeleteGroupButton = ({ group }) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setConfirmationModalOpen(true), [])
    const closeModal = useCallback(() => setConfirmationModalOpen(false), [])

    const deleteNumeratorGroup = useCallback(
        (group) => {
            dispatch({
                type: DELETE_NUMERATOR_GROUP,
                payload: { code: group.code },
            })
        },
        [dispatch]
    )

    return (
        <>
            <Button small destructive onClick={openModal}>
                Delete Group
            </Button>

            {confirmationModalOpen && (
                <ConfirmationModal
                    title="Delete numerator group"
                    text={`Are you sure you want to delete ${group.name}?`}
                    onClose={closeModal}
                    onConfirm={() => deleteNumeratorGroup(group)}
                    action="Delete"
                    destructive
                />
            )}
        </>
    )
}

DeleteGroupButton.propTypes = {
    group: PropTypes.object,
}

export const NumeratorGroups = () => {
    const configurations = useConfigurations()
    const groups = configurations.groups
    const numerators = configurations.numerators
    const dispatch = useConfigurationsDispatch()

    const [selectedNumerator, setSelectedNumerator] = useState('NA')

    const handleNumeratorSelection = (selected) => {
        setSelectedNumerator(selected)
    }

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

    const handleAddNumerator = useCallback(
        (numerator, group) => {
            if (group.members.includes(numerator)) {
                const message =
                    'This numerator is already a member of this group'
                show({ message, status: 'error' })
                setSelectedNumerator(null)
            } else {
                const newGroup = {
                    ...group,
                    members: [...group.members, numerator],
                }
                dispatch({
                    type: UPDATE_NUMERATOR_GROUP,
                    payload: { updatedGroup: newGroup, code: group.code },
                })

                setSelectedNumerator(null)
            }
        },
        [dispatch, show]
    )

    return (
        <div>
            <p>
                Add and remove numerators to/from groups, and to add new groups.
            </p>
            <hr />
            <div className={styles.groupsContainer}>
                {groups ? (
                    groups.map((group, key) => (
                        <div key={key} className="group">
                            <h2>{group.name}</h2>
                            <Table>
                                <TableHead>
                                    <TableRowHead>
                                        <TableCellHead>Data</TableCellHead>
                                        <TableCellHead
                                            className={
                                                styles.numeratoryGroupActions
                                            }
                                        >
                                            Actions{' '}
                                        </TableCellHead>
                                    </TableRowHead>
                                </TableHead>
                                <TableBody>
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
                                            <ButtonStrip end>
                                                <Button
                                                    name="Primary button"
                                                    small
                                                    disabled={
                                                        selectedNumerator !=
                                                        'NA'
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
                                                <DeleteGroupButton
                                                    group={group}
                                                />
                                            </ButtonStrip>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    ))
                ) : (
                    <div className="group">
                        <h2>No groups found</h2>
                    </div>
                )}
                <ButtonStrip end>
                    <AddGroupButton />
                </ButtonStrip>
            </div>
        </div>
    )
}
