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
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useConfigurations } from '../../../utils/index.js'
const { Form, Field, useField } = ReactFinalForm

const DEFAULT_FORM_VALUES = {
    name: '',
    criteria: '10',
    dataType: 'dataElements',
    externalData: '',
    numerator: '',
    denominator: '',
    level: '',
}

// TODO: queries to be moved to a shared file, they are also used in other config tabs (e.g. denominators)
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
    indicatorGroups: {
        resource: 'indicatorGroups',
        params: {
            paging: false,
        },
    },
    indicators: {
        resource: 'indicators',
        params: {
            fields: 'id,displayName,indicatorGroups[id,displayName]',
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

// Extract the field to it's own component
const DataElementSelect = ({ dataElementsToFilter }) => {
    // use `useField` from ReactFinalForm to get a field's state --
    // input.value will be the value of the field we're looking for
    const { input } = useField(
        // name of the field you want to spy on
        'dataElementGroup',
        // use a config object subscribe to just the input value
        // to avoid unnecessary rerenders
        { subscription: { value: true } }
    )
    const selectedDataElementGroup = input.value

    // Filter out the data element options based on the selected group
    // Use useMemo() from react to avoid having to do this calculation
    // on every rerender, only when the dataElementGroup changes
    const dataElementOptions = React.useMemo(() => {
        const groupElements = dataElementsToFilter.filter(
            (group) => group.id === selectedDataElementGroup
        )

        // if no elements are found, return an empty array
        if (groupElements.length === 0) {
            return []
        }
        // update the data elements options based on the selected group
        const filteredDataElementOptions = groupElements[0].dataElements.map(
            (group) => ({
                label: group.displayName,
                value: group.id,
            })
        )

        return filteredDataElementOptions
        // this array tells this memoized function to only run when
        // selectedDataElementGroup changes
    }, [dataElementsToFilter, selectedDataElementGroup])

    return (
        <Field
            name="dataElement"
            component={SingleSelectFieldFF}
            // provide our options here:
            options={dataElementOptions}
            placeholder="Select data element"
        />
    )
}
DataElementSelect.propTypes = {
    dataElementsToFilter: PropTypes.array,
}

// Extract the field to it's own component
const IndicatorSelect = ({ indicatorsToFilter }) => {
    const { input } = useField(
        'indicatorGroups',
        { subscription: { value: true } }
    )
    const selectedIndicatorGroup = input.value

    const indicatorOptions =  React.useMemo(() => {
        const filteredIndicatorOptions = []

        indicatorsToFilter.forEach((indicator) => {
            indicator.indicatorGroups.forEach((group) => {
                if (group.id === selectedIndicatorGroup) {
                    filteredIndicatorOptions.push({
                        label: indicator.displayName,
                        value: indicator.id,
                    })
                }
            })
        })

    return filteredIndicatorOptions
    }, [indicatorsToFilter, selectedIndicatorGroup])
    return (
        <Field
            name="indicator"
            component={SingleSelectFieldFF}
            // provide our options here:
            options={indicatorOptions}
            placeholder="Select indicator"
        />
    )
}
IndicatorSelect.propTypes = {
    dataElementsToFilter: PropTypes.array,
}

export const EditExternalDataComparisonModel = ({
    externalRelationToEdit,
    onSave,
    onClose,
}) => {
    const configurations = useConfigurations()

    const [toggleStateModal, setToggleStateModal] = useState(1)

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
    let dataElementsToFilter = []

    // store indicator groups
    let indicatorGroups = []

    // store indicators to filter from
    let indicatorsToFilter = []

    const { data } = useDataQuery(componentQueries, {
        lazy: false,
    })

    if (data) {
        dataElementGroups = data.DEGroups.dataElementGroups.map((group) => ({
            label: group.displayName,
            value: group.id,
        }))
        orgUnitsLevels = data.ouLevels.organisationUnitLevels.map((level) => ({
            label: level.displayName,
            value: level.level.toString(),
        }))

        // data groups containing data elements to filter from
        dataElementsToFilter = data.DEs.dataElementGroups

        // indicator groups
        indicatorGroups = data.indicatorGroups.indicatorGroups.map((group) => ({
            label: group.displayName,
            value: group.id,
        }))

        indicatorsToFilter = data.indicators.indicators;
    }

    const toggleTabModal = (index) => {
        setToggleStateModal(index)

        // update DEFAULT_FORM_VALUES' dataType field based on the tab selected 
        // index ==1 ==> dataElements index== 2 => indicators) 
        if (index === 1) {
            DEFAULT_FORM_VALUES.dataType = 'dataElements'
        } else {
            DEFAULT_FORM_VALUES.dataType = 'indicators'
        }
        
    }

    return (
        <Form
            onSubmit={(values, form) => {
                console.log('submitting2...', { values, form })
                if (onSave) {
                    onSave(values)
                } else {
                    alert('todo')
                }
                onClose()
            }}
            initialValues={externalRelationToEdit || DEFAULT_FORM_VALUES}
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
                                                            name="dataElementGroup"
                                                            component={
                                                                SingleSelectFieldFF
                                                            }
                                                            options={
                                                                dataElementGroups
                                                            }
                                                            placeholder="Select data element group"
                                                        />

                                                        <DataElementSelect
                                                            dataElementsToFilter={
                                                                dataElementsToFilter
                                                            }
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
                                                        <Field
                                                            name="indicatorGroups"
                                                            component={
                                                                SingleSelectFieldFF
                                                            }
                                                            options={
                                                                indicatorGroups
                                                            }
                                                            placeholder="Select indicator group"
                                                        />
                                                       <IndicatorSelect 
                                                            indicatorsToFilter={ indicatorsToFilter }
                                                        />
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
                                            name="criteria"
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

EditExternalDataComparisonModel.propTypes = {
    externalRelationToEdit: PropTypes.object,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}
