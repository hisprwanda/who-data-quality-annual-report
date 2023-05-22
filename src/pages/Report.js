import React from 'react'
import MenuBar from '../components/MenuBar'
import './report.css'

const Report = () => {
  return (
    <div className='reportContainer'>
      <MenuBar />

        <div className='topParagraph'>
          <p>Annual Data Quality Report</p>
        </div>

        <div className='configsContainer'>
            <div className='configRows'>
              <p>Data</p>
            </div>

            <div className='configRows'>
              <p>Period</p>
            </div>

            <div className='configRows'>
              <p>Organization Units</p>
            </div>
        </div>
      
    </div>
  )
}

export default Report