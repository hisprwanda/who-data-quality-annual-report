import { CssVariables } from '@dhis2/ui'
import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import classes from './App.module.css'
import { AnnualReport, Configurations } from './pages/index.js'
import { ConfigurationsProvider, UserProvider } from './utils/index.js'

const App = () => (
    <ConfigurationsProvider>
        <UserProvider>
            <CssVariables colors spacers />
            <div className={classes.container}>
                <HashRouter>
                    <Routes>
                        <Route path="/">
                            <Route index element={<AnnualReport />} />
                            <Route path="configurations">
                                <Route index element={<Configurations />} />
                            </Route>
                        </Route>
                    </Routes>
                </HashRouter>
            </div>
        </UserProvider>
    </ConfigurationsProvider>
)

export default App
