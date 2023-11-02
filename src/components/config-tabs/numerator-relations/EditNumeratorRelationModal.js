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

const DEFAULT_FORM_VALUES = {
    name: '',
    type: undefined,
    A: undefined,
    B: undefined,
    criteria: 0,
}

/**
 * If `numeratorRelationToEdit`, is provided, this will behave in "update" mode:
 * - the fields will be prefilled with the values of that relation
 * - the data store mutation will be an "update" action on that relation, (todo)
 * - some text in the modal will refer to editing/updating
 * Otherwise, this will behave in "add new" mode:
 * - the fields will be empty (todo)
 * - the data store mutation will create a new numeratorRelation object (todo)
 * - text in the modal will refer to creating/adding new (todo)
 */
export function EditNumeratorRelationModal({
    numeratorRelationToEdit,
    configurations,
    onClose,
}) {
    // A, B, code, criteria, name, type
    const [formState, setFormState] = useState(
        numeratorRelationToEdit || DEFAULT_FORM_VALUES
    )

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
                                    value={formState.name}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
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
                                    selected={formState.type}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            type: e.selected,
                                        })
                                    }
                                >
                                    {relationTypes.map((type) => (
                                        <SingleSelectOption
                                            label={type.displayName}
                                            value={type.code}
                                            key={type.code}
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
                                    selected={formState.A}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            A: e.selected,
                                        })
                                    }
                                >
                                    {numeratorsWithDataIds.map((numerator) => (
                                        <SingleSelectOption
                                            label={numerator.name}
                                            value={numerator.code}
                                            key={numerator.code}
                                        />
                                    ))}
                                </SingleSelect>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Numerator B</TableCell>
                            <TableCell>
                                <SingleSelect
                                    name="B"
                                    placeholder="Select numerator B"
                                    selected={formState.B}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            B: e.selected,
                                        })
                                    }
                                >
                                    {numeratorsWithDataIds.map((numerator) => (
                                        <SingleSelectOption
                                            label={numerator.name}
                                            value={numerator.code}
                                            key={numerator.code}
                                        />
                                    ))}
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
                                    value={String(formState.criteria)}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            criteria: Number(e.value),
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
    numeratorRelationToEdit: PropTypes.object,
    onClose: PropTypes.func,
}
