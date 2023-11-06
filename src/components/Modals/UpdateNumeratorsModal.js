import { useDataQuery } from '@dhis2/app-runtime'
import {
    Button,
    ButtonStrip,
    Checkbox,
    Input,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    MultiSelectOption,
    MultiSelectField,
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import '../Modals/edit_modal_styles.css'
import {
    filterSelectedMetadata,
    getNumeratorMemberGroups,
} from '../../utils/numeratorsMetadataData.js'
import { generateNumeratorCode } from '../../utils/utils.js'

const dataElementGroupsQuery = {
    elements: {
        resource: 'dataElementGroups',
        params: {
            paging: false,
        },
    },
}

const dataElementsQuery = {
    elements: {
        resource: 'dataElements',
        params: ({ groupID }) => ({
            paging: false,
            filter: `dataElementGroups.id:eq:${groupID}`,
        }),
    },
}

const dataSetsQuery = {
    dataSets: {
        resource: 'dataElements',
        id: ({ elementID }) => elementID,
        params: {
            fields: 'dataSets[displayName,id,periodType],dataSetElements[dataSet[displayName,id,periodType]',
        },
    },

    dataElementOperands: {
        resource: 'dataElementOperands',
        params: ({ elementID }) => ({
            fields: 'displayName,id',
            paging: false,
            filter: `dataElement.id:eq:${elementID}`,
        }),
    },
}

const UpdateNumeratorsModal = ({
    configurations,
    onClose,
    isHidden,
    onSave,
    numeratorToEdit,
    updateType,
    isLoading,
}) => {
    const [toggleStateModal, setToggleStateModal] = useState(1)
    const [selectedElementGroup, setSelectedElementGroup] = useState('')
    const [selectedElement, setSelectedElement] = useState('')
    const [selectedElements, setSelectedElements] = useState([])
    const [selectedOperands, setSelectedOperands] = useState([])
    const [filteredSelectedElements, setFilteredSelectedElements] = useState([])
    const [mappedDataElementGroups, setMappedDataElementGroups] = useState([])
    const [dataElements, setDataElements] = useState([])
    const [mappedDataSets, setMappedDataSets] = useState([])
    const [mappedDataElementOperands, setMappedDataElementOperands] = useState(
        []
    )
    const [footerMessage, setFooterMessage] = useState(null)
    const [numerator, setNumerator] = useState({
        name: '',
        definition: '',
        core: false,
    })

    // run the data element groups querry
    const {
        loading: lementGroupsLoading,
        error: elementGroupsError,
        data: datalementGroupsData,
        refetch: lementGroupsRefetch,
    } = useDataQuery(dataElementGroupsQuery, {
        lazy: false,
    })

    // run the data elements querry
    const {
        loading: elementsLoading,
        error: elementsError,
        data: dataElementsData,
        refetch: elementsRefetch,
    } = useDataQuery(dataElementsQuery, {
        lazy: true,
    })

    // run the datasets querry
    const {
        loading: dataSetsLoading,
        error: dataSetsError,
        data: dataSetsData,
        refetch: dataSetsRefetch,
    } = useDataQuery(dataSetsQuery, {
        lazy: true,
    })

    // TODO this action is duplicated in other components, do it once and save it globaly
    useEffect(() => {
        if (datalementGroupsData) {
            const deGroups = datalementGroupsData.elements.dataElementGroups
            setMappedDataElementGroups(
                deGroups.map(({ id, displayName }) => ({
                    value: id,
                    label: displayName,
                }))
            )
        }
    }, [datalementGroupsData])

    useEffect(() => {
        if (dataElementsData) {
            const dataElements = dataElementsData.elements.dataElements
            setDataElements(
                dataElements.map(({ id, displayName }) => ({
                    value: id,
                    label: displayName,
                }))
            )
        }
    }, [dataElementsData])

    useEffect(() => {
        if (dataSetsData) {
            const dataSets = dataSetsData.dataSets.dataSetElements
            setMappedDataSets(
                dataSets.map(({ dataSet }) => ({
                    value: dataSet.id,
                    label: dataSet.displayName,
                }))
            )

            // set the data element operands
            const operands =
                dataSetsData.dataElementOperands.dataElementOperands
            setMappedDataElementOperands(
                operands.map(({ id, displayName }) => ({
                    value: id,
                    label: displayName,
                }))
            )
        }
    }, [dataSetsData])

    // TODO: remove these styles from here
    const boxStyles = {
        border: '1px solid rgb(160, 173, 186)',
        borderRadius: '3px',
        marginBottom: '2px',
        minHeight: '40px',
        cursor: 'pointer',
        color: '#6c7787',
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        lineHeight: '16px',
        paddingLeft: '11px',
    }

    const newCode = generateNumeratorCode(configurations.numerators)

    const handleGroupSelection = (selectedG) => {
        setNumerator({
            ...numerator,
            code: newCode,
            groups: selectedG.selected,
        })
    }

    const handleDataSetsSelection = (selectedD) => {
        setNumerator({
            ...numerator,
            code: newCode,
            dataSetID: selectedD.selected,
        })
    }

    const toggleTabModal = (index) => {
        setToggleStateModal(index)
    }

    useEffect(() => {
        if (updateType == 'create') {
            // resetting state values
            setNumerator({
                name: '',
                definition: '',
                core: false,
                groups: [],
            })
        } else if (updateType == 'update') {
            // set numerator with existin data
            if (numeratorToEdit.length != 0) {
                setNumerator({
                    ...numerator,
                    code: numeratorToEdit.code,
                    name: numeratorToEdit.name,
                    definition: numeratorToEdit.definition,
                    core: numeratorToEdit.core,
                    groups: getNumeratorMemberGroups(
                        configurations,
                        numeratorToEdit.code
                    ).map((group) => group.code),
                })
            } else {
                setNumerator({
                    name: '',
                    definition: '',
                    core: false,
                    groups: [],
                })
            }
        }
    }, [isHidden])

    useEffect(() => {
        setFilteredSelectedElements(
            filterSelectedMetadata(dataElements, selectedElements)
        )
    }, [selectedElements])

    useEffect(() => {
        if (filteredSelectedElements[0] && numerator.name) {
            setFooterMessage(
                `"${numerator.name}" will be mapped to ${filteredSelectedElements[0].label}`
            )
        }
    }, [filteredSelectedElements])

    return (
        <div>
            {/* Main update modal */}
            <Modal onClose={onClose} hide={isHidden} position="middle" large>
                <ModalTitle>Numerators Mapping to Data Elements</ModalTitle>
                <ModalContent>
                    <div className="modal_content">
                        <div className="modal_top_content">
                            <div className="left">
                                <p>Name</p>
                                <p>Definition</p>
                                <p>Groups</p>
                            </div>
                            <div className="right">
                                <Input
                                    label="Name"
                                    name="name"
                                    value={numerator.name}
                                    onChange={(e) =>
                                        setNumerator({
                                            ...numerator,
                                            name: e.value,
                                        })
                                    }
                                    required
                                    className="input"
                                />
                                <Input
                                    label="Definition"
                                    name="definition"
                                    value={numerator.definition}
                                    onChange={(e) =>
                                        setNumerator({
                                            ...numerator,
                                            definition: e.value,
                                        })
                                    }
                                    required
                                    className="input"
                                />

                                {/* Use the multiselect ui */}
                                <div className="input grouping">
                                    <div
                                        style={{
                                            maxWidth: 300,
                                            minWidth: 300,
                                        }}
                                        className="group_item"
                                    >
                                        <MultiSelectField
                                            onChange={handleGroupSelection}
                                            selected={numerator.groups}
                                            placeholder="Select groups"
                                        >
                                            {configurations.groups.map(
                                                (group, key) => (
                                                    <MultiSelectOption
                                                        label={
                                                            group.displayName
                                                        }
                                                        key={key}
                                                        value={group.code}
                                                    />
                                                )
                                            )}
                                        </MultiSelectField>
                                    </div>
                                    <div className="group_item">
                                        <p>Core</p>
                                    </div>
                                    <div className="group_item">
                                        <Checkbox
                                            checked={numerator.core}
                                            name="Ex"
                                            onChange={() =>
                                                setNumerator({
                                                    ...numerator,
                                                    core: !numerator.core,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3>Data Mapping</h3>
                        <div className="dataElementsIndicatorToggle bloc-tabs-modal">
                            <button
                                className={
                                    toggleStateModal === 1
                                        ? 'tabs-modal active-tabs-modal'
                                        : 'tabs-modal'
                                }
                                onClick={() => toggleTabModal(1)}
                            >
                                Data elements{' '}
                            </button>
                            <button
                                className={
                                    toggleStateModal === 2
                                        ? 'tabs-modal active-tabs-modal'
                                        : 'tabs-modal'
                                }
                                onClick={() => toggleTabModal(2)}
                            >
                                Indicators
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
                                        disabled={
                                            mappedDataElementGroups.length > 0
                                                ? false
                                                : true
                                        }
                                        onChange={(selected) => {
                                            setSelectedElementGroup(
                                                selected.selected
                                            )
                                            setSelectedElement('')
                                            setSelectedOperands('')
                                            elementsRefetch({
                                                groupID: selected.selected,
                                            }) // fetch data elements only after a data element group has been selected
                                            setNumerator({
                                                ...numerator,
                                                dElementGroup:
                                                    selected.selected,
                                            })
                                            setNumerator({
                                                ...numerator,
                                                dataSetID: [],
                                            })
                                        }}
                                        placeholder="Select data element group"
                                        selected={selectedElementGroup}
                                    >
                                        {mappedDataElementGroups.map(
                                            (group, key) => (
                                                <SingleSelectOption
                                                    label={group.label}
                                                    value={group.value}
                                                    key={key}
                                                />
                                            )
                                        )}
                                    </SingleSelect>

                                    <SingleSelect
                                        className="select"
                                        disabled={
                                            dataElements.length > 0
                                                ? false
                                                : true
                                        }
                                        onChange={(selected) => {
                                            setSelectedElement(
                                                selected.selected
                                            )
                                            setSelectedOperands('')
                                            setMappedDataElementOperands([])
                                            dataSetsRefetch({
                                                elementID: selected.selected,
                                            }) // fetch datasets only after a data element has been selected
                                            setNumerator({
                                                ...numerator,
                                                dataID: selected.selected,
                                            })
                                            setNumerator({
                                                ...numerator,
                                                dataSetID: [],
                                            })
                                        }}
                                        placeholder="Select data element"
                                        selected={selectedElement}
                                    >
                                        {dataElements.map((element, key) => (
                                            <SingleSelectOption
                                                label={element.label}
                                                value={element.value}
                                                key={key}
                                            />
                                        ))}
                                    </SingleSelect>
                                </div>

                                <h3>Data set for completeness</h3>

                                {/* 
                                TODO: Re-investigate why the selection doesn't get the last selected item and fix it on groups also
                             */}

                                <MultiSelectField
                                    onChange={(selected) => {
                                        handleDataSetsSelection(selected)
                                    }}
                                    selected={numerator.dataSetID}
                                    placeholder="Select datasets"
                                >
                                    {mappedDataSets.map((dataset, key) => (
                                        <MultiSelectOption
                                            label={dataset.label}
                                            key={key}
                                            value={dataset.value}
                                        />
                                    ))}
                                </MultiSelectField>

                                <h3>Variable for completeness</h3>
                                <SingleSelect
                                    className="select"
                                    disabled={
                                        mappedDataElementOperands.length > 0
                                            ? false
                                            : true
                                    }
                                    onChange={(selected) => {
                                        setSelectedOperands(selected.selected)
                                        setNumerator({
                                            ...numerator,
                                            dataElementOperandID:
                                                selected.selected,
                                        })
                                    }}
                                    placeholder="Select Variable"
                                    selected={selectedOperands}
                                >
                                    {mappedDataElementOperands.map(
                                        (operand, key) => (
                                            <SingleSelectOption
                                                label={operand.label}
                                                value={operand.value}
                                                key={key}
                                            />
                                        )
                                    )}
                                </SingleSelect>
                                <p>{footerMessage}</p>
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
                                        onChange={() => console.log('selected')}
                                        placeholder="Indicators Groups"
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
                                        onChange={() => console.log('selected')}
                                        placeholder="Select Indicators"
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

                                <h3>Data set for completeness</h3>
                                <SingleSelect
                                    className="select"
                                    onChange={() => console.log('selected')}
                                    placeholder="Select Dataset"
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

                                <h3>Variable for completeness</h3>
                                <SingleSelect
                                    className="select"
                                    onChange={() => console.log('selected')}
                                    placeholder="Select Variable"
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

                                <p>
                                    &quot;DPT 1&quot; will be mapped to
                                    &quot;Penta 1 doses given&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button secondary onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            primary
                            loading={isLoading}
                            onClick={() => onSave(numerator, updateType)}
                        >
                            {updateType === 'create' ? 'Create' : 'Update'}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        </div>
    )
}

UpdateNumeratorsModal.propTypes = {
    configurations: PropTypes.object,
    isHidden: PropTypes.bool,
    numeratorToEdit: PropTypes.object,
    updateType: PropTypes.string,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}

export default UpdateNumeratorsModal
