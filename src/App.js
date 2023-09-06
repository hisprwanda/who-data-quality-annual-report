import React from 'react'
import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import classes from './App.module.css'
import './styles/variables.css';

import Report from './pages/annual_report/Report'
import Configurations from './pages/configurations/Configurations'
import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux'
import store from './components/annual-report/store/Index'
import {SectionOne} from './components/annual-report/report-data/SectionOne'

const query = {
    me: {
        resource: 'me',
    },
}

const MyApp = () => (
    <div className={classes.container}>
        <HashRouter>
          <Provider store={store}>
            <Routes>
              <Route path="/">
                <Route index element={<SectionOne />} />
                <Route path="configurations">
                  <Route index element={<Configurations />} />
                </Route>
              </Route>
            </Routes>
          </Provider>
        </HashRouter>
    </div>
)

export default MyApp
