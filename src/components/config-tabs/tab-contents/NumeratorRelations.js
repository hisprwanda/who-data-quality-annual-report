import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
    IconDelete16,
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
import React, { useState } from 'react'
import relationTypes from '../../../data/relationTypes.json'
import {
    getNumeratorRelations,
    getRelationType,
} from '../../../utils/numeratorsMetadataData.js'

export const NumeratorRelations = ({ toggleState, configurations }) => {
    const [isModalHidden, setIsModalHidden] = useState(true)
    const [newNumeratorRelationInfo, setNewNumeratorRelationInfo] = useState({
        A: '',
        B: '',
        code: '',
        criteria: 12,
        name: '',
        type: '',
    })

    const relations = configurations.numeratorRelations
    const numeratorsWithDataIds = configurations.numerators.filter(
        (numerator) => numerator.dataID != null
    )

    return (
        <div
            className={
                toggleState === 3 ? 'content  active-content' : 'content'
            }
        >
            <p>Numerator Relations</p>
            <hr />
            <div className="relationsContainer">
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>Name</TableCellHead>
                            <TableCellHead>Numerator A</TableCellHead>
                            <TableCellHead>Numerator B</TableCellHead>
                            <TableCellHead>Type</TableCellHead>
                            <TableCellHead>Threshold (%)</TableCellHead>
                            <TableCellHead>Threshold explanation</TableCellHead>
                            <TableCellHead>Description</TableCellHead>
                            <TableCellHead>Actions</TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {relations ? (
                            relations.map((relation, key) => (
                                <TableRow key={key}>
                                    <TableCell>{relation.name}</TableCell>
                                    <TableCell>
                                        {getNumeratorRelations(
                                            configurations.numerators,
                                            relation.A
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {getNumeratorRelations(
                                            configurations.numerators,
                                            relation.B
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            getRelationType(relation.type)
                                                .displayName
                                        }
                                    </TableCell>
                                    <TableCell>{relation.criteria}</TableCell>
                                    <TableCell>
                                        {
                                            getRelationType(relation.type)
                                                .thresholdDescription
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            getRelationType(relation.type)
                                                .description
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            name="Primary button"
                                            onClick={() =>
                                                setIsModalHidden(false)
                                            }
                                            basic
                                            button
                                            value="default"
                                            icon={<IconEdit16 />}
                                        >
                                            {' '}
                                            Edit
                                        </Button>
                                        <Button
                                            name="Primary button"
                                            onClick={() =>
                                                console.log('It works!')
                                            }
                                            destructive
                                            button
                                            value="default"
                                            icon={<IconDelete16 />}
                                        >
                                            {' '}
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell>
                                    No numerator relations found.
                                </TableCell>
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                                <Button
                                    name="Primary button"
                                    onClick={() => setIsModalHidden(false)}
                                    primary
                                    button
                                    value="default"
                                    icon={<IconAdd16 />}
                                >
                                    {' '}
                                    Add Numerator Relation
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* TODO: will move this modal in it's own component */}
            <Modal
                onClose={() => setIsModalHidden(true)}
                hide={isModalHidden}
                position="middle"
            >
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
                                        value={
                                            newNumeratorRelationInfo.criteria
                                        }
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
                        Threshold denotes the % difference from national figure
                        that is accepted for a sub-national unit.
                    </p>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button
                            secondary
                            onClick={() => setIsModalHidden(true)}
                        >
                            {' '}
                            Cancel{' '}
                        </Button>
                        <Button
                            primary
                            onClick={() =>
                                console.log('creating numerator relations')
                            }
                        >
                            {' '}
                            Create{' '}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        </div>
    )
}

NumeratorRelations.propTypes = {
    configurations: PropTypes.object,
    toggleState: PropTypes.string,
}
