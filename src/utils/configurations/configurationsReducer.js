import { getNextAvailableCode } from '../getNextAvailableCode.js'

// Action types
export const CREATE_NUMERATOR = 'CREATE_NUMERATOR'
export const UPDATE_NUMERATOR = 'UPDATE_NUMERATOR'
export const CLEAR_NUMERATOR_DATA_MAPPING = 'CLEAR_NUMERATOR_DATA_MAPPING'
export const DELETE_NUMERATOR = 'DELETE_NUMERATOR'
export const CREATE_NUMERATOR_RELATION = 'CREATE_NUMERATOR_RELATION'
export const UPDATE_NUMERATOR_RELATION = 'UPDATE_NUMERATOR_RELATION'
export const DELETE_NUMERATOR_RELATION = 'DELETE_NUMERATOR_RELATION'

const DEFAULT_NUMERATOR_QUALITY_PARAMETERS = {
    moderateOutlier: 2,
    extremeOutlier: 3,
    consistency: 33,
    trend: 'constant',
    comparison: 'ou',
    missing: 90,
}

const getISOTimestamp = () => new Date().toISOString()

/**
 * This function is part of an action/reducer pattern:
 * It receives two args: 1) the previous configurations object and
 * 2) an arbitrary `data` object sent when calling `dispatch`
 *
 * The `data` object should supply an action `type` that should correspond
 * to a user action, and the payload should contain the minimum necessary
 * information to update the `configurations` object as needed.
 *
 * This function should be "pure": it should only ever copy things and return
 * a _new_ object; it shouldn't modify and objects or arrays in it
 *
 * While I didn't end up using useReducer directly, it follows the same pattern
 * Read more here: https://react.dev/reference/react/useReducer
 */
export function configurationsReducer(configurations, { type, payload }) {
    switch (type) {
        // Numerators
        case CREATE_NUMERATOR: {
            const { newNumeratorData, groupsContainingNumerator } = payload

            // 1. Add to numerators list
            const prevNumerators = configurations.numerators
            // Custom numerators use 'C' prefix; default use 'D'
            const nextAvailableCode = getNextAvailableCode(prevNumerators, 'C')
            const newNumerator = {
                ...newNumeratorData,
                ...DEFAULT_NUMERATOR_QUALITY_PARAMETERS,
                code: nextAvailableCode,
                custom: true, // All new numerators will be custom
            }
            let newConfigurations = {
                ...configurations,
                numerators: [...prevNumerators, newNumerator],
                lastUpdated: getISOTimestamp(),
            }

            // 2. Add to core indicators if core=true
            if (newNumeratorData.core) {
                newConfigurations = {
                    ...newConfigurations,
                    coreIndicators: [
                        ...configurations.coreIndicators,
                        newNumerator.code,
                    ],
                }
            }

            // 3. Add to selected groups
            if (groupsContainingNumerator?.length > 0) {
                const newGroups = configurations.groups.map((group) => {
                    if (!groupsContainingNumerator.includes(group.code)) {
                        return group
                    }
                    return {
                        ...group,
                        members: [...group.members, newNumerator.code],
                    }
                })
                newConfigurations = {
                    ...newConfigurations,
                    groups: newGroups,
                }
            }

            return newConfigurations
        }

        case UPDATE_NUMERATOR: {
            console.log('todo: update numerator')
            return configurations
        }

        case CLEAR_NUMERATOR_DATA_MAPPING: {
            console.log('todo: clear numerator data mapping')
            return configurations
        }

        case DELETE_NUMERATOR: {
            const { code } = payload

            // 1. Remove from numerators
            const prevNumerators = configurations.numerators
            const targetIndex = prevNumerators.findIndex(
                (num) => num.code === code
            )
            const newNumerators = [
                ...prevNumerators.slice(0, targetIndex),
                ...prevNumerators.slice(targetIndex + 1),
            ]

            // 2. Remove from core indicators
            const newCoreIndicators = configurations.coreIndicators.filter(
                (id) => id !== code
            )

            // 3. Remove from groups
            const newGroups = configurations.groups.map((group) => ({
                ...group,
                members: group.members.filter((id) => id !== code),
            }))

            // todo: 4. Remove from numerator relations? See what old app does
            // todo: 5. Remove from external relations? " "

            const newConfigurations = {
                ...configurations,
                numerators: newNumerators,
                coreIndicators: newCoreIndicators,
                groups: newGroups,
                lastUpdated: getISOTimestamp(),
            }

            return newConfigurations
        }

        // Numerator relations
        case CREATE_NUMERATOR_RELATION: {
            const prevNumeratorRelations = configurations.numeratorRelations
            const nextAvailableCode = getNextAvailableCode(
                prevNumeratorRelations,
                'R'
            )
            const newNumeratorRelation = {
                ...payload.newNumeratorRelation,
                code: nextAvailableCode,
            }
            const newConfigurations = {
                ...configurations,
                numeratorRelations: [
                    ...prevNumeratorRelations,
                    newNumeratorRelation,
                ],
                lastUpdated: getISOTimestamp(),
            }
            return newConfigurations
        }

        case UPDATE_NUMERATOR_RELATION: {
            const { updatedNumeratorRelation, code } = payload
            const prevNumeratorRelations = configurations.numeratorRelations
            const targetIndex = prevNumeratorRelations.findIndex(
                (nr) => nr.code === code
            )
            const newConfigurations = {
                ...configurations,
                numeratorRelations: [
                    ...prevNumeratorRelations.slice(0, targetIndex),
                    updatedNumeratorRelation,
                    ...prevNumeratorRelations.slice(targetIndex + 1),
                ],
                lastUpdated: getISOTimestamp(),
            }
            return newConfigurations
        }

        case DELETE_NUMERATOR_RELATION: {
            const { code } = payload
            const prevNumeratorRelations = configurations.numeratorRelations
            const targetIndex = prevNumeratorRelations.findIndex(
                (nr) => nr.code === code
            )
            const newConfigurations = {
                ...configurations,
                numeratorRelations: [
                    ...prevNumeratorRelations.slice(0, targetIndex),
                    ...prevNumeratorRelations.slice(targetIndex + 1),
                ],
                lastUpdated: getISOTimestamp(),
            }
            return newConfigurations
        }

        default:
            throw new Error(`Action type '${type}' not valid`)
    }
}
