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
    IconAdd16,
} from '@dhis2/ui'
import React, { useState, useCallback } from 'react'
import {
    CREATE_DENOMINATOR,
    useConfigurations,
    useConfigurationsDispatch,
} from '../../../utils/index.js'
import { DenominatorTableItem } from './DenominatorTableItem.js'
import { EditDenominatorModal } from './EditDenominatorModal.js'

const AddNewDenominatorButton = () => {
    const [addNewModalOpen, setAddNewModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setAddNewModalOpen(true), [])
    const closeModal = useCallback(() => setAddNewModalOpen(false), [])

    const addNewDenominatorRelation = useCallback(
        ({ newDenominatorData }) => {
            dispatch({
                type: CREATE_DENOMINATOR,
                payload: {
                    newDenominatorData,
                },
            })
        },
        [dispatch]
    )

    return (
        <>
            <Button primary icon={<IconAdd16 />} onClick={openModal}>
                Add denominator
            </Button>
            {addNewModalOpen && (
                <EditDenominatorModal
                    onSave={addNewDenominatorRelation}
                    onClose={closeModal}
                />
            )}
        </>
    )
}

export const Denominators = () => {
    const configurations = useConfigurations()

    return (
        <div>
            <p>
                Please map alternative denominators for comparison, for example
                denominiators from the National Bureau of Statistics with
                denominators used by health programmes.
            </p>
            <hr />

            <div className="denominatorsContainer">
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>
                                {' '}
                                Data element/indicator{' '}
                            </TableCellHead>
                            <TableCellHead>Type</TableCellHead>
                            <TableCellHead>Actions</TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {configurations.denominators.map((denominator) => (
                            <DenominatorTableItem
                                denominator={denominator}
                                key={denominator.code}
                            />
                        ))}

                        {/* Add button */}

                        <TableRow>
                            <TableCell colSpan="3">
                                <ButtonStrip end>
                                    <AddNewDenominatorButton />
                                </ButtonStrip>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* TODO: will move this modal in it's own component */}
            {/* <Modal
               
            >
                <ModalTitle>Add Denominator</ModalTitle>
                <ModalContent>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <p>Type</p>
                                </TableCell>
                                <TableCell>
                                    <SingleSelect
                                        className="select"
                                        onChange={(value) =>
                                            setNewDenominatorInfo({
                                                ...newDenominatorInfo,
                                                type: value.selected,
                                            })
                                        }
                                        placeholder="Select denominator type"
                                        selected={newDenominatorInfo.type}
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
                                    <p>Denominator</p>
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
                                                            setSelectedElementsGroup(
                                                                value.selected
                                                            )
                                                            setNewDenominatorInfo(
                                                                {
                                                                    ...newDenominatorInfo,
                                                                    dataID: '',
                                                                }
                                                            ) //resets the previous value for new data elements to be refetched
                                                            elementsRefetch({
                                                                groupID:
                                                                    value.selected,
                                                            }) // fetch data elements only after a data element group has been selected
                                                        }}
                                                        placeholder="Data element group"
                                                        selected={
                                                            selectedElementsGroup
                                                        }
                                                    >
                                                        {mappedDataElementGroups
                                                            ? mappedDataElementGroups.map(
                                                                  (
                                                                      group,
                                                                      key
                                                                  ) => (
                                                                      <SingleSelectOption
                                                                          label={
                                                                              group.label
                                                                          }
                                                                          value={
                                                                              group.value
                                                                          }
                                                                          key={
                                                                              key
                                                                          }
                                                                      />
                                                                  )
                                                              )
                                                            : ''}
                                                    </SingleSelect>
                                                    <SingleSelect
                                                        className="select"
                                                        onChange={
                                                            handleDataElementSelection
                                                        }
                                                        placeholder="Select data element"
                                                        disabled={
                                                            mappedDataElements
                                                                ? false
                                                                : true
                                                        }
                                                        selected={
                                                            newDenominatorInfo.dataID
                                                        }
                                                    >
                                                        {mappedDataElements
                                                            ? mappedDataElements.map(
                                                                  (
                                                                      element,
                                                                      key
                                                                  ) => (
                                                                      <SingleSelectOption
                                                                          label={
                                                                              element.label
                                                                          }
                                                                          value={
                                                                              element.value
                                                                          }
                                                                          key={
                                                                              key
                                                                          }
                                                                      />
                                                                  )
                                                              )
                                                            : ''}
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
                                    <p>Lowest available level</p>
                                </TableCell>
                                <TableCell>
                                    <SingleSelect
                                        className="select"
                                        onChange={(value) =>
                                            setNewDenominatorInfo({
                                                ...newDenominatorInfo,
                                                lowLevel: value.selected,
                                            })
                                        }
                                        placeholder="Select Level"
                                        selected={newDenominatorInfo.lowLevel.toString()}
                                    >
                                        {orgUnitsLevels
                                            ? orgUnitsLevels.map(
                                                  (ouLevel, key) => (
                                                      <SingleSelectOption
                                                          label={
                                                              ouLevel.displayName
                                                          }
                                                          value={ouLevel.level.toString()}
                                                          key={key}
                                                      />
                                                  )
                                              )
                                            : ''}
                                    </SingleSelect>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
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
                                onSaveDenominator(newDenominatorInfo)
                            }
                        >
                            {' '}
                            Create{' '}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal> */}
        </div>
    )
}
