import { useDataQuery } from '@dhis2/app-runtime'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    Table,
    TableBody,
    TableRow,
    TableCell,
    InputFieldFF,
    SingleSelectFieldFF,
    ReactFinalForm,
    SingleSelect,
    SingleSelectOption,
    ButtonStrip,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { useConfigurations } from '../../../utils/index.js'
const { Form, Field } = ReactFinalForm

const DEFAULT_EXTERNAL_DATA_COMPARISON = {
    name: '',
    criteria: '',
    dataType: 'dataElements',
    externalData: '',
    numerator: '',
    denominator: '',
    level: '',
}

// TODO: these two queries should be moved to a shared file, they are also used in other config tabs (e.g. denominators)
const componentQueries = {
    DEGroups: {
        resource: 'dataElementGroups',
        params: {
            paging: false,
        },
    },
    DEs: {
        resource: 'dataElementGroups',
        params: {
            fields: 'id,displayName,dataElements[id,displayName]',
            paging: false,
        },
    },
    ouLevels: {
        resource: 'organisationUnitLevels',
        params: {
            fields: 'displayName,id,level',
            paging: false,
        },
    },
}

const UpdateExternalDataComparisonModel = ({
    externalDataToUpdate,
    onSave,
    onClose,
}) => {
    const configurations = useConfigurations()

    // filter numerators that have data IDs & sort alphabetically
    const numeratorOptions = React.useMemo(() => {
        const numeratorsWithDataIds = configurations.numerators
            .filter((numerator) => numerator.dataID != null)
            .sort((a, b) => a.name.localeCompare(b.name))
        return numeratorsWithDataIds.map(({ name, code }) => ({
            label: name,
            value: code,
        }))
    }, [configurations.numerators])
    // filter denominators that have data IDs & sort alphabetically

    const denominatorOptions = React.useMemo(() => {
        const denominatorsWithDataIds = configurations.denominators
            .filter((denominator) => denominator.dataID != null)
            .sort((a, b) => a.name.localeCompare(b.name))
        return denominatorsWithDataIds.map(({ name, code }) => ({
            label: name,
            value: code,
        }))
    }, [configurations.denominators])

    // store data element groups
    let dataElementGroups = []
    // store orgUnits
    let orgUnitsLevels = []
    // data elements to filter from
    let dataElements = []

    const { data } = useDataQuery(
        componentQueries,
        {
            lazy: false,
        }
    )

    if (data) {
        dataElementGroups = data.DEGroups.dataElementGroups.map(
            (group) => ({
                label: group.displayName,
                value: group.id,
            })
        )
        orgUnitsLevels = data.ouLevels.organisationUnitLevels.map(
            (level) => ({
                label: level.displayName,
                value: level.level.toString(),
            })
        )
        dataElements = data.DEs.dataElementGroups.map((group) => ({
            label: group.displayName,
            value: group.id,
        }))

        console.log('data', data)
    }

    const [toggleStateModal, setToggleStateModal] = useState(1)

    const toggleTabModal = (index) => {
        setToggleStateModal(index)
    }

    return (
        <Form
            onSubmit={(values, form) => {
                console.log('submitting2...', { values, form })
            }}
            initialValues={
                externalDataToUpdate || DEFAULT_EXTERNAL_DATA_COMPARISON
            }
            subscription={{ submitting: true }}
        >
            {({ handleSubmit }) => (
                <Modal onClose={onClose} large>
                    <ModalTitle>External Data Comparison</ModalTitle>
                    <ModalContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <p>Name</p>
                                    </TableCell>
                                    <TableCell>
                                        <Field
                                            name="name"
                                            component={InputFieldFF}
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
                                                        <Field
                                                            name="group"
                                                            
                                                            component={
                                                                SingleSelectFieldFF
                                                            }
                                                            options={
                                                                dataElementGroups
                                                            }
                                                            placeholder="Select data element group"
                                                        />
                                                        <Field
                                                            name="externalData"
                                                            component={
                                                                SingleSelectFieldFF
                                                            }
                                                            options={[]}
                                                            placeholder="Select data element"
                                                        />
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
                                        <Field
                                            name="numerator"
                                            component={SingleSelectFieldFF}
                                            options={numeratorOptions}
                                            placeholder="Select Numerator"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <p>Routine data denominator</p>
                                    </TableCell>
                                    <TableCell>
                                        <Field
                                            name="denominator"
                                            component={SingleSelectFieldFF}
                                            options={denominatorOptions}
                                            placeholder="Select Denominator"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <p>Threshold (+/- %)</p>
                                    </TableCell>
                                    <TableCell>
                                        <Field
                                            name="threshold"
                                            component={InputFieldFF}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <p>Survel level</p>
                                    </TableCell>
                                    <TableCell>
                                        <Field
                                            name="level"
                                            component={SingleSelectFieldFF}
                                            options={orgUnitsLevels}
                                            placeholder="Select organisation unit level"
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <p>
                            <strong>Threshold</strong> denotes the % difference
                            between external and routine data that is accepted.
                        </p>
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button secondary onClick={onClose}>
                                {' '}
                                Cancel{' '}
                            </Button>
                            <Button
                                primary
                                type="submit"
                                onClick={() => {
                                    handleSubmit()
                                }}
                            >
                                {' '}
                                Save{' '}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </Form>
    )
}

export default UpdateExternalDataComparisonModel
