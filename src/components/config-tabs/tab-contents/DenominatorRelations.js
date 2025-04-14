import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
    IconEdit16,
    IconAdd16,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    SingleSelect,
    SingleSelectOption,
    ButtonStrip,
    Input,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useCallback } from 'react'
import denominatorTypes from '../../../data/denominatorTypes.json'
import {
    getDenominatorRelations,
    filterDenominatorsByType,
} from '../../../utils/denominatorsMetadataData.js'
import {
    CREATE_DENOMINATOR_RELATION,
    DELETE_DENOMINATOR_RELATION,
    UPDATE_DENOMINATOR_RELATION,
    useConfigurations,
    useConfigurationsDispatch,
} from '../../../utils/index.js'
import { ConfirmationModal } from '../ConfirmationModal.js'

/** Manages the "delete confirmation" modal and datastore mutation */
const DeleteRelationButton = ({ relation }) => {
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setConfirmationModalOpen(true), [])
    const closeModal = useCallback(() => setConfirmationModalOpen(false), [])

    const deleteRelation = useCallback(
        () =>
            dispatch({
                type: DELETE_DENOMINATOR_RELATION,
                payload: { code: relation.code },
            }),
        [dispatch, relation.code]
    )

    return (
        <>
            <Button small destructive onClick={openModal}>
                {i18n.t('Delete')}
            </Button>
            {confirmationModalOpen && (
                <ConfirmationModal
                    title={i18n.t('Delete denominator relation')}
                    text={i18n.t(
                        'Are you sure you want to delete {{relation}}?',
                        {
                            relation: relation.name,
                        }
                    )}
                    action={i18n.t('Delete')}
                    destructive
                    onClose={closeModal}
                    onConfirm={deleteRelation}
                />
            )}
        </>
    )
}
DeleteRelationButton.propTypes = {
    relation: PropTypes.object,
}

