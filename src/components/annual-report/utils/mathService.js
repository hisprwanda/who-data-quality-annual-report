import regression from 'regression'

export const getRoundedValue = (val, places) => {
    if (isNaN(Number(val))) {
        return val
    }

    return Math.round(val * Math.pow(10, places)) / Math.pow(10, places)
}

const getSum = (valuesArray) => {
    return valuesArray.reduce((total, val) => {
        if (!isNaN(Number(val))) {
            total += Number(val)
        }
        return total
    }, 0)
}

export const getMean = (valuesArray) => {
    if (valuesArray.length !== 0) {
        return getSum(valuesArray) / valuesArray.length
    }
    console.log('could not calculate average')
    return undefined // what is appropriate to return here?
}

// sample variance
const getVariance = (valuesArray) => {
    const mean = getMean(valuesArray)
    const varianceValues = valuesArray.map((val) => Math.pow(val - mean, 2))
    return getSum(varianceValues) / Math.max(varianceValues.length - 1, 1)
}

// sample standard deviation
const getStandardDeviation = (valuesArray) => {
    const variance = getVariance(valuesArray)
    return Math.pow(variance, 0.5)
}

const getMedian = (valuesArray) => {
    const sortedArray = [...valuesArray].sort((a, b) => a - b)
    const midpoint = Math.floor(sortedArray.length / 2)

    return sortedArray.length % 2 !== 0
        ? sortedArray[midpoint]
        : getMean([sortedArray[midpoint - 1], sortedArray[midpoint]])
}

const getAbsoluteDeviations = (valuesArray) => {
    const median = getMedian(valuesArray)
    return valuesArray.map((val) => Math.abs(val - median))
}

// median absolute deviation
const getMAD = (valuesArray) => getMedian(getAbsoluteDeviations(valuesArray))

// mean absolute deviation
const getMeanAD = (valuesArray) => getMean(getAbsoluteDeviations(valuesArray))

const getSDOutliersCounts = ({
    valuesArray,
    extremeOutlier,
    moderateOutlier,
}) => {
    const sd = getStandardDeviation(valuesArray)
    const mean = getMean(valuesArray)
    const zScores = valuesArray.map((val) => (val - mean) / sd)
    return {
        extremeOutliers: zScores.filter(
            (zScore) => Math.abs(zScore) > extremeOutlier
        ).length,
        moderateOutliers: zScores.filter(
            (zScore) => Math.abs(zScore) > moderateOutlier
        ).length,
    }
}

const getModifiedZOutlierCount = ({ valuesArray, modifiedZOutlier }) => {
    const median = getMedian(valuesArray)
    let modifiedZScores = []
    const MAD = getMAD(valuesArray)
    if (MAD !== 0) {
        modifiedZScores = valuesArray.map(
            (val) => (val - median) / (1.486 * MAD)
        )
    } else {
        const meanAD = getMeanAD(valuesArray)
        modifiedZScores = valuesArray.map(
            (val) => (val - median) / (1.253314 * meanAD)
        )
    }
    return modifiedZScores.filter((val) => Math.abs(val) > modifiedZOutlier)
        .length
}

export const getStats = ({
    valuesArray,
    extremeOutlier,
    moderateOutlier,
    modifiedZOutlier,
}) => {
    // make sure all values are numbers
    const numbersArray = valuesArray
        .filter((val) => !isNaN(Number(val)))
        .map((val) => Number(val))
    return {
        mean: getMean(numbersArray),
        standardDeviation: getStandardDeviation(numbersArray),
        MAD: getMAD(numbersArray),
        meanAD: getMeanAD(numbersArray),
        count: numbersArray.length,
        ...getSDOutliersCounts({
            valuesArray: numbersArray,
            extremeOutlier,
            moderateOutlier,
        }),
        modifiedZOutliers: getModifiedZOutlierCount({
            valuesArray: numbersArray,
            modifiedZOutlier,
        }),
    }
}

// assumes array of [x,y] values
export const getForecastValue = ({ pointsArray, forecastX }) => {
    if (pointsArray.length <= 1) {
        return undefined
    }
    const forecast = regression.linear(pointsArray)
    return forecast.equation[0] * forecastX + forecast.equation[1]
}
