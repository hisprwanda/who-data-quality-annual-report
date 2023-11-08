import {
    Button,
    ButtonStrip,
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
    Input,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { getDenominatorRelations } from '../../../utils/denominatorsMetadataData.js'
import { getNumeratorDataElement } from '../../../utils/numeratorsMetadataData.js'

export const ExternalDataComparison = ({ toggleState, configurations }) => {
    const [relations, setRelations] = useState(null)
    const [toggleStateModal, setToggleStateModal] = useState(1)
    const [isModalHidden, setIsModalHidden] = useState(true)
    const [newExternalDataInfo, setNewExternalDataInfo] = useState({
        type: '',
        dataID: '',
        lowLevel: '',
    })


    const toggleTabModal = (index) => {
        setToggleStateModal(index)
    }

    const onModalClose = () => {
        setIsModalHidden(true)
    }


    useEffect(() => {
        setRelations(configurations.externalRelations)
    }, [])

    return (
        <div
            className={
                toggleState === 7 ? 'content  active-content' : 'content'
            }
        >
            <p>
                {`Please identify external (survey) data that can be used for
                comparison with routine data, e.g. ANC coverage, immunisation
                coverage etc. The "external data" should refer to calculated
                survey result (e.g. a percentage), whilst the numerator and
                denominator refer to the raw data`}
            </p>
            <hr />

            <div className="ExternalDataContainer">
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>Name</TableCellHead>
                            <TableCellHead>
                                Survey/external indicator
                            </TableCellHead>
                            <TableCellHead>
                                Routine data numerator
                            </TableCellHead>
                            <TableCellHead>
                                Routine data denominator
                            </TableCellHead>
                            <TableCellHead>Criteria</TableCellHead>
                            {/* TODO: have dhis2 metadata objects you will neen into a context api objt */}
                            <TableCellHead>Level</TableCellHead>
                            <TableCellHead>Actions</TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {relations ? (
                            relations.map((relation, key) => (
                                <TableRow key={key}>
                                    <TableCell>{relation.name}</TableCell>
                                    <TableCell>
                                        {getNumeratorDataElement(
                                            configurations,
                                            relation.externalData
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {getDenominatorRelations(
                                            configurations.numerators,
                                            relation.numerator
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {getDenominatorRelations(
                                            configurations.denominators,
                                            relation.denominator
                                        )}
                                    </TableCell>
                                    <TableCell>{relation.criteria}%</TableCell>
                                    <TableCell>District</TableCell>
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
                                                console.log('deleting...')
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
                                <TableCell></TableCell>
                            </TableRow>
                        )}
                        {/* Add button */}

                        <TableRow>
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
                                    Add Comparison
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>


            <Modal
                onClose={onModalClose}
                hide={isModalHidden}
                position="middle"
                large
            >
                <ModalTitle>External Data Comparison</ModalTitle>
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
                                        value=''
                                        onChange=''
                                        required
                                        className="input"
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <p>Survey/external indicator</p>
                                </TableCell>
                                <TableCell>
                                    <div className="denominatorSelection">
                                        <div className="dataElementsIndicatorToggle bloc-tabs-modal">
                                            <button
                                                className={
                                                    toggleStateModal === 1
                                                        ? 'tabs-modal active-tabs-modal'
                                                        : 'tabs-modal'
                                                }
                                                onClick={() =>
                                                    toggleTabModal(1)
                                                }
                                            >
                                                Data element
                                            </button>
                                            <button
                                                className={
                                                    toggleStateModal === 2
                                                        ? 'tabs-modal active-tabs-modal'
                                                        : 'tabs-modal'
                                                }
                                                onClick={() =>
                                                    toggleTabModal(2)
                                                }
                                            >
                                                Indicator
                                            </button>
                                        </div>
                                        <div className="content-tabs-modal">
                                            <div
                                                className={
                                                    toggleStateModal === 1
                                                        ? 'content-modal  active-content-modal'
                                                        : 'content-modal'
                                                }
                                            >
                                                <div className="dataElementsSelector">
                                                    <SingleSelect
                                                        className="select"
                                                        onChange={(value) => {
                                                            
                                                            setNewExternalDataInfo(
                                                                {
                                                                    ...newExternalDataInfo,
                                                                    dataID: '',
                                                                }
                                                            ) //resets the previous value for new data elements to be refetched
                                                            elementsRefetch({
                                                                groupID:
                                                                    value.selected,
                                                            }) // fetch data elements only after a data element group has been selected
                                                        }}
                                                        placeholder="Data element group"
                                                        selected=''
                                                    >
                                                        <SingleSelectOption  label='' value='' />
                                                    </SingleSelect>
                                                    <SingleSelect
                                                        className="select"
                                                        onChange=''
                                                        placeholder="Select data element"
                                                        disabled=''
                                                        selected={
                                                            newExternalDataInfo.dataID
                                                        }
                                                    >
                                                        <SingleSelectOption  label='' value='' />
                                                    </SingleSelect>
                                                </div>
                                            </div>

                                            <div
                                                className={
                                                    toggleStateModal === 2
                                                        ? 'content-modal  active-content-modal'
                                                        : 'content-modal'
                                                }
                                            >
                                                <div className="dataElementsSelector">
                                                    <SingleSelect
                                                        className="select"
                                                        onChange={() =>
                                                            console.log(
                                                                'selected'
                                                            )
                                                        }
                                                        placeholder="Select indicator group"
                                                    >
                                                        <SingleSelectOption
                                                            label="Group one"
                                                            value="1"
                                                        />
                                                        <SingleSelectOption
                                                            label="Group two"
                                                            value="2"
                                                        />
                                                        <SingleSelectOption
                                                            label="Group three"
                                                            value="3"
                                                        />
                                                    </SingleSelect>
                                                    <SingleSelect
                                                        className="select"
                                                        onChange={() =>
                                                            console.log(
                                                                'selected'
                                                            )
                                                        }
                                                        placeholder="Select data element"
                                                    >
                                                        <SingleSelectOption
                                                            label="Group one"
                                                            value="1"
                                                        />
                                                        <SingleSelectOption
                                                            label="Group two"
                                                            value="2"
                                                        />
                                                        <SingleSelectOption
                                                            label="Group three"
                                                            value="3"
                                                        />
                                                    </SingleSelect>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <p>Routine data numerator</p>
                                </TableCell>
                                <TableCell>
                                    <SingleSelect
                                        className="select"
                                        onChange={(value) =>
                                            setNewExternalDataInfo({
                                                ...newExternalDataInfo,
                                                lowLevel: value.selected,
                                            })
                                        }
                                        placeholder="Select Numerator"
                                        selected={newExternalDataInfo.lowLevel.toString()}
                                    >
                                        
                                    </SingleSelect>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <p>Routine data denominator</p>
                                </TableCell>
                                <TableCell>
                                    <SingleSelect
                                        className="select"
                                        onChange={(value) =>
                                            setNewExternalDataInfo({
                                                ...newExternalDataInfo,
                                                lowLevel: value.selected,
                                            })
                                        }
                                        placeholder="Select Denominator"
                                        selected={newExternalDataInfo.lowLevel.toString()}
                                    >
                                        
                                    </SingleSelect>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <p>Threshold (+/- %)</p>
                                </TableCell>
                                <TableCell>
                                <Input
                                        label="Name"
                                        name="name"
                                        value='10'
                                        onChange=''
                                        required
                                        className="input"
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <p>Survel level</p>
                                </TableCell>
                                <TableCell>
                                    <SingleSelect
                                        className="select"
                                        onChange={(value) =>
                                            setNewExternalDataInfo({
                                                ...newExternalDataInfo,
                                                lowLevel: value.selected,
                                            })
                                        }
                                        placeholder="Select organisation unit level"
                                        selected={newExternalDataInfo.lowLevel.toString()}
                                    >
                                        
                                    </SingleSelect>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p><strong>Threshold</strong> denotes the % difference between external and routine data that is accepted.</p>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button secondary onClick={onModalClose}>
                            {' '}
                            Cancel{' '}
                        </Button>
                        <Button
                            primary
                            onClick={() =>
                                onSaveDenominator(newExternalDataInfo)
                            }
                        >
                            {' '}
                            Save{' '}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        </div>
    )
}

ExternalDataComparison.propTypes = {
    configurations: PropTypes.object,
    toggleState: PropTypes.string,
}
