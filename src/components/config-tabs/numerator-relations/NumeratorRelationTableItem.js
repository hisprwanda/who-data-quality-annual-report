import {
    Button,
    TableCell,
    TableRow,
    IconDelete16,
    IconEdit16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    getNumeratorNameByCode,
    getRelationType,
} from '../../../utils/numeratorsMetadataData.js'

export function NumeratorRelationTableItem({
    configurations,
    numeratorRelation: relation,
}) {
    // some of these values are hard to memoize effectively:
    // they depend on the large configurations object
    const numeratorAName = React.useMemo(
        () => getNumeratorNameByCode(configurations.numerators, relation.A),
        [configurations.numerators, relation.A]
    )
    const numeratorBName = React.useMemo(
        () => getNumeratorNameByCode(configurations.numerators, relation.B),
        [configurations.numerators, relation.B]
    )
    const relationType = React.useMemo(
        () => getRelationType(relation.type),
        [relation.type]
    )

    return (
        <TableRow>
            <TableCell>{relation.name}</TableCell>
            <TableCell>{numeratorAName}</TableCell>
            <TableCell>{numeratorBName}</TableCell>
            <TableCell>{relationType.displayName}</TableCell>
            <TableCell>{relation.criteria}</TableCell>
            <TableCell>{relationType.thresholdDescription}</TableCell>
            <TableCell>{relationType.description}</TableCell>
            <TableCell>
                <Button
                    icon={<IconEdit16 />}
                    onClick={() => alert('todo: edit')}
                >
                    Edit
                </Button>
                <Button
                    destructive
                    icon={<IconDelete16 />}
                    onClick={() => alert('todo: delete')}
                >
                    Delete
                </Button>
            </TableCell>
        </TableRow>
    )
}
NumeratorRelationTableItem.propTypes = {
    configurations: PropTypes.object,
    numeratorRelation: PropTypes.object,
}
