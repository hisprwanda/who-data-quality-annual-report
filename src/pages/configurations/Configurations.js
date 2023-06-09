import {useState} from 'react'
import MenuBar from '../../components/menu-bar/MenuBar'
import ConfigTabs from '../../components/config-tabs/ConfigTabs'
import './configurations.css'
import { useDataQuery, useAlert } from "@dhis2/app-runtime";




const readDataStoreQuery = {
  dataStore: {
    resource: 'dataStore/dataQualityTool/settings',
  },
};


const Configurations = () => {
let numerators = [];
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
  
    numerators = data.dataStore.numerators;
    const message = 'Successfully retrieved configurations'
    // TODO: do your logic here
    show({ message, status: 'success' })
    console.log("*** datastore values: ", numerators );
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
              <ConfigTabs loading={loading} numerators={numerators}/>
          </div>

        </div>
      </div>
  )
}

export default Configurations