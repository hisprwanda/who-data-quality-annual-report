import { Button, IconSubtractCircle16, TableCell, TableRow } from '@dhis2/ui'
import React from 'react'
import relationTypes from '../data/relationTypes.json'

export const getNumeratorMemberGroups = (configurations, code) => {
    const groups = configurations.groups
    const memberGroups = []
    for (const key in groups) {
        const currentGroup = groups[key]
        for (const key in currentGroup.members) {
            const currentMember = currentGroup.members[key]
            if (currentMember === code) {
                memberGroups.push(currentGroup)
            }
        }
    }

    return memberGroups
}

export const getNumeratorDataset = (configurations, dataSetID) => {
    const datasets = configurations.dataSets

    for (const key in datasets) {
        const dataset = datasets[key]
        if (dataset.id === dataSetID) {
            return dataset.name
        }
    }
}

export const getNumeratorDataElement = (mappedNumerators, dataID) => {
    for (const key in mappedNumerators) {
        const numerator = mappedNumerators[key]
        if (numerator.id === dataID) {
            return numerator.displayName
        }
    }
}

export const getNumeratorsInGroup = (numerators, group, onDeleteNumerator) => {
    const numeratorsInGroup = []

    for (const key in numerators) {
        const numerator = numerators[key]
        if (group.members.includes(numerator.code)) {
            numeratorsInGroup.push(numerator)
        }
    }

    return (
        <>
            {numeratorsInGroup.length > 0 ? (
                numeratorsInGroup.map((numerator, key) => (
                    <TableRow key={key}>
                        <TableCell>{numerator.name}</TableCell>
                        <TableCell>
                            <Button
                                name="Primary button"
                                onClick={() =>
                                    onDeleteNumerator(
                                        group.code,
                                        numerator.code
                                    )
                                }
                                destructive
                                basic
                                button
                                value="default"
                                icon={<IconSubtractCircle16 />}
                            >
                                {' '}
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell>No numerators added, please add them.</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            )}
        </>
    )
}

export const getNumeratorRelations = (numerators, code) => {
    const numeratorObj = numerators.find((numerator) => numerator.code == code)
    if (numeratorObj) {
        return numeratorObj.name
    }
}

export const getRelationType = (type) => {
    const relationType = relationTypes.find((relation) => relation.code == type)
    return relationType
}

export const makeOutlierOptions = () => {
    var opts = []
    opts.push({ val: '-1', label: 'Ignore' })
    for (let i = 1.5; i <= 4.05; i += 0.1) {
        opts.push({
            val: (Math.round(10 * i) / 10).toString(),
            label: (Math.round(10 * i) / 10).toString(),
        })
    }
    return opts
}

// since the Transfer UI only brings only the id of the selected metadata i.e: ['eUVXvuBvfpd'] for a selected group
// this function is used to get the original objects with more details to be used in components that require labels and values
export const filterSelectedMetadata = (
    allMetadataObjects,
    selectedMetadataObjects
) => {
    const filteredMetadataObjects = allMetadataObjects.filter(
        (object) => selectedMetadataObjects.indexOf(object.value) !== -1
    )
    return filteredMetadataObjects
}
