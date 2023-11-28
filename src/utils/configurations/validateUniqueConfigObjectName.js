/**
 * Returns true if the newConfigName is unique accross the particular configuration object & false if not
 * This check can be done for objects that are created with a name
 * i.e: numerators, numerator groups, numerator relations, denominator relations, and external data comparisons
 */
export function validateUniqueConfigObjectName(
    newObjectName,
    objectType,
    configurations
) {
    switch (objectType) {
        // case 'numerators': {
        // // check if there are any numerators
        // if (
        //     !configurations.numerators ||
        //     configurations.numerators.length === 0
        // ) {
        //     return true
        // }
        // // check if the new numerator name is unique
        // const existingNumerator = configurations.numerators.find(
        //     (numerator) =>
        //         numerator.name.toLowerCase() === newObjectName.toLowerCase()
        // )
        // if (existingNumerator) {
        //     return false
        // }
        // return true
        // }
        case 'groups': {
            // check if there are any groups
            if (!configurations.groups || configurations.groups.length === 0) {
                return true
            }
            // check if the new group name is unique
            const existingGroup = configurations.groups.find(
                (group) =>
                    group.name.toLowerCase() === newObjectName.toLowerCase()
            )
            if (existingGroup) {
                return false
            }
            return true
        }
        // case 'numeratorRelations': {
        // // check if there are any numerator relations
        // if (
        //     !configurations.numeratorRelations ||
        //     configurations.numeratorRelations.length === 0
        // ) {
        //     return true
        // }
        // // check if the new numerator relation name is unique
        // const existingNumeratorRelation =
        //     configurations.numeratorRelations.find(
        //         (numeratorRelation) =>
        //             numeratorRelation.name.toLowerCase() ===
        //             newObjectName.toLowerCase()
        //     )
        // if (existingNumeratorRelation) {
        //     return false
        // }
        // return true
        // }
        default:
            return true
    }
}
