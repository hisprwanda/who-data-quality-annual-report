import React from 'react'
import MenuBar from '../components/menu-bar/MenuBar'
import ConfigTabs from '../components/config-tabs/ConfigTabs'
import './configurations.css'

const Configurations = () => {
  return (
    <div className='configurationsContainer'>
        <MenuBar />
      
        <div className='subContainer'>
          <div className='descriptionText'>
            <p>This module is used for configuring the WHO Data Quality Annual Report, and mapping the proposed data quality indicators to data elements and indicators in the DHIS 2 database. This configuration is used as the basis for the Annual Report, and the numerator and numerator group configuration is also used for the Dashboard.</p>
          </div>

          <div className='config-tabs-container' >
            <ConfigTabs />
          </div>

        </div>
      </div>
  )
}

export default Configurations