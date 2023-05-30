import React from 'react'
import MenuBar from '../components/menu-bar/MenuBar'
import './report.css'
import { resources } from '../assets/str-resources/report-section'

import { ReportStringResourceLoader } from '../utils/string-resource-loader/ReportStringResourceLoader'

const Report = () => {
  return (
    <div className='reportContainer'>
      <MenuBar />
        <div className='topParagraph'>
          <p>{resources.report_title}</p>
          <div>
          </div>
        </div>

        <div className='configsContainer'>
            <div className='configRows'>
              <p>{resources.data}</p>
              <div>
                {ReportStringResourceLoader.period}
                Division
              </div>
            </div>

            <div className='configRows'>
              <p>{resources.period}</p>
            </div>

            <div className='configRows'>
              <p>{resources.orgunit}</p>
            </div>
        </div>
      
    </div>
  )
}

export default Report