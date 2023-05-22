import React from 'react'
import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import classes from './App.module.css'

import Report from './pages/Report'
import Configurations from './pages/Configurations'

import { BrowserRouter, Routes, Route } from "react-router-dom";


const query = {
    me: {
        resource: 'me',
    },
}

const MyApp = () => (
    <div className={classes.container}>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Report />} />
              <Route path="configurations">
                <Route index element={<Configurations />} />
              </Route>
              
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
)

export default MyApp
