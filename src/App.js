import { CssVariables } from '@dhis2/ui'
import React, { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import classes from './App.module.css'
import { ReportParameterSelector } from './components/report-parameter-selector/index.js'
import { AnnualReport, Configurations } from './pages/index.js'
import { ConfigurationsProvider } from './utils/index.js'

const App = () => {
    const [reportParameters, setReportParameters] = useState({})

    const [isReportPage, setIsReportPage] = useState(true)
    return (
        <ConfigurationsProvider>
            <CssVariables colors spacers />
            <div className={classes.container}>
                <ReportParameterSelector
                    setReportParameters={setReportParameters}
                    isReportPage={isReportPage}
                />
                <HashRouter>
                    <Routes>
                        <Route path="/">
                            <Route
                                index
                                element={
                                    <AnnualReport
                                        reportParameters={reportParameters}
                                        setIsReportPage={setIsReportPage}
                                    />
                                }
                            />
                            <Route path="configurations">
                                <Route
                                    index
                                    element={
                                        <Configurations
                                            setIsReportPage={setIsReportPage}
                                        />
                                    }
                                />
                            </Route>
                        </Route>
                    </Routes>
                </HashRouter>
            </div>
        </ConfigurationsProvider>
    )
}

export default App
