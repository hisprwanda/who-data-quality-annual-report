import { CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styles from './ConfigTabs.module.css'
import { NumeratorRelations } from './numerator-relations/index.js'
import { DenominatorRelations } from './tab-contents/DenominatorRelations.js'
import { Denominators } from './tab-contents/Denominators.js'
import { ExternalDataComparison } from './tab-contents/ExternalDataComparison.js'
import { NumeratorGroups } from './tab-contents/NumeratorGroups.js'
import { NumeratorParameters } from './tab-contents/NumeratorParameters.js'
import { Numerators } from './tab-contents/Numerators.js'

function Tabs({ loading, configurations, mappedNumerators }) {
    const [toggleState, setToggleState] = useState(1)

    const toggleTab = (index) => {
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
                {loading ? (
                    <div className={styles.circularLoader}>
                        <CircularLoader large />
                    </div>
                ) : (
                    <>
                        {/* TODO: find a way to pass the state globally or use the context api to share these data */}
                        <div
                            className={
                                toggleState === 1
                                    ? styles.activeContent
                                    : styles.content
                            }
                        >
                            <Numerators
                                toggleState={toggleState}
                                configurations={configurations}
                            />
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
                    </>
                )}
            </div>
        </div>
    )
}

Tabs.propTypes = {
    configurations: PropTypes.object,
    loading: PropTypes.bool,
    mappedNumerators: PropTypes.array,
}

export default Tabs
