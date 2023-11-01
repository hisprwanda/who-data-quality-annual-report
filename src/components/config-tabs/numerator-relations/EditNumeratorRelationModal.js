import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableRow,
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
import React, { useState } from 'react'
import relationTypes from '../../../data/relationTypes.json'

export function EditNumeratorRelationModal({
    previousRelation,
    configurations,
    onClose,
}) {
    const [newNumeratorRelationInfo, setNewNumeratorRelationInfo] =
        useState(previousRelation)
    // A, B, code, criteria, name, type

    const numeratorsWithDataIds = configurations.numerators.filter(
        (numerator) => numerator.dataID != null
    )

    return (
        <Modal onClose={onClose} position="middle">
            <ModalTitle>Numerator relation</ModalTitle>
            <ModalContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <p>Name</p>
                            </TableCell>
                            <TableCell>
                                <Input
                                    label="Name"
                                    name="name"
                                    value={newNumeratorRelationInfo.name}
                                    onChange={(e) =>
                                        setNewNumeratorRelationInfo({
                                            ...newNumeratorRelationInfo,
                                            name: e.value,
                                        })
                                    }
                                    requiredrequired
                                    className="input"
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <p>Type</p>
                            </TableCell>
                            <TableCell>
                                <SingleSelect
                                    className="select"
                                    onChange={(e) =>
                                        setNewNumeratorRelationInfo({
                                            ...newNumeratorRelationInfo,
                                            type: e.selected,
                                        })
                                    }
                                    placeholder="Select relation type"
                                    selected={newNumeratorRelationInfo.type}
                                >
                                    {relationTypes
                                        ? relationTypes.map((type, key) => (
                                              <SingleSelectOption
                                                  label={type.displayName}
                                                  value={type.code}
                                                  key={key}
                                              />
                                          ))
                                        : ''}
                                </SingleSelect>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <p>Numerator A</p>
                            </TableCell>
                            <TableCell>
                                <SingleSelect
                                    className="select"
                                    onChange={(e) =>
                                        setNewNumeratorRelationInfo({
                                            ...newNumeratorRelationInfo,
                                            A: e.selected,
                                        })
                                    }
                                    placeholder="Select numerator A"
                                    selected={newNumeratorRelationInfo.A}
                                >
                                    {numeratorsWithDataIds
                                        ? numeratorsWithDataIds.map(
                                              (numerator, key) => (
                                                  <SingleSelectOption
                                                      label={numerator.name}
                                                      value={numerator.code}
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
                                <p>Numerator B</p>
                            </TableCell>
                            <TableCell>
                                <SingleSelect
                                    className="select"
                                    onChange={(e) =>
                                        setNewNumeratorRelationInfo({
                                            ...newNumeratorRelationInfo,
                                            B: e.selected,
                                        })
                                    }
                                    placeholder="Select numerator B"
                                    selected={newNumeratorRelationInfo.B}
                                >
                                    {numeratorsWithDataIds
                                        ? numeratorsWithDataIds.map(
                                              (numerator, key) => (
                                                  <SingleSelectOption
                                                      label={numerator.name}
                                                      value={numerator.code}
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
                                <p>Threshold (+/-) %</p>
                            </TableCell>
                            <TableCell>
                                <Input
                                    label="Name"
                                    name="name"
                                    required
                                    className="input"
                                    type="number"
                                    value={newNumeratorRelationInfo.criteria}
                                    onChange={(e) =>
                                        setNewNumeratorRelationInfo({
                                            ...newNumeratorRelationInfo,
                                            criteria: e.value,
                                        })
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <p>
                    Threshold denotes the % difference from national figure that
                    is accepted for a sub-national unit.
                </p>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        primary
                        onClick={() => {
                            alert('todo: add/update numerator relation')
                        }}
                    >
                        Create
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
EditNumeratorRelationModal.propTypes = {
    configurations: PropTypes.object,
    previousRelation: PropTypes.object,
    onClose: PropTypes.func,
}
