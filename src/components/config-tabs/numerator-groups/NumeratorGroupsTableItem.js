import React from 'react';
import { getNumeratorsInGroup } from '../../../utils/numeratorsMetadataData';
import { ButtonStrip, Button, IconSubtractCircle16,
    TableCell,
    TableRow
} from '@dhis2/ui';


export const NumeratorGroupsTableItem = ({ numerators, group }) => {

    // get numerators in group and display them in a table row with a delete button for each numerator
    const numeratorsInGroup = getNumeratorsInGroup(numerators, group)
    
    return (
        <>
            {numeratorsInGroup.length > 0 ? (
                numeratorsInGroup.map((numerator, key) => (
                    <TableRow key={key}>
                        <TableCell>{numerator.name}</TableCell>
                        <TableCell>
                            <ButtonStrip end>
                            <Button
                                name="Primary button"
                                small
                                
                                onClick={() =>
                                    onDeleteNumerator(
                                        group.code,
                                        numerator.code
                                    )
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
                ))
            ) : (
                <TableRow>
                    <TableCell>No numerators added, please add them.</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            )}
        </>
    );
};

