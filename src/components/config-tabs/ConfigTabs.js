import { TabBar, Tab } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useRefetchConfigurations } from '../../utils/index.js'
import { ConfigInfoScreen } from '../info-screen/InfoScreen.js'
import styles from './ConfigTabs.module.css'
import { NumeratorRelations } from './numerator-relations/index.js'
import { Numerators } from './numerators/index.js'
import { DenominatorRelations } from './tab-contents/DenominatorRelations.js'
import { Denominators } from './tab-contents/Denominators.js'
import { ExternalDataComparison } from './tab-contents/ExternalDataComparison.js'
import { NumeratorGroups } from './tab-contents/NumeratorGroups.js'
import { NumeratorParameters } from './tab-contents/NumeratorParameters.js'

const configSections = [
    {
        label: 'Numerators',
        renderSection: () => <Numerators />,
    },
    {
        label: 'Numerator groups',
        renderSection: ({ configurations }) => (
            <NumeratorGroups configurations={configurations} />
        ),
    },
    {
        label: 'Numerator relations',
        renderSection: () => <NumeratorRelations />,
    },
    {
        label: 'Numerator quality parameters',
        renderSection: ({ configurations }) => (
            <NumeratorParameters configurations={configurations} />
        ),
    },
    {
        label: 'Denominators',
        renderSection: ({ configurations }) => (
            <Denominators configurations={configurations} />
        ),
    },
    {
        label: 'Denominator relations',
        renderSection: () => <DenominatorRelations />,
    },
    {
        label: 'External data comparison',
        renderSection: ({ configurations }) => (
            <ExternalDataComparison configurations={configurations} />
        ),
    },
]

function Tabs({ configurations }) {
    const refetch = useRefetchConfigurations()
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(null)

    const setSelectedSection = (index) => {
        refetch()
        setSelectedSectionIndex(index)
    }

    return (
        <>
            <TabBar>
                {configSections.map((section, index) => (
                    <Tab
                        key={index}
                        selected={selectedSectionIndex === index}
                        onClick={() => {
                            setSelectedSection(index)
                        }}
                    >
                        {section.label}
                    </Tab>
                ))}
            </TabBar>
            {selectedSectionIndex !== null ? (
                <div className={styles.subContainer}>
                    {configSections[selectedSectionIndex]?.renderSection({
                        configurations: configurations,
                    })}
                </div>
            ) : (
                <ConfigInfoScreen />
            )}
        </>
    )
}

Tabs.propTypes = {
    configurations: PropTypes.object,
}

export default Tabs
