import { getNextAvailableCode } from '../getNextAvailableCode.js'

// Action types

// numerator groups
export const CREATE_NUMERATOR_GROUP = 'CREATE_NUMERATOR_GROUP'
export const UPDATE_NUMERATOR_GROUP = 'UPDATE_NUMERATOR_GROUP'
export const DELETE_NUMERATOR_GROUP = 'DELETE_NUMERATOR_GROUP'

// numerator relations
export const CREATE_NUMERATOR_RELATION = 'CREATE_NUMERATOR_RELATION'
export const UPDATE_NUMERATOR_RELATION = 'UPDATE_NUMERATOR_RELATION'
export const DELETE_NUMERATOR_RELATION = 'DELETE_NUMERATOR_RELATION'

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
        // Numerator Groups
        case CREATE_NUMERATOR_GROUP: {
            const prevGroups = configurations.groups
            const nextAvailableCode = getNextAvailableCode(prevGroups, 'G')
            const newGroup = {
                ...payload.newGroup,
                code: nextAvailableCode,
            }
            const newConfigurations = {
                ...configurations,
                groups: [...prevGroups, newGroup],
                lastUpdated: getISOTimestamp(),
            }
            return newConfigurations
        }

        case UPDATE_NUMERATOR_GROUP: {
            const { updatedGroup, code } = payload
            const prevGroups = configurations.groups
            const targetIndex = prevGroups.findIndex((g) => g.code === code)
            const newConfigurations = {
                ...configurations,
                groups: [
                    ...prevGroups.slice(0, targetIndex),
                    updatedGroup,
                    ...prevGroups.slice(targetIndex + 1),
                ],
                lastUpdated: getISOTimestamp(),
            }
            return newConfigurations
        }

        case DELETE_NUMERATOR_GROUP: {
            const { code } = payload
            const prevGroups = configurations.groups
            const targetIndex = prevGroups.findIndex((g) => g.code === code)
            const newConfigurations = {
                ...configurations,
                groups: [
                    ...prevGroups.slice(0, targetIndex),
                    ...prevGroups.slice(targetIndex + 1),
                ],
                lastUpdated: getISOTimestamp(),
            }
            return newConfigurations
        }

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
