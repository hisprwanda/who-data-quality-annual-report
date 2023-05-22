import React from 'react'
import MenuBar from '../components/MenuBar'
import './configurations.css'

const Configurations = () => {
  return (
    <div className='configurationsContainer'>
        <MenuBar />
      
        <div className='descriptionText'>
          <p>This module is used for configuring the WHO Data Quality Annual Report, and mapping the proposed data quality indicators to data elements and indicators in the DHIS 2 database. This configuration is used as the basis for the Annual Report, and the numerator and numerator group configuration is also used for the Dashboard.</p>
        </div>

        <div className='configMenu' >
          <p>Configurations Tablel Menu</p>
        </div>

        <div className='tableParagraph'>
          <p>Please map the reference numerators to the corresponding data element/indicator in this database.</p>
        </div>

        <div className='configTable'>
            <p>Config table goes here</p>
        </div>
      </div>
  )
}

export default Configurations