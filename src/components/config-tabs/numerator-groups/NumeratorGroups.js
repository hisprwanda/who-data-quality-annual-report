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
    ButtonStrip,
    TableFoot,
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
import { ConfirmationModal } from '../ConfirmationModal.js'
import { EditGroupModal } from './EditGroupModal.js'
import styles from './NumeratorGroups.module.css'
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
        <div className={styles.addNewGroupBtn}>
            <Button
                name="Primary button"
                primary
                icon={<IconAdd16 />}
                onClick={openModal}
            >
                Create a New Group
            </Button>
            {addNewModalOpen && (
                <EditGroupModal
                    onSave={addNewNumeratorGroup}
                    onClose={closeModal}
                />
            )}
        </div>
    )
}

const EditGroupButton = ({ group }) => {
    const [editModalOpen, setEditModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setEditModalOpen(true), [])
    const closeModal = useCallback(() => setEditModalOpen(false), [])

    const updateGroup = useCallback(
        (newGroupValues) => {
            dispatch({
                type: UPDATE_NUMERATOR_GROUP,
                payload: {
                    code: group.code,
                    updatedGroup: newGroupValues,
                },
            })
        },
        [dispatch, group.code]
    )

    return (
        <>
            <Button small onClick={openModal}>
                Edit Group
            </Button>
            {editModalOpen && (
                <EditGroupModal
                    groupToEdit={group}
                    onSave={updateGroup}
                    onClose={closeModal}
                />
            )}
        </>
    )
}

EditGroupButton.propTypes = {
    group: PropTypes.object,
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

    // check if there are any groups
    if (!groups || groups.length === 0) {
        return (
            <Table>
                <TableRow>
                    <TableCell>No groups found.</TableCell>
                </TableRow>

                <TableFoot>
                    <TableRow>
                        <TableCell>
                            <ButtonStrip end>
                                <AddGroupButton />
                            </ButtonStrip>
                        </TableCell>
                    </TableRow>
                </TableFoot>
            </Table>
        )
    }

    return (
        <div>
            <p>
                Add and remove numerators to/from groups, and to add new groups.
            </p>
            <hr />
            <div className={styles.groupsContainer}>
                {groups.map((group, key) => (
                    <div key={key} className="group">
                        <span className={styles.groupHeader}>{group.name}</span>
                        <Table>
                            <TableHead>
                                <TableRowHead>
                                    <TableCellHead>Data</TableCellHead>
                                    <TableCellHead
                                        className={
                                            styles.numeratoryGroupActions
                                        }
                                    ></TableCellHead>
                                </TableRowHead>
                            </TableHead>
                            <TableBody>
                                <NumeratorGroupsTableItem
                                    numerators={numerators}
                                    group={group}
                                />
                            </TableBody>
                            <TableFoot>
                                <TableRow>
                                    <TableCell colSpan="3">
                                        <ButtonStrip end>
                                            <EditGroupButton group={group} />
                                            <DeleteGroupButton group={group} />
                                        </ButtonStrip>
                                    </TableCell>
                                </TableRow>
                            </TableFoot>
                        </Table>
                    </div>
                ))}
                <ButtonStrip end>
                    <AddGroupButton />
                </ButtonStrip>
            </div>
        </div>
    )
}
