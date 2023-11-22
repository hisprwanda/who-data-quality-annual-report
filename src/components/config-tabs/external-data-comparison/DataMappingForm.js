import { TableRow, TableCell, Table, TableBody } from '@dhis2/ui'
import React from 'react'
import { DataElementGroupSelect } from '../numerators/DataElementGroupsSelect.js'
import { DataElementSelect } from '../numerators/DataElementSelect.js'
import { DataElementTypeRadios } from '../numerators/DataElementTypeRadios.js'
import styles from './DataMappingForm.module.css'
import { DenominatorSelect } from './DenominatorSelect.js'
import { NumeratorSelect } from './NumeratorSelect.js'
import { OrgUnitLevelSelect } from './OrgUnitLevelSelect.js'

export const DataMappingFormSection = () => {
    return (
        <div className={styles.mainContainer}>
            {/* <DataTypeRadios /> */}
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Survey/external indicator</TableCell>
                        <TableCell>
                            <DataElementTypeRadios />
                            <DataElementGroupSelect />
                            <DataElementSelect />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>Routine data numerator</TableCell>
                        <TableCell>
                            <NumeratorSelect />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Routine data denominator</TableCell>
                        <TableCell>
                            <DenominatorSelect />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell>Survel level</TableCell>
                        <TableCell>
                            <OrgUnitLevelSelect />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}
