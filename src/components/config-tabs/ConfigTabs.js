import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useRefetchConfigurations } from '../../utils/index.js'
import styles from './ConfigTabs.module.css'
import { ExternalDataComparison } from './external-data-comparison/ExternalDataComparison.js'
import { NumeratorRelations } from './numerator-relations/index.js'
import { Numerators } from './numerators/index.js'
import { DenominatorRelations } from './tab-contents/DenominatorRelations.js'
import { Denominators } from './tab-contents/Denominators.js'
import { NumeratorGroups } from './tab-contents/NumeratorGroups.js'
import { NumeratorParameters } from './tab-contents/NumeratorParameters.js'

function Tabs({ configurations, mappedNumerators }) {
    const [toggleState, setToggleState] = useState(1)
    const refetch = useRefetchConfigurations()

    const toggleTab = (index) => {
        refetch()
        setToggleState(index)
    }

    return (
        <div className={styles.container}>
            <div className={styles.blocTabs}>
                <button
                    className={
                        toggleState === 1 ? styles.activeTabs : styles.tabs
                    }
                    onClick={() => toggleTab(1)}
                >
                    {' '}
                    Numerators
                </button>
                <button
                    className={
                        toggleState === 2 ? styles.activeTabs : styles.tabs
                    }
                    onClick={() => toggleTab(2)}
                >
                    {' '}
                    Numerator Groups
                </button>
                <button
                    className={
                        toggleState === 3 ? styles.activeTabs : styles.tabs
                    }
                    onClick={() => toggleTab(3)}
                >
                    {' '}
                    Numerator Relations
                </button>
                <button
                    className={
                        toggleState === 4 ? styles.activeTabs : styles.tabs
                    }
                    onClick={() => toggleTab(4)}
                >
                    {' '}
                    Numerator Quality Parameters
                </button>
                <button
                    className={
                        toggleState === 5 ? styles.activeTabs : styles.tabs
                    }
                    onClick={() => toggleTab(5)}
                >
                    {' '}
                    Denominators
                </button>
                <button
                    className={
                        toggleState === 6 ? styles.activeTabs : styles.tabs
                    }
                    onClick={() => toggleTab(6)}
                >
                    {' '}
                    Denominator Relations
                </button>
                <button
                    className={
                        toggleState === 7 ? styles.activeTabs : styles.tabs
                    }
                    onClick={() => toggleTab(7)}
                >
                    {' '}
                    External Data Comparison
                </button>
            </div>

            <div className={styles.contentTabs}>
                {/* TODO: use useConfigurations instead of prop drilling */}
                <div
                    className={
                        toggleState === 1
                            ? styles.activeContent
                            : styles.content
                    }
                >
                    <Numerators />
                </div>
                <div
                    className={
                        toggleState === 2
                            ? styles.activeContent
                            : styles.content
                    }
                >
                    <NumeratorGroups
                        toggleState={toggleState}
                        configurations={configurations}
                    />
                </div>
                <div
                    className={
                        toggleState === 3
                            ? styles.activeContent
                            : styles.content
                    }
                >
                    <NumeratorRelations
                        toggleState={toggleState}
                        configurations={configurations}
                        mappedNumerators={mappedNumerators}
                    />
                </div>
                <div
                    className={
                        toggleState === 4
                            ? styles.activeContent
                            : styles.content
                    }
                >
                    <NumeratorParameters
                        toggleState={toggleState}
                        configurations={configurations}
                        mappedNumerators={mappedNumerators}
                    />
                </div>
                <div
                    className={
                        toggleState === 5
                            ? styles.activeContent
                            : styles.content
                    }
                >
                    <Denominators
                        toggleState={toggleState}
                        configurations={configurations}
                    />
                </div>
                <div
                    className={
                        toggleState === 6
                            ? styles.activeContent
                            : styles.content
                    }
                >
                    <DenominatorRelations
                        toggleState={toggleState}
                        configurations={configurations}
                    />
                </div>
                <div
                    className={
                        toggleState === 7
                            ? styles.activeContent
                            : styles.content
                    }
                >
                    <ExternalDataComparison
                        toggleState={toggleState}
                        configurations={configurations}
                    />
                </div>
            </div>
        </div>
    )
}

Tabs.propTypes = {
    configurations: PropTypes.object,
    mappedNumerators: PropTypes.array,
}

export default Tabs
