import { getNextAvailableCode } from '../getNextAvailableCode.js'

// Action types
export const CREATE_NUMERATOR = 'CREATE_NUMERATOR'
export const UPDATE_NUMERATOR = 'UPDATE_NUMERATOR'
export const CLEAR_NUMERATOR_DATA_MAPPING = 'CLEAR_NUMERATOR_DATA_MAPPING'
export const DELETE_NUMERATOR = 'DELETE_NUMERATOR'
export const CREATE_NUMERATOR_RELATION = 'CREATE_NUMERATOR_RELATION'
export const UPDATE_NUMERATOR_RELATION = 'UPDATE_NUMERATOR_RELATION'
export const DELETE_NUMERATOR_RELATION = 'DELETE_NUMERATOR_RELATION'
export const CREATE_DENOMINATOR_RELATION = 'CREATE_DENOMINATOR_RELATION'
export const UPDATE_DENOMINATOR_RELATION = 'UPDATE_DENOMINATOR_RELATION'
export const DELETE_DENOMINATOR_RELATION = 'DELETE_DENOMINATOR_RELATION'
export const CREATE_DENOMINATOR = 'CREATE_DENOMINATOR'
export const UPDATE_DENOMINATOR = 'UPDATE_DENOMINATOR'
export const DELETE_DENOMINATOR = 'DELETE_DENOMINATOR'

