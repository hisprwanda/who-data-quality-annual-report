import React from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { Button } from '@dhis2/ui'

const reportQueries = {
    reporting_rate_over_all_org_units: {
      resource: 'analytics.json',
      params: ({dx,ou,pe}) => ({
        dimension:  `dx:${dx}.REPORTING_RATE,ou:${ou},pe:${pe}`
    }),
    
  }
}

export const SectionOne = () => {

    const {data, loading, error, refetch} = useDataQuery(reportQueries, {lazy:true})

    const generateReport = () => {
        const periods = ['2022','2021','2020','2020']
        const variables = {
            dx: 'xcHDkwzQPI3',
            ou: 'Hjw70Lodtf2',
            pe: periods.join(';')
        }
        refetch(variables)
    }

    return (
        <Button primary onClick={()=>{generateReport()}}>Generate</Button>
    )
}
