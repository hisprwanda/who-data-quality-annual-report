import {
    ButtonStrip,
    Button,
    IconSubtractCircle16,
    TableCell,
    TableRow,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo, useCallback } from 'react'
import {
    UPDATE_NUMERATOR_GROUP,
    useConfigurationsDispatch,
} from '../../../utils/index.js'
import { getNumeratorsInGroup } from '../../../utils/numeratorsMetadataData.js'

export const NumeratorGroupsTableItem = ({ numerators, group }) => {
    const dispatch = useConfigurationsDispatch()

    const numeratorsInGroup = useMemo(
        () => getNumeratorsInGroup(numerators, group),
        [numerators, group]
    )

    const onRemoveNumerator = useCallback(
        (group, numerator) => {
            const newGroup = {
                ...group,
                members: group.members.filter(
                    (member) => member !== numerator.code
                ),
            }

            dispatch({
                type: UPDATE_NUMERATOR_GROUP,
                payload: { updatedGroup: newGroup, code: group.code },
            })
        },
        [dispatch]
    )

    // check if there are no numerators in group
    if (numeratorsInGroup.length === 0) {
        return (
            <TableRow>
                <TableCell>No numerators added, please add them.</TableCell>
            </TableRow>
        )
    }

    return (
        <>
            {numeratorsInGroup.map((numerator, key) => (
                <TableRow key={key}>
                    <TableCell>{numerator.name}</TableCell>
                    <TableCell>
                        <ButtonStrip end>
                            <Button
                                name="Primary button"
                                small
                                onClick={() =>
                                    onRemoveNumerator(group, numerator)
                                }
                                secondary
                                basic
                                button
                                value="default"
                                icon={<IconSubtractCircle16 />}
                            >
                                {' '}
                                Remove
                            </Button>
                        </ButtonStrip>
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}

NumeratorGroupsTableItem.propTypes = {
    group: PropTypes.object,
    numerators: PropTypes.array,
}
