import denominatorTypes from '../data/denominatorTypes.json'

// TODO: in the future, pass the data from a global state or context api

export const getAllDenominatorType = () => {
    return denominatorTypes
}
export const getDenominatorType = (type) => {
    const denominatorType = denominatorTypes.find(
        (denominator) => denominator.value == type
    )
    return denominatorType
}

//TODO: merge these methods that find objects and make them generic
export const getDenominatorRelations = (denominators, code) => {
    const denominatorObj = denominators.find(
        (denominator) => denominator.code == code
    )
    if (denominatorObj) {
        return denominatorObj.name
    }
}

// filter denominators by type but where denominator == type
export const filterDenominatorsByType = (denominators, type) => {
    return denominators.filter((denominator) => denominator.type == type)
}

export const getDenominatorNameByCode = (denominators, code) => {
    const denominatorObj = denominators.find(
        (denominator) => denominator.code == code
    )
    if (denominatorObj) {
        return denominatorObj.name
    }
}
