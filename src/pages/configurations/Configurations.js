import {useState} from 'react'
import MenuBar from '../../components/menu-bar/MenuBar'
import ConfigTabs from '../../components/config-tabs/ConfigTabs'
import './configurations.css'
import { useDataQuery, useAlert } from "@dhis2/app-runtime";


//TODO: use a global state or context api to share these settings accross components
const readDataStoreQuery = {
  dataStore: {
    resource: 'dataStore/who-dqa/configurations',
  },
};


const Configurations = () => {
let configurations = [];

  // A dynamic alert to communicate success or failure 
  const { show } = useAlert( 
    ({ message }) => message,
    ({ status }) => {
        if (status === 'success') return { success: true }
        else if (status === 'error') return { critical: true }
        else return {}
    } )

  // running the query
  const { loading, error, data } = useDataQuery(readDataStoreQuery);

  if (error) { return <span>ERROR: {error.message}</span> }

if (data) {  
  
    configurations = data.dataStore;
    const message = 'Successfully retrieved configurations'

    // show({ message, status: 'success' })  //TODO: find the error in the console caused by AlertsProvider
}

  return (
    <div className='configurationsContainer'>
        <MenuBar />
      
        <div className='subContainer'>
          <div className='descriptionText'>
            <p>
              This module is used for configuring the WHO Data Quality Annual Report, and mapping the proposed data quality indicators to data 
              elements and indicators in the DHIS 2 database. This configuration is used as the basis for the Annual Report, and the numerator and 
              numerator group configuration is also used for the Dashboard.
            </p>
          </div>

          <div className='config-tabs-container' >
              <ConfigTabs loading={loading} configurations={configurations}/>
          </div>

        </div>
      </div>
  )
}

export default Configurations