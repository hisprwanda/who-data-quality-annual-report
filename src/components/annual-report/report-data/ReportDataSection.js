import React, {useState, useEffect} from 'react'
import { getHttpRequest, loadDatasetInformation, loadOrganizationUnit, loadReportingRate, loadReportingRateOnTime } from '../datasource/dataset/dataset.source'
import { useDataQuery } from '@dhis2/app-runtime'
import { getOrgUnitLevel } from '../utils/OrgUnitRequestProcessor'

export const ReportDataSection = ({group, element, orgUnit, children, period, dataset, moreinfo }) => {

    let [orgUnitLevel, setOrgUnitLevel] = useState(0)
    let [displayDataset, setDisplayDataSet] = useState('')
    let [displayDatasetNumber, setDisplayDatasetNumber] = useState(0)
    let [completenessPercentage, setCompletenessPercentage] = useState(0)

    useEffect(() => {
        const response = loadOrganizationUnit(orgUnit)
        response
            .then(res => setOrgUnitLevel(res.data.children[0].level))
            .catch(err => console.log(err))

        const datasetResponse = loadDatasetInformation(dataset)
        datasetResponse
          .then(res => setDisplayDataSet(res.data.dataSets[0].displayName))
          .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        const levelResponse = loadReportingRate(dataset, orgUnit, orgUnitLevel, '2022')
        levelResponse
            .then(level => console.log('oh nana'))
            .catch(err => console.log(err))

        const reportingRateOnTimeResponse = loadReportingRateOnTime(dataset, orgUnit, orgUnitLevel)
        reportingRateOnTimeResponse
          .then(res => {
            setDisplayDatasetNumber(res.data.rows.length)
            const nums = res.data.rows.map(d => d[d.length - 1])
            const greater = nums.filter(x => parseInt(x) > 0)
            const percentage = greater > 0 ? (parseInt(greater) / parseInt(nums)) * 100 : 0
            setCompletenessPercentage(percentage)
          })
          .catch(err => console.log(err))
    }, [orgUnitLevel])

    return <div>
        <div className="header-section-data-section">
        <div>{displayDataset} - {moreinfo}</div>
        <div>{completenessPercentage}</div>
        <div className="header-section-">
          <div>{displayDatasetNumber}</div>
          <div>100%</div>
        </div>
      </div>
    </div>
}