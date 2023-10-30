export const getRoundedValue = (val, places) => {
    if (isNaN(Number(val))) {
        return val
    }

    return Math.round(val * Math.pow(10, places)) / Math.pow(10, places)
}
