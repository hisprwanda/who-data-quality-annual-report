import React from 'react'
import MenuBar from '../../components/menu-bar/MenuBar'
import './style/report.css'
import { resources } from '../../assets/str-resources/report-section'

const Report = () => {
  return (
    <div className='reportContainer'>
      <MenuBar />
        <div className='topParagraph'>
          <p>{resources.report_title}</p>
        </div>

        <div className='configsContainer'>
            <div className='configRows'>
              <div className='title'>
                {resources.data}
              </div>
              <div className='body'>
                This is body section
              </div>
            </div>

            <div className='configRows'>
            <div className='title'>
                {resources.period}
              </div>
              <div className='body'>
                This is body section
              </div>
            </div>

            <div className='configRows'>
            <div className='title'>
                {resources.orgunit}
              </div>
              <div className='body'>
                This is body section
              </div>
            </div>
        </div>
      
    </div>
  )
}

export default Report