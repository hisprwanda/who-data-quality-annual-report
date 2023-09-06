import React from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { Button } from '@dhis2/ui'

const reportQueries = {
    reporting_rate_over_all_org_units: {
      resource: 'analytics.json',
      params: ({dataSets,orgUnits,periods}) => ({
        dimension:  `dx:${dataSets.map(de=>de+'.REPORTING_RATE').join(';')},ou:${orgUnits.join(';')},pe:${periods.join(';')}`
    })
},
reporting_rate_by_org_unit_level: {
    resource: 'analytics.json',
    params: ({dataSets,orgUnits,orgUnitLevel,periods}) => ({
      dimension:  `dx:${dataSets.map(ds=>ds+'.REPORTING_RATE').join(';')},ou:${orgUnits.join(';')+';' + orgUnitLevel},pe:${periods.join(';')}`
  })
  },
  reporting_timeliness_over_all_org_units: {
    resource: 'analytics.json',
    params: ({dataSets,orgUnits,currentPeriod}) => ({
      dimension:  `dx:${dataSets.map(ds=>ds+'.REPORTING_RATE_ON_TIME').join(';')},ou:${orgUnits.join(';')},pe:${currentPeriod}`
  })
},
reporting_timeliness_by_org_unit_level: {
  resource: 'analytics.json',
  params: ({dataSets,orgUnits,orgUnitLevel,currentPeriod}) => ({
    dimension:  `dx:${dataSets.map(ds=>ds+'.REPORTING_RATE_ON_TIME').join(';')},ou:${orgUnits.join(';')+';' + orgUnitLevel},pe:${currentPeriod}`
    })  
},
expected_reports_over_all_org_units: {
    resource: 'analytics.json',
    params: ({dataSets,orgUnits,currentPeriod}) => ({
        dimension:  `dx:${dataSets.map(ds=>ds+'.EXPECTED_REPORTS').join(';')},ou:${orgUnits.join(';')},pe:${currentPeriod}`
        })
},
expected_reports_by_org_unit_level: {
    resource: 'analytics.json',
    params: ({dataSets,orgUnits,orgUnitLevel,currentPeriod}) => ({
        dimension:  `dx:${dataSets.map(ds=>ds+'.EXPECTED_REPORTS').join(';')},ou:${orgUnits.join(';')+';' + orgUnitLevel},pe:${currentPeriod}`
        })
},
count_of_data_values_over_all_org_units: {
    resource: 'analytics.json',
    params: ({dataElements,orgUnits,currentPeriod}) => ({
        dimension:  `dx:${dataElements.join(';')},ou:${orgUnits.join(';')},pe:${currentPeriod}`,
        aggregationType: 'COUNT',
        })
},
count_of_data_values_by_org_unit_level: {
    resource: 'analytics.json',
    params: ({dataElements,orgUnits,orgUnitLevel,currentPeriod}) => ({
        dimension:  `dx:${dataElements.join(';')},ou:${orgUnits.join(';')+';' + orgUnitLevel},pe:${currentPeriod}`,
        aggregationType: 'COUNT',
        })
},
}

export const SectionOne = () => {

    const {data, loading, error, refetch} = useDataQuery(reportQueries, {lazy:true})

    const generateReport = () => {
        const periods = ['2022','2021','2020','2020']
        const currentPeriod = periods[0]
        // const dataSets = ['YmRjo8j3F3M']
        const dataSets = ["dONyxVsQyGS","rGDF7yDdhnj","YmRjo8j3F3M","GhdP8W2GorO"]
        // const dataElements = ['bcDTj5odXAg']
        const dataElements = ["ieThL7l107F","RvArfQFKdXe","XeRBhx8avQY","YRJjIr5tuD6","YAAmrY2RPbZ","DvUwQScvSpc"]
        const orgUnits = ['lZsCb6y0KDX']
        const orgUnitLevel = 'LEVEL-2'

        const variables = {
            dataSets,
            dataElements,
            orgUnits,
            orgUnitLevel,
            periods,
            currentPeriod
        }
        refetch(variables)
    }

    if (loading) {
        return <span>'loading'</span>
    }

    if (error) {
        return <span>'error'</span>
    }

    if (data) {
        return <span>{JSON.stringify(data,null,4)}</span>
    }

    return (
        <Button primary onClick={()=>{generateReport()}}>Generate</Button>
    )

}
