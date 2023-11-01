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

    const numeratorsWithDataIds = React.useMemo(
        () =>
            configurations.numerators.filter(
                (numerator) => numerator.dataID != null
            ),
        [configurations.numerators]
    )

    return (
        <Modal onClose={onClose} position="middle">
            <ModalTitle>Numerator relation</ModalTitle>
            <ModalContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>
                                <Input
                                    name="name"
                                    required
                                    value={newNumeratorRelationInfo.name}
                                    onChange={(e) =>
                                        setNewNumeratorRelationInfo({
                                            ...newNumeratorRelationInfo,
                                            name: e.value,
                                        })
                                    }
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>
                                <SingleSelect
                                    name="type"
                                    placeholder="Select relation type"
                                    selected={newNumeratorRelationInfo.type}
                                    onChange={(e) =>
                                        setNewNumeratorRelationInfo({
                                            ...newNumeratorRelationInfo,
                                            type: e.selected,
                                        })
                                    }
                                >
                                    {relationTypes.map((type, key) => (
                                        <SingleSelectOption
                                            label={type.displayName}
                                            value={type.code}
                                            key={key}
                                        />
                                    ))}
                                </SingleSelect>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Numerator A</TableCell>
                            <TableCell>
                                <SingleSelect
                                    name="A"
                                    placeholder="Select numerator A"
                                    selected={newNumeratorRelationInfo.A}
                                    onChange={(e) =>
                                        setNewNumeratorRelationInfo({
                                            ...newNumeratorRelationInfo,
                                            A: e.selected,
                                        })
                                    }
                                >
                                    {numeratorsWithDataIds.map(
                                        (numerator, key) => (
                                            <SingleSelectOption
                                                label={numerator.name}
                                                value={numerator.code}
                                                key={key}
                                            />
                                        )
                                    )}
                                </SingleSelect>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Numerator B</TableCell>
                            <TableCell>
                                <SingleSelect
                                    name="B"
                                    placeholder="Select numerator B"
                                    selected={newNumeratorRelationInfo.B}
                                    onChange={(e) =>
                                        setNewNumeratorRelationInfo({
                                            ...newNumeratorRelationInfo,
                                            B: e.selected,
                                        })
                                    }
                                >
                                    {numeratorsWithDataIds.map(
                                        (numerator, key) => (
                                            <SingleSelectOption
                                                label={numerator.name}
                                                value={numerator.code}
                                                key={key}
                                            />
                                        )
                                    )}
                                </SingleSelect>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Threshold (+/-) %</TableCell>
                            <TableCell>
                                <Input
                                    name="criteria"
                                    type="number"
                                    required
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
                        Save
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
