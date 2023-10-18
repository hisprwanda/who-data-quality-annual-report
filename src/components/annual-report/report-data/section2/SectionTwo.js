import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { calculateSection2 } from './section2Calculations.js'
import { useFetchSectionTwoData } from './useFetchSectionTwoData.js'

export const SectionTwo = ({ reportParameters }) => {
    const { loading, data, error, refetch } = useFetchSectionTwoData()

    useEffect(() => {
        // this is hardcoded until we address period selection
        const currentPeriod = {
            id: '2022',
            startDate: '2022-01-01',
            endDate: '2022-12-31',
        }

        const oldDataElements = [
            'ieThL7l107F',
            'RvArfQFKdXe',
            'XeRBhx8avQY',
            'YRJjIr5tuD6',
            'YAAmrY2RPbZ',
            'DvUwQScvSpc',
        ]

        const variables = {
            ...reportParameters,
            currentPeriod,
            dataElements: oldDataElements,
        }

        refetch({ variables })
    }, [reportParameters]) // needs to include refetch, which needs to be made stable

    if (loading) {
        return <span>loading</span>
    }

    if (error) {
        return <span>error</span>
    }

    if (data) {
        return (
            <span>
                {JSON.stringify(
                    calculateSection2({
                        section2Response: data,
                        mappedConfigurations:
                            reportParameters.mappedConfigurations,
                        periods: reportParameters.periods,
                    })
                )}
            </span>
        )
    }

    return null
}

SectionTwo.propTypes = {
    reportParameters: PropTypes.object,
}
