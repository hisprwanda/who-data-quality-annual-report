import { useDataQuery } from '@dhis2/app-runtime'
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
    TableFoot,
    IconAdd16,
} from '@dhis2/ui'
import React, { useState, useCallback } from 'react'
import {
    useConfigurations,
    useConfigurationsDispatch,
    CREATE_EXTERNAL_RELATION,
} from '../../../utils/index.js'
import { EditExternalDataComparisonModel } from './EditExternalDataComparisonModel.js'
import { ExternalDataComparisonTableItem } from './ExternalDataComparisonTableItem.js'

const ORG_UNITS_LEVELS_QUERY = {
    orgUnitLevels: {
        resource: 'organisationUnitLevels',
        params: {
            paging: false,
            fields: ['id', 'displayName', 'level'],
            order: 'level:asc',
        },
    },
}

const AddExternalRelationButton = () => {
    const [addNewModalOpen, setAddNewModalOpen] = useState(false)
    const dispatch = useConfigurationsDispatch()

    const openModal = useCallback(() => setAddNewModalOpen(true), [])
    const closeModal = useCallback(() => setAddNewModalOpen(false), [])

    const addExternalRelation = useCallback(
        (newExternalRelation) =>
            dispatch({
                type: CREATE_EXTERNAL_RELATION,
                payload: { newExternalRelation },
            }),
        [dispatch]
    )

    return (
        <>
            <Button primary icon={<IconAdd16 />} onClick={openModal}>
                Add External Relation
            </Button>
            {addNewModalOpen && (
                <EditExternalDataComparisonModel
                    onSave={addExternalRelation}
                    onClose={closeModal}
                />
            )}
        </>
    )
}

export const ExternalDataComparison = () => {
    const configurations = useConfigurations()
    const externalRelations = configurations.externalRelations
    let ouLevelData = null
    const { data } = useDataQuery(ORG_UNITS_LEVELS_QUERY)

    if (data) {
        ouLevelData = data
    }

    return (
        <div>
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
                        {externalRelations ? (
                            externalRelations.map((externalRelation) => (
                                <ExternalDataComparisonTableItem
                                    externalRelation={externalRelation}
                                    ouLevelData={ouLevelData}
                                    key={externalRelation.code}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell>
                                    No external relations found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFoot>
                        <TableRow>
                            <TableCell colSpan="7">
                                <ButtonStrip end>
                                    <AddExternalRelationButton />
                                </ButtonStrip>
                            </TableCell>
                        </TableRow>
                    </TableFoot>
                </Table>
            </div>
        </div>
    )
}
