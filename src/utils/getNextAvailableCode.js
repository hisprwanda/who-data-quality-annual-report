/**
 * Returns 1 higher than the highest code,
 * e.g. R1, R2, R5 => R6
 */
export const getNextAvailableCode = (itemList, prefix) => {
    // parse codes: check prefix and extract number
    const regex = new RegExp(`^${prefix}(\\d+)$`)
    const highestCodeIndex = itemList.reduce((highestIndex, item) => {
        const match = item.code.match(regex)
        return match ? Math.max(Number(match[1]), highestIndex) : highestIndex
    }, 0)
    return `${prefix}${highestCodeIndex + 1}`
}