export const DenominatorRelations = ({ toggleState }) => {
    const configurations = useConfigurations()
    const relations = configurations.denominatorRelations
    const dispatch = useConfigurationsDispatch()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newDenominatorRelationInfo, setNewDenominatorRelationInfo] =
        useState({
            A: '',
            B: '',
            code: '',
            criteria: 10,
            name: '',
            type: '',
        })
    const [selectedDenominatorA, setSelectedDenominatorA] = useState('')
    const [selectedDenominatorB, setSelectedDenominatorB] = useState('')
    const [filteredDenominators, setFilteredDenominators] = useState([])
    const [updateType, setUpdateType] = useState('')
    const openModal = useCallback(() => setIsModalOpen(true), [])
    const closeModal = useCallback(() => setIsModalOpen(false), [])

    const handleDenominatorTypeChange = (type) => {
        // reset the selected denominators
        setSelectedDenominatorA('')
        setSelectedDenominatorB('')

        // filter denominators by type
        setFilteredDenominators(
            filterDenominatorsByType(configurations.denominators, type)
        )
        setNewDenominatorRelationInfo({
            ...newDenominatorRelationInfo,
            type: type,
        })
    }

    // TODO: will put the edit and add denominators in different components to avoid if conditions below
    const onSaveDenominatorUpdates = useCallback(
        (updateType) => {
            if (updateType === 'create') {
                dispatch({
                    type: CREATE_DENOMINATOR_RELATION,
                    payload: { newDenominatorRelationInfo },
                })
            } else if (updateType === 'update') {
                dispatch({
                    type: UPDATE_DENOMINATOR_RELATION,
                    payload: {
                        code: newDenominatorRelationInfo.code,
                        updatedDenominatorRelation: newDenominatorRelationInfo,
                    },
                })
            }

            closeModal()
        },
        [dispatch, newDenominatorRelationInfo, closeModal]
    )

    // while in editing mode
    const onEditRelation = (relation) => {
        openModal()
        // get the filtered relations first and then only set A and B if A and B are in those filtered relations
        const filteredDenominators = filterDenominatorsByType(
            configurations.denominators,
            relation.type
        )
        setFilteredDenominators(filteredDenominators)
        setNewDenominatorRelationInfo(relation)
        setSelectedDenominatorA(
            filteredDenominators.find(
                (denominator) => denominator.code === relation.A
            )?.code
        )
        setSelectedDenominatorB(
            filteredDenominators.find(
                (denominator) => denominator.code === relation.B
            )?.code
        )
    }

    // while in adding mode
    const onAddRelation = () => {
        openModal()

        // reset the newDenominatorRelationInfo
        setNewDenominatorRelationInfo({
            A: '',
            B: '',
            code: '',
            criteria: 10,
            name: '',
            type: '',
        })
        setSelectedDenominatorA('')
        setSelectedDenominatorB('')
        setFilteredDenominators([])
        setUpdateType('create')
    }

    return (
        <div
            className={
                toggleState === 6 ? 'content  active-content' : 'content'
            }
        >
            <p>
                {i18n.t(
                    'Please map alternative denominators for comparison, for example denominiators from the National Bureau of Statistics with denominators used by health programmes.'
                )}
            </p>
            <hr />
            <div className="denominatorRelationsContainer">
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>{i18n.t('Name ')}</TableCellHead>
                            <TableCellHead>
                                {i18n.t('Denominator A ')}
                            </TableCellHead>
                            <TableCellHead>
                                {i18n.t('Denominator B ')}
                            </TableCellHead>
                            <TableCellHead>{i18n.t('Criteria')}</TableCellHead>
                            <TableCellHead>{i18n.t('Actions')}</TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {relations ? (
                            relations.map((relation, key) => (
                                <TableRow key={key}>
                                    <TableCell>{relation.name}</TableCell>
                                    <TableCell>
                                        {getDenominatorRelations(
                                            configurations.denominators,
                                            relation.A
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {getDenominatorRelations(
                                            configurations.denominators,
                                            relation.B
                                        )}
                                    </TableCell>
                                    <TableCell>{relation.criteria}%</TableCell>
                                    <TableCell>
                                        <ButtonStrip>
                                            <Button
                                                name={i18n.t('Primary button')}
                                                small
                                                onClick={() => {
                                                    onEditRelation(relation)
                                                    setUpdateType('update')
                                                }}
                                                basic
                                                button
                                                value="default"
                                                icon={<IconEdit16 />}
                                            >
                                                {i18n.t(' Edit')}
                                            </Button>
                                            <DeleteRelationButton
                                                relation={relation}
                                            />
                                        </ButtonStrip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell></TableCell>
                            </TableRow>
                        )}

                        {/* Add button */}

                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                                <Button
                                    name={i18n.t('Primary button')}
                                    onClick={() => {
                                        onAddRelation()
                                    }}
                                    primary
                                    button
                                    value="default"
                                    icon={<IconAdd16 />}
                                >
                                    {i18n.t('Add Relations')}
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* TODO: Implement modal reuse as Kai did in Numerator relations*/}
                {isModalOpen && (
                    <Modal onClose={closeModal} position="middle">
                        <ModalTitle>
                            {i18n.t('Denominator relations mapping')}
                        </ModalTitle>
                        <ModalContent>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <p>{i18n.t('Name')}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                label={i18n.t('Name')}
                                                name="name"
                                                value={
                                                    newDenominatorRelationInfo.name
                                                }
                                                onChange={(e) =>
                                                    setNewDenominatorRelationInfo(
                                                        {
                                                            ...newDenominatorRelationInfo,
                                                            name: e.value,
                                                        }
                                                    )
                                                }
                                                requiredrequired
                                                className="input"
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <p>{i18n.t('Type')}</p>
                                        </TableCell>
                                        <TableCell>
                                            <SingleSelect
                                                className="select"
                                                onChange={(e) =>
                                                    handleDenominatorTypeChange(
                                                        e.selected
                                                    )
                                                }
                                                placeholder={i18n.t(
                                                    'Select relation type'
                                                )}
                                                selected={
                                                    newDenominatorRelationInfo.type
                                                }
                                            >
                                                {denominatorTypes
                                                    ? denominatorTypes.map(
                                                          (type, key) => (
                                                              <SingleSelectOption
                                                                  label={
                                                                      type.label
                                                                  }
                                                                  value={
                                                                      type.value
                                                                  }
                                                                  key={key}
                                                              />
                                                          )
                                                      )
                                                    : ''}
                                            </SingleSelect>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <p>{i18n.t('Denominator A')}</p>
                                        </TableCell>
                                        <TableCell>
                                            <SingleSelect
                                                className="select"
                                                onChange={(e) => {
                                                    setNewDenominatorRelationInfo(
                                                        {
                                                            ...newDenominatorRelationInfo,
                                                            A: e.selected,
                                                        }
                                                    )
                                                    setSelectedDenominatorA(
                                                        e.selected
                                                    )
                                                }}
                                                placeholder={i18n.t(
                                                    'Select denominator A'
                                                )}
                                                selected={selectedDenominatorA}
                                            >
                                                {filteredDenominators
                                                    ? filteredDenominators.map(
                                                          (
                                                              denominator,
                                                              key
                                                          ) => (
                                                              <SingleSelectOption
                                                                  label={
                                                                      denominator.name ??
                                                                      denominator.code
                                                                  }
                                                                  value={
                                                                      denominator.code
                                                                  }
                                                                  key={key}
                                                              />
                                                          )
                                                      )
                                                    : ''}
                                            </SingleSelect>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <p>{i18n.t('Denominator B')}</p>
                                        </TableCell>
                                        <TableCell>
                                            <SingleSelect
                                                className="select"
                                                onChange={(e) => {
                                                    setNewDenominatorRelationInfo(
                                                        {
                                                            ...newDenominatorRelationInfo,
                                                            B: e.selected,
                                                        }
                                                    )
                                                    setSelectedDenominatorB(
                                                        e.selected
                                                    )
                                                }}
                                                placeholder={i18n.t(
                                                    'Select denominator B'
                                                )}
                                                selected={selectedDenominatorB}
                                            >
                                                {filteredDenominators
                                                    ? filteredDenominators.map(
                                                          (
                                                              denominator,
                                                              key
                                                          ) => (
                                                              <SingleSelectOption
                                                                  label={
                                                                      denominator.name ??
                                                                      denominator.code
                                                                  }
                                                                  value={
                                                                      denominator.code
                                                                  }
                                                                  key={key}
                                                              />
                                                          )
                                                      )
                                                    : ''}
                                            </SingleSelect>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <p>{i18n.t('Threshold (+/-) %')}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                label={i18n.t('Name')}
                                                name="name"
                                                required
                                                className="input"
                                                type="number"
                                                value={
                                                    newDenominatorRelationInfo.criteria
                                                }
                                                onChange={(e) =>
                                                    setNewDenominatorRelationInfo(
                                                        {
                                                            ...newDenominatorRelationInfo,
                                                            criteria: e.value,
                                                        }
                                                    )
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <p>
                                {i18n.t(
                                    'Threshold denotes the % difference from national figure that is accepted for a sub-national unit.'
                                )}
                            </p>
                        </ModalContent>
                        <ModalActions>
                            <ButtonStrip end>
                                <Button secondary onClick={closeModal}>
                                    {i18n.t(' Cancel')}
                                </Button>
                                <Button
                                    primary
                                    onClick={() =>
                                        onSaveDenominatorUpdates(
                                            updateType,
                                            newDenominatorRelationInfo
                                        )
                                    }
                                >
                                    {updateType === 'create'
                                        ? 'Create'
                                        : 'Update'}{' '}
                                </Button>
                            </ButtonStrip>
                        </ModalActions>
                    </Modal>
                )}
            </div>
        </div>
    )
}

DenominatorRelations.propTypes = {
    toggleState: PropTypes.number,
}
