/**
 * Returns 'false' if all numerators lack data IDs
 * (and 'true' if any one has been mapped to a data ID)
 */
export const checkNumeratorMappings = (configurations) => {
    return configurations?.numerators.some((numerator) =>
        Boolean(numerator.dataID)
    )
}