const DEFAULT_NUMERATOR_QUALITY_PARAMETERS = {
    moderateOutlier: 2,
    extremeOutlier: 3,
    consistency: 33,
    trend: 'constant',
    comparison: 'ou',
    missing: 90,
}
const DEFAULT_DATASET_QUALITY_PARAMETERS = {
    comparison: 'ou',
    consistencyThreshold: 33,
    threshold: 90,
    timelinessThreshold: 75,
    trend: 'constant',
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
            const {
                newNumeratorData,
                groupsContainingNumerator,
                dataSetsContainingNumerator,
            } = payload

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

            // 4. See if we need to add any new dataSets
            if (dataSetsContainingNumerator?.length) {
                const prevDataSets = configurations.dataSets
                const newDataSets = [...prevDataSets]
                dataSetsContainingNumerator.forEach((dataSet) => {
                    if (prevDataSets.find(({ id }) => id === dataSet.id)) {
                        return
                    }
                    const newDataSet = {
                        id: dataSet.id,
                        // important: app needs to use `name` property
                        name: dataSet.displayName,
                        periodType: dataSet.periodType,
                        ...DEFAULT_DATASET_QUALITY_PARAMETERS,
                    }
                    // if not there already, add this dataSet
                    // (push is okay bc this is a new object)
                    newDataSets.push(newDataSet)
                })

                newConfigurations = {
                    ...newConfigurations,
                    dataSets: newDataSets,
                }
            }

            newConfigurations = {
                ...newConfigurations,
                lastUpdated: getISOTimestamp(),
            }

            return newConfigurations
        }

        case UPDATE_NUMERATOR: {
            // updatedNumeratorData shouldn't contain `code` or `custom`
            // or other data that shouldn't be editable
            const {
                code,
                updatedNumeratorData,
                groupsContainingNumerator,
                dataSetsContainingNumerator,
            } = payload

            // 1. Update the numerator & the numerators array
            const prevNumerators = configurations.numerators
            const targetIndex = prevNumerators.findIndex(
                (numerator) => numerator.code === code
            )
            const prevNumerator = prevNumerators[targetIndex]
            const updatedNumerator = {
                ...prevNumerator,
                ...updatedNumeratorData,
            }
            const newNumerators = [
                ...prevNumerators.slice(0, targetIndex),
                updatedNumerator,
                ...prevNumerators.slice(targetIndex + 1),
            ]
            let newConfigurations = {
                ...configurations,
                numerators: newNumerators,
            }

            // 2. Update core indicators, if it has changed
            if (updatedNumeratorData.core !== prevNumerator.core) {
                const prevCoreIndicators = configurations.coreIndicators
                const newCoreIndicators = updatedNumerator.core
                    ? [...prevCoreIndicators, code]
                    : prevCoreIndicators.filter((id) => id !== code)
                newConfigurations = {
                    ...newConfigurations,
                    coreIndicators: newCoreIndicators,
                }
            }

            // 3. Update group memberships
            const groupMemberships = new Set(groupsContainingNumerator)
            const newGroups = configurations.groups.map((group) => {
                if (!groupMemberships.has(group.code)) {
                    // make sure this group excludes this numerator
                    const newMembers = group.members.filter((id) => id !== code)
                    return { ...group, members: newMembers }
                }
                // else, make sure this group includes this numerator
                if (!group.members.includes(code)) {
                    return { ...group, members: [...group.members, code] }
                }
                return group
            })

            newConfigurations = {
                ...newConfigurations,
                groups: newGroups,
            }

            // 4. See if we need to add any new dataSets
            if (dataSetsContainingNumerator?.length) {
                const prevDataSets = configurations.dataSets
                const newDataSets = [...prevDataSets]
                dataSetsContainingNumerator.forEach((dataSet) => {
                    if (prevDataSets.find(({ id }) => id === dataSet.id)) {
                        return
                    }
                    const newDataSet = {
                        id: dataSet.id,
                        // important: app needs to use `name` property
                        name: dataSet.displayName,
                        periodType: dataSet.periodType,
                        ...DEFAULT_DATASET_QUALITY_PARAMETERS,
                    }
                    // if not there already, add this dataSet
                    // (push is okay bc this is a new object)
                    newDataSets.push(newDataSet)
                })

                newConfigurations = {
                    ...newConfigurations,
                    dataSets: newDataSets,
                }
            }

            newConfigurations = {
                ...newConfigurations,
                lastUpdated: getISOTimestamp(),
            }

            return newConfigurations
        }

        case CLEAR_NUMERATOR_DATA_MAPPING: {
            const { code } = payload

            const prevNumerators = configurations.numerators
            const targetIndex = prevNumerators.findIndex(
                (numerator) => numerator.code === code
            )
            const updatedNumerator = {
                ...prevNumerators[targetIndex],
                dataID: null,
                dataSetID: [],
                dataElementOperandID: null,
            }

            const newConfigurations = {
                ...configurations,
                numerators: [
                    ...prevNumerators.slice(0, targetIndex),
                    updatedNumerator,
                    ...prevNumerators.slice(targetIndex + 1),
                ],
                lastUpdated: getISOTimestamp(),
            }

            return newConfigurations
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

        case CREATE_DENOMINATOR_RELATION: {
            const prevDenominatorRelations = configurations.denominatorRelations
            //TODO: the old app uses PR as the prefix for denominator relations, i think this should be changed to DR
            const nextAvailableCode = getNextAvailableCode(
                prevDenominatorRelations,
                'PR'
            )
            const newDenominatorRelation = {
                ...payload.newDenominatorRelationInfo,
                code: nextAvailableCode,
            }
            const newConfigurations = {
                ...configurations,
                denominatorRelations: [
                    ...prevDenominatorRelations,
                    newDenominatorRelation,
                ],
                lastUpdated: getISOTimestamp(),
            }
            return newConfigurations
        }

        case UPDATE_DENOMINATOR_RELATION: {
            const { updatedDenominatorRelation, code } = payload
            const prevDenominatorRelations = configurations.denominatorRelations
            const targetIndex = prevDenominatorRelations.findIndex(
                (dr) => dr.code === code
            )
            const newConfigurations = {
                ...configurations,
                denominatorRelations: [
                    ...prevDenominatorRelations.slice(0, targetIndex),
                    updatedDenominatorRelation,
                    ...prevDenominatorRelations.slice(targetIndex + 1),
                ],
                lastUpdated: getISOTimestamp(),
            }
            return newConfigurations
        }

        case DELETE_DENOMINATOR_RELATION: {
            const { code } = payload
            const prevDenominatorRelations = configurations.denominatorRelations
            const targetIndex = prevDenominatorRelations.findIndex(
                (nr) => nr.code === code
            )
            const newConfigurations = {
                ...configurations,
                denominatorRelations: [
                    ...prevDenominatorRelations.slice(0, targetIndex),
                    ...prevDenominatorRelations.slice(targetIndex + 1),
                ],
                lastUpdated: getISOTimestamp(),
            }
            return newConfigurations
        }

        // Denominators
        case CREATE_DENOMINATOR: {
            const prevDenominators = configurations.denominators
            const nextAvailableCode = getNextAvailableCode(
                prevDenominators,
                'P'
            )
            const newDenominatorData = {
                ...payload.newDenominatorData,
                code: nextAvailableCode,
            }
            const newConfigurations = {
                ...configurations,
                denominators: [...prevDenominators, newDenominatorData],
                lastUpdated: getISOTimestamp(),
            }
            return newConfigurations
        }

        case UPDATE_DENOMINATOR: {
            const { code, updatedDenominatorData } = payload
            const prevDenominators = configurations.denominators
            const targetIndex = prevDenominators.findIndex(
                (dn) => dn.code === code
            )
            const prevDenominator = prevDenominators[targetIndex]
            const updatedDenominator = {
                ...prevDenominator,
                ...updatedDenominatorData,
            }

            const newConfigurations = {
                ...configurations,
                denominators: [
                    ...prevDenominators.slice(0, targetIndex),
                    updatedDenominator,
                    ...prevDenominators.slice(targetIndex + 1),
                ],
                lastUpdated: getISOTimestamp(),
            }
            return newConfigurations
        }

        case DELETE_DENOMINATOR: {
            const { code } = payload
            const prevDenominators = configurations.denominators
            const targetIndex = prevDenominators.findIndex(
                (dn) => dn.code === code
            )
            const newConfigurations = {
                ...configurations,
                denominators: [
                    ...prevDenominators.slice(0, targetIndex),
                    ...prevDenominators.slice(targetIndex + 1),
                ],
                lastUpdated: getISOTimestamp(),
            }
            return newConfigurations
        }

        default:
            throw new Error(`Action type '${type}' not valid`)
    }
}
