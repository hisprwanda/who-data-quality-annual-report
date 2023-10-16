import { Button } from '@dhis2/ui'
import React from 'react'
import * as mappedConfigurations from './mappedConfigurations.json'
import { calculateSection2 } from './section2Calculations.js'
import { useFetchSectionTwoData } from './useFetchSectionTwoData.js'

export const SectionTwo = () => {
    const variables = {
        periods: ['2022', '2021', '2020', '2019'],
        currentPeriod: {
            id: '2022',
            startDate: '2022-01-01',
            endDate: '2022-12-31',
        },
        dataSets: ['dONyxVsQyGS', 'rGDF7yDdhnj', 'YmRjo8j3F3M', 'GhdP8W2GorO'],
        dataElements: [
            'ieThL7l107F',
            'RvArfQFKdXe',
            'XeRBhx8avQY',
            'YRJjIr5tuD6',
            'YAAmrY2RPbZ',
            'DvUwQScvSpc',
        ],
        orgUnits: ['lZsCb6y0KDX'],
        orgUnitLevel: 'LEVEL-2',
        mappedConfigurations,
    }

    const { loading, data, error, refetch } = useFetchSectionTwoData()

    if (loading) {
        return <span>loading</span>
    }

    if (error) {
        return <span>error</span>
    }

    if (data) {
        return (
            <span>
                {JSON.stringify(calculateSection2({ section2Response: data }))}
            </span>
        )
    }

    return (
        <Button
            primary
            onClick={() => {
                refetch({ variables })
                // generateReport()
            }}
        >
            Generate
        </Button>
    )
}
