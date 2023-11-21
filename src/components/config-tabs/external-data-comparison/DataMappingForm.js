import { useDataEngine, useDataQuery } from '@dhis2/app-runtime'
import {
    // rename this to not clash with Field from RFF
    Field as FieldContainer,
    ReactFinalForm,
    TableRow,
    TableCell,
    Table,
    TableBody,
} from '@dhis2/ui'
import React from 'react'
import { DataElementGroupSelect } from '../numerators/DataElementGroupsSelect'
import { DataElementSelect } from '../numerators/DataElementSelect'
import { DataElementTypeRadios } from '../numerators/DataElementTypeRadios'
import styles from './DataMappingForm.module.css'
import { DenominatorSelect } from './DenominatorSelect'
import { NumeratorSelect } from './NumeratorSelect'
import { OrgUnitLevelSelect } from './OrgUnitLevelSelect'

const { Field, useField } = ReactFinalForm

// Data item types
const DATA_ELEMENT = 'dataElement'
const INDICATOR = 'indicator'

export const DataMappingFormSection = () => {
    const dataTypeField = useField('dataType', {
        subscription: { value: true },
        // need to set the initial value here instead of on the <Field />
        // so the components below can render
        initialValue: DATA_ELEMENT,
    })
    const dataType = dataTypeField.input.value

    return (
        <div className={styles.mainContainer}>
            {/* <DataTypeRadios /> */}
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            Survey/external indicator
                        </TableCell>
                        <TableCell>
                            <DataElementTypeRadios />
                            <DataElementGroupSelect />
                            <DataElementSelect />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Routine data numerator
                        </TableCell>
                        <TableCell>
                            <NumeratorSelect />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Routine data denominator
                        </TableCell>
                        <TableCell>
                            <DenominatorSelect />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Survel level
                        </TableCell>
                        <TableCell>
                            <OrgUnitLevelSelect />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}
