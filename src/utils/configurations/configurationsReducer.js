import { getNextAvailableCode } from '../getNextAvailableCode.js'

export const CREATE_NUMERATOR_RELATION = 'CREATE_NUMERATOR_RELATION'
export const UPDATE_NUMERATOR_RELATION = 'UPDATE_NUMERATOR_RELATION'
export const DELETE_NUMERATOR_RELATION = 'DELETE_NUMERATOR_RELATION'

/**
 * Adds a current lastUpdated and applies keys/values in
 * `updates` object to the new configurations object
 */
const getNewConfigurations = (configurations, updates) => ({
    ...configurations,
    ...updates,
    lastUpdated: new Date().toISOString(),
})

/**
 * This function is part of an action/reducer pattern
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
            const newConfigurations = getNewConfigurations(configurations, {
                numeratorRelations: [
                    ...prevNumeratorRelations,
                    newNumeratorRelation,
                ],
            })
            return newConfigurations
        }

        case UPDATE_NUMERATOR_RELATION: {
            const { updatedNumeratorRelation, code } = payload
            // todo: keep in these checks?
            if (!code) {
                throw new Error(
                    '`code` is required to update the item ' +
                        updatedNumeratorRelation.name
                )
            }
            const prevNumeratorRelations = configurations.numeratorRelations
            const targetIndex = prevNumeratorRelations.findIndex(
                (nr) => nr.code === code
            )
            if (targetIndex === -1) {
                throw new Error(`Item with code ${code} not found`)
            }
            const newConfigurations = getNewConfigurations(configurations, {
                numeratorRelations: [
                    ...prevNumeratorRelations.slice(0, targetIndex),
                    updatedNumeratorRelation,
                    ...prevNumeratorRelations.slice(targetIndex + 1),
                ],
            })
            return newConfigurations
        }

        case DELETE_NUMERATOR_RELATION: {
            const { code } = payload
            const prevNumeratorRelations = configurations.numeratorRelations
            const targetIndex = prevNumeratorRelations.findIndex(
                (nr) => nr.code === code
            )
            const newConfigurations = getNewConfigurations(configurations, {
                numeratorRelations: [
                    ...prevNumeratorRelations.slice(0, targetIndex),
                    ...prevNumeratorRelations.slice(targetIndex + 1),
                ],
            })
            return newConfigurations
        }

        default:
            throw new Error(`Action type '${type}' not valid`)
    }
}
