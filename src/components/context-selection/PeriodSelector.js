import { SelectorBarItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

export const PeriodSelector = ({ selectedPeriodInfo }) => {
    const [open, setOpen] = useState(false)
    return (
        <SelectorBarItem
            label="Period"
            value={selectedPeriodInfo.periodID}
            open={open}
            setOpen={setOpen}
            noValueMessage={'Choose a period'}
        ></SelectorBarItem>
    )
}

PeriodSelector.propTypes = {
    selectedPeriodInfo: PropTypes.object,
}
