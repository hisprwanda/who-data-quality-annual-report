import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import classes from './App.module.css'
import './styles/variables.css'
import MenuBar from './components/menu-bar/MenuBar.js'
import { AnnualReport, Configurations } from './pages/index.js'

const App = () => (
    <div className={classes.container}>
        <HashRouter>
            <MenuBar />

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
)

export default App
