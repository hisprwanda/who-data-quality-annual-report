import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import classes from './App.module.css'
import './styles/variables.css'
import Report from './pages/annual_report/AnnualReport.js'
import Configurations from './pages/configurations/Configurations.js'

const App = () => (
    <div className={classes.container}>
        <HashRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<Report />} />
                    <Route path="configurations">
                        <Route index element={<Configurations />} />
                    </Route>
                </Route>
            </Routes>
        </HashRouter>
    </div>
)

export default App
