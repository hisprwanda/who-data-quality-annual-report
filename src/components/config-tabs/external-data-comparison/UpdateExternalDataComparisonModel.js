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

const UpdateExternalDataComparisonModel = ({
    externalDataToUpdate,
    onSave,
    onClose,
}) => {
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
                                                            options={[]}
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
                                            options={[]}
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
                                            options={[]}
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
                                            options={[]}
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
