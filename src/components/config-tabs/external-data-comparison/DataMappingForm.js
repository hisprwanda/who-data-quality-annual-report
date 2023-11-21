import { useDataEngine, useDataQuery } from '@dhis2/app-runtime'
import {
    // rename this to not clash with Field from RFF
    Field as FieldContainer,
    MultiSelectFieldFF,
    SingleSelectFieldFF,
    RadioFieldFF,
    ReactFinalForm,
    TableRow,
    TableCell,
    Table,
    TableBody,
} from '@dhis2/ui'
import { Tab } from '@dhis2/ui-core'
import React, { useCallback, useState, useEffect, useMemo } from 'react'
import styles from './DataMappingForm.module.css'
import { DataElementTypeRadios } from '../numerators/DataElementTypeRadios'
import { DataElementGroupSelect } from '../numerators/DataElementGroupsSelect'
import { DataElementSelect } from '../numerators/DataElementSelect'
import { NumeratorSelect } from './NumeratorSelect'
import { OrgUnitLevelSelect } from './OrgUnitLevelSelect'
import { DenominatorSelect } from './DenominatorSelect'

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
                            <p>Survey/external indicator</p>
                        </TableCell>
                        <TableCell>
                            <DataElementTypeRadios />
                            <DataElementGroupSelect />
                            <DataElementSelect />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            <p>Routine data numerator</p>
                        </TableCell>
                        <TableCell>
                            <NumeratorSelect/>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <p>Routine data denominator</p>
                        </TableCell>
                        <TableCell>
                            <DenominatorSelect/>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            <p>Survel level</p>
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
