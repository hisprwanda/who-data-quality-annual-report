import { CenteredContent, CircularLoader, Layer } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

export const LoadingSpinner = ({ noLayer }) => {
    return noLayer ? (
        <CenteredContent>
            <CircularLoader />
        </CenteredContent>
    ) : (
        <Layer>
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        </Layer>
    )
}

LoadingSpinner.propTypes = {
    noLayer: PropTypes.bool,
}
