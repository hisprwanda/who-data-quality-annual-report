import i18n from '@dhis2/d2-i18n'
import { Button, TabBar, Tab } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRefetchConfigurations } from '../../utils/index.js'
import { ConfigInfoScreen } from '../info-screen/InfoScreen.js'
import styles from './ConfigTabs.module.css'
import { Denominators } from './denominators/index.js'
import { ExternalDataComparison } from './external-data-comparison/index.js'
import { NumeratorGroups } from './numerator-groups/NumeratorGroups.js'
import { NumeratorRelations } from './numerator-relations/index.js'
import { Numerators } from './numerators/index.js'
import { DenominatorRelations } from './tab-contents/DenominatorRelations.js'
import { NumeratorParameters } from './tab-contents/NumeratorParameters.js'

const ExitConfigurationsButton = () => (
    <div className={styles.exitConfigurationsContainer}>
        <div className={styles.exitConfigurationsButtonContainer}>
            <Link to="/">
                <Button small>{i18n.t('Exit configurations')}</Button>
            </Link>
        </div>
    </div>
)

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
                <ExitConfigurationsButton />
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
