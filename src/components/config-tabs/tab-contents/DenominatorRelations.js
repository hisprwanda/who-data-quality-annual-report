import { useDataMutation } from '@dhis2/app-runtime'
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
import React, { useState, useEffect } from 'react'
import denominatorTypes from '../../../data/denominatorTypes.json'
import {
    getDenominatorRelations,
    filterDenominatorsByType,
} from '../../../utils/denominatorsMetadataData.js'
import { updateDenominatorRelations } from '../../../utils/updateConfigurations.js'
import { generateDenominatorRelationCode } from '../../../utils/utils.js'

//TODO: move these configuration mutations to a separate file of dhis2 queries
const updateConfigurationsMutation = {
    resource: 'dataStore/who-dqa/configurations',
    type: 'update',
    data: ({ configurations }) => ({
        ...configurations,
        lastUpdated: new Date().toJSON(),
    }),
}

export const DenominatorRelations = ({ toggleState, configurations }) => {
    const [mutate] = useDataMutation(updateConfigurationsMutation)
    const [relations, setRelations] = useState(null)
    const [isModalHidden, setIsModalHidden] = useState(true)
    const [newDenominatorRelationInfo, setNewDenominatorRelationInfo] =
        useState({
            A: '',
            B: '',
            code: '',
            criteria: 12,
            name: '',
            type: '',
        })
    const [selectedDenominatorA, setSelectedDenominatorA] = useState('')
    const [selectedDenominatorB, setSelectedDenominatorB] = useState('')
    const [filteredDenominators, setFilteredDenominators] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [updateType, setUpdateType] = useState('')

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

    const onSaveDenominatorUpdates = async (updateType) => {
        //show a loader while updating
        setIsLoading(true)

        if (updateType === 'create') {
            // generate and set the new denominator code for create only
            const newDenominatorCode = generateDenominatorRelationCode(
                configurations.denominatorRelations
            )

            const updatedConfigurations = updateDenominatorRelations({
                configurations,
                relation: newDenominatorRelationInfo,
                updateType,
                newCode:newDenominatorCode,
            })
            const response = await mutate({
                configurations: updatedConfigurations,
            })

            console.log(updatedConfigurations)
            if (response) {
                //stop the loader after updating
                setRelations([...relations, newDenominatorRelationInfo])
                setIsLoading(false)
            }
            setIsModalHidden(true)
        } else if (updateType === 'update') {
            const updatedConfigurations = updateDenominatorRelations({
                configurations,
                relation:newDenominatorRelationInfo,
                updateType,
                newCode: null,
            })
            const response = await mutate({
                configurations: updatedConfigurations,
            })
            if (response) {
                //stop the loader after updating
                setIsLoading(false)
            }
            setIsModalHidden(true)
        }
    }

    const onEditRelation = (relation) => {
        setIsModalHidden(false)
        setNewDenominatorRelationInfo(relation)
        setSelectedDenominatorA(relation.A)
        setSelectedDenominatorB(relation.B)
        setFilteredDenominators(
            filterDenominatorsByType(configurations.denominators, relation.type)
        )
    }

    // add a new denominator relation
    const onAddRelation = () => {
        setIsModalHidden(false)

        // reset the newDenominatorRelationInfo
        setNewDenominatorRelationInfo({
            A: '',
            B: '',
            code: '',
            criteria: 12,
            name: '',
            type: '',
        })
        setSelectedDenominatorA('')
        setSelectedDenominatorB('')
        setFilteredDenominators([])
        setUpdateType('create')
    }

    // delete a denominator relation
    const onDelete = async (relation) => {
        const updatedConfigurations = updateDenominatorRelations({
            configurations,
            relation,
            updateType: 'delete',
            newCode: null,
        })
        const response = await mutate({ configurations: updatedConfigurations })
        if (response) {
            setRelations(
                relations.filter((item) => item.code !== relation.code)
            )
        }
    }

    useEffect(() => {
        setRelations(configurations.denominatorRelations)
    }, [configurations])

    return (
        <div
            className={
                toggleState === 6 ? 'content  active-content' : 'content'
            }
        >
            <p>
                Please map alternative denominators for comparison, for example
                denominiators from the National Bureau of Statistics with
                denominators used by health programmes.
            </p>
            <hr />
            <div className="denominatorRelationsContainer">
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>Name </TableCellHead>
                            <TableCellHead> Denominator A </TableCellHead>
                            <TableCellHead> Denominator B </TableCellHead>
                            <TableCellHead>Criteria</TableCellHead>
                            <TableCellHead>Actions</TableCellHead>
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
                                        <Button
                                            name="Primary button"
                                            onClick={() => {
                                                onEditRelation(relation)
                                                setUpdateType('update')
                                            }}
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
                                            onClick={() => onDelete(relation)}
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
                                    name="Primary button"
                                    onClick={() => {
                                        onAddRelation()
                                    }}
                                    primary
                                    button
                                    value="default"
                                    icon={<IconAdd16 />}
                                >
                                    {' '}
                                    Add Relations
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* TODO: Implement modal reuse */}
                <Modal
                    onClose={() => setIsModalHidden(true)}
                    hide={isModalHidden}
                    position="middle"
                >
                    <ModalTitle>Denominator relations mapping</ModalTitle>
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
                                            value={
                                                newDenominatorRelationInfo.name
                                            }
                                            onChange={(e) =>
                                                setNewDenominatorRelationInfo({
                                                    ...newDenominatorRelationInfo,
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
                                                handleDenominatorTypeChange(
                                                    e.selected
                                                )
                                            }
                                            placeholder="Select relation type"
                                            selected={
                                                newDenominatorRelationInfo.type
                                            }
                                        >
                                            {denominatorTypes
                                                ? denominatorTypes.map(
                                                      (type, key) => (
                                                          <SingleSelectOption
                                                              label={type.label}
                                                              value={type.value}
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
                                        <p>Denominator A</p>
                                    </TableCell>
                                    <TableCell>
                                        <SingleSelect
                                            className="select"
                                            onChange={(e) => {
                                                setNewDenominatorRelationInfo({
                                                    ...newDenominatorRelationInfo,
                                                    A: e.selected,
                                                })
                                                setSelectedDenominatorA(
                                                    e.selected
                                                )
                                            }}
                                            placeholder="Select denominator A"
                                            selected={selectedDenominatorA}
                                        >
                                            {filteredDenominators
                                                ? filteredDenominators.map(
                                                      (denominator, key) => (
                                                          <SingleSelectOption
                                                              label={
                                                                  denominator.name
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
                                        <p>Denominator B</p>
                                    </TableCell>
                                    <TableCell>
                                        <SingleSelect
                                            className="select"
                                            onChange={(e) => {
                                                setNewDenominatorRelationInfo({
                                                    ...newDenominatorRelationInfo,
                                                    B: e.selected,
                                                })
                                                setSelectedDenominatorB(
                                                    e.selected
                                                )
                                            }}
                                            placeholder="Select denominator B"
                                            selected={selectedDenominatorB}
                                        >
                                            {filteredDenominators
                                                ? filteredDenominators.map(
                                                      (denominator, key) => (
                                                          <SingleSelectOption
                                                              label={
                                                                  denominator.name
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
                                                newDenominatorRelationInfo.criteria
                                            }
                                            onChange={(e) =>
                                                setNewDenominatorRelationInfo({
                                                    ...newDenominatorRelationInfo,
                                                    criteria: e.value,
                                                })
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <p>
                            Threshold denotes the % difference from national
                            figure that is accepted for a sub-national unit.
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
                                loading={isLoading}
                                primary
                                onClick={() =>
                                    onSaveDenominatorUpdates(updateType)
                                }
                            >
                                {' '}
                                {updateType === 'create'
                                    ? 'Create'
                                    : 'Update'}{' '}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            </div>
        </div>
    )
}

DenominatorRelations.propTypes = {
    configurations: PropTypes.object,
    toggleState: PropTypes.string,
}
