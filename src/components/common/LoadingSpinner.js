import { CenteredContent, CircularLoader, Layer } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

export const LoadingSpinner = ({ noLayer, small }) => {
    return noLayer ? (
        <CenteredContent>
            <CircularLoader small={small} />
        </CenteredContent>
    ) : (
        <Layer>
            <CenteredContent>
                <CircularLoader small={small} />
            </CenteredContent>
        </Layer>
    )
}

LoadingSpinner.propTypes = {
    noLayer: PropTypes.bool,
    small: PropTypes.bool,
}
