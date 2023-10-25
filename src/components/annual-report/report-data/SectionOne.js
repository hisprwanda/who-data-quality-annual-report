import { useDataQuery } from '@dhis2/app-runtime'
import { Button,
    TableBody,
    TableHead,
    TableCellHead,
    Table,
    TableCell,
    TableRow,
    TableRowHead,
    CircularLoader 
} from '@dhis2/ui'

import React from 'react'
import { getReportSectionsData } from '../../../utils/utils'

const reportQueries = {
    reporting_rate_over_all_org_units: {
        resource: 'analytics.json',
        params: ({ dataSets, orgUnits, periods }) => ({
            dimension: `dx:${dataSets
                .map((de) => de + '.REPORTING_RATE')
                .join(';')},ou:${orgUnits.join(';')},pe:${periods.join(';')}`,
        }),
    },
    reporting_rate_by_org_unit_level: {
        resource: 'analytics.json',
        params: ({ dataSets, orgUnits, orgUnitLevel, periods }) => ({
            dimension: `dx:${dataSets
                .map((ds) => ds + '.REPORTING_RATE')
                .join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${periods.join(';')}`,
        }),
    },
    reporting_timeliness_over_all_org_units: {
        resource: 'analytics.json',
        params: ({ dataSets, orgUnits, currentPeriod }) => ({
            dimension: `dx:${dataSets
                .map((ds) => ds + '.REPORTING_RATE_ON_TIME')
                .join(';')},ou:${orgUnits.join(';')},pe:${currentPeriod}`,
        }),
    },
    reporting_timeliness_by_org_unit_level: {
        resource: 'analytics.json',
        params: ({ dataSets, orgUnits, orgUnitLevel, currentPeriod }) => ({
            dimension: `dx:${dataSets
                .map((ds) => ds + '.REPORTING_RATE_ON_TIME')
                .join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${currentPeriod}`,
        }),
    },
    expected_reports_over_all_org_units: {
        resource: 'analytics.json',
        params: ({ dataSets, orgUnits, currentPeriod }) => ({
            dimension: `dx:${dataSets
                .map((ds) => ds + '.EXPECTED_REPORTS')
                .join(';')},ou:${orgUnits.join(';')},pe:${currentPeriod}`,
        }),
    },
    expected_reports_by_org_unit_level: {
        resource: 'analytics.json',
        params: ({ dataSets, orgUnits, orgUnitLevel, currentPeriod }) => ({
            dimension: `dx:${dataSets
                .map((ds) => ds + '.EXPECTED_REPORTS')
                .join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${currentPeriod}`,
        }),
    },
    count_of_data_values_over_all_org_units: {
        resource: 'analytics.json',
        params: ({ dataElements, orgUnits, currentPeriod }) => ({
            dimension: `dx:${dataElements.join(';')},ou:${orgUnits.join(
                ';'
            )},pe:${currentPeriod}`,
            aggregationType: 'COUNT',
        }),
    },
    count_of_data_values_by_org_unit_level: {
        resource: 'analytics.json',
        params: ({ dataElements, orgUnits, orgUnitLevel, currentPeriod }) => ({
            dimension: `dx:${dataElements.join(';')},ou:${
                orgUnits.join(';') + ';' + orgUnitLevel
            },pe:${currentPeriod}`,
            aggregationType: 'COUNT',
        }),
    },
}

export const SectionOne = ({reportParameters}) => {
    const { data, loading, error, refetch } = useDataQuery(reportQueries, {
        lazy: true,
    })

    let sectionsData = null

    const generateReport = () => {
        const periods = ['2022', '2021', '2020', '2020']
        const currentPeriod = periods[0]
        // const dataSets = ['YmRjo8j3F3M']
        const dataSets = [
            'dONyxVsQyGS',
            'rGDF7yDdhnj',
            'YmRjo8j3F3M',
            'GhdP8W2GorO',
        ]
        // const dataElements = ['bcDTj5odXAg']
        const dataElements = [
            'ieThL7l107F',
            'RvArfQFKdXe',
            'XeRBhx8avQY',
            'YRJjIr5tuD6',
            'YAAmrY2RPbZ',
            'DvUwQScvSpc',
        ]
        const orgUnits = ['lZsCb6y0KDX']
        const orgUnitLevel = 'LEVEL-2'

        const variables = {
            dataSets,
            dataElements,
            orgUnits,
            orgUnitLevel,
            periods,
            currentPeriod,
        }
        refetch(variables)
    }

    if (loading) {
        return <span>loading</span>
    }

    if (error) {
        return <span>error</span>
    }

    if (data) {
        console.log(reportParameters)
        sectionsData = getReportSectionsData(data, reportParameters.mappedConfiguration, reportParameters.currentPeriod)

        console.log("section: ", sectionsData)

        // return <span>{JSON.stringify(data, null, 4)}</span>
    }

    return (
        <>
            <Button
                primary
                onClick={() => {
                    generateReport()
                }}
            >
                Load Section One
            </Button>


            {/* section one content. this needs to be improved */}

            <div className="report-preview report-preview-container">
    <div style={{
            backgroundColor: '#5b92e5',
            padding: '5px',
            color: '#fff', // Assuming 'fer' is a valid color value
            fontSize: '20px'
        }}>
        <p> DOMAIN 1 - COMPLETENESS OF REPORTING </p>
    </div>
      <p>
        1a: Completeness of facility reporting
      </p>
      <p>
        The percentage of expected reports that have been entered and completed.
      </p>
      <Table>
        <TableHead>
            <TableRowHead>
                <TableCellHead>
                    Data set
                </TableCellHead>
                <TableCellHead>
                    Quality threshold	
                </TableCellHead>
                <TableCellHead>
                    Overall score
                </TableCellHead>
               <TableCellHead colSpan='3'>
                  Regions with divergent score
                <TableCellHead >
                    Number
                </TableCellHead>
                <TableCellHead>
                    Percentage
                </TableCellHead>
                <TableCellHead>
                    Name
                </TableCellHead>
               </TableCellHead>
            </TableRowHead>
        </TableHead>
        <TableBody>
            {sectionsData?  Object.values(sectionsData.section1.section1A[0]).map((dataset, key ) => (
                <TableRow>
                    <TableCell>
                        {dataset[0].dataset_name}	
                    </TableCell>
                    <TableCell>
                        {dataset[0].threshold}%	
                    </TableCell>
                    <TableCell>
                        {dataset[0].score}%
                    </TableCell>
                    <TableCell>
                        {dataset[0].divergentRegionsCount}
                    </TableCell>
                    <TableCell >
                        {dataset[0].divergentRegionsPercent}%
                    </TableCell>
                    <TableCell >
                        {dataset[0].orgUnitLevelsOrGroups.join(", ")}
                    </TableCell>
                </TableRow>
            ))
        :
        ""
        }
        </TableBody>
        
    </Table>
      <p>
        1b: Timeliness of facility reporting
      </p>
      <p>
        The percentage of expected reports that have been entered and completed on time.
      </p>
      <Table>
        <TableHead>
        <TableRowHead>
                <TableCellHead>
                    Data set
                </TableCellHead>
                <TableCellHead>
                    Quality threshold	
                </TableCellHead>
                <TableCellHead>
                    Overall score
                </TableCellHead>
               <TableCellHead colSpan='3'>
                  Regions with divergent score
                <TableCellHead >
                    Number
                </TableCellHead>
                <TableCellHead>
                    Percentage
                </TableCellHead>
                <TableCellHead>
                    Name
                </TableCellHead>
               </TableCellHead>
            </TableRowHead>
        </TableHead>
        <TableBody>
        {sectionsData?  Object.values(sectionsData.section1.section1B[0]).map((dataset, key ) => (
                <TableRow>
                    <TableCell>
                        {dataset[0].dataset_name}	
                    </TableCell>
                    <TableCell>
                        {dataset[0].threshold}%	
                    </TableCell>
                    <TableCell>
                        {dataset[0].score}%
                    </TableCell>
                    <TableCell>
                        {dataset[0].divergentRegionsCount}
                    </TableCell>
                    <TableCell >
                        {dataset[0].divergentRegionsPercent}%
                    </TableCell>
                    <TableCell >
                        {dataset[0].orgUnitLevelsOrGroups.join(", ")}
                    </TableCell>
                </TableRow>
            ))
        :
        ""
        }
        </TableBody>
        
    </Table>
      <p>
        1c: Timeliness of facility reporting
      </p>
      <p>
        The percentage of expected reports that have been entered and completed on time.
      </p>
      <Table>
        <TableHead>
        <TableRowHead>
                <TableCellHead>
                    Indicator
                </TableCellHead>
                <TableCellHead>
                    Quality threshold	
                </TableCellHead>
                <TableCellHead colSpan='2'>
                    Values
                    <TableCellHead>
                        Expected
                    </TableCellHead>
                    <TableCellHead>
                        Actual
                    </TableCellHead>
                </TableCellHead>
                <TableCellHead>
                    Overall Score
                </TableCellHead>
               <TableCellHead colSpan='3'>
                  Regions with divergent score
                <TableCellHead >
                    Number
                </TableCellHead>
                <TableCellHead>
                    Percentage
                </TableCellHead>
                <TableCellHead>
                    Name
                </TableCellHead>
               </TableCellHead>
            </TableRowHead>
        </TableHead>
        <TableBody>
        {sectionsData?  Object.values(sectionsData.section1.section1C[0]).map((dataset, key ) => (
                <TableRow>
                    <TableCell>
                        {dataset[0].indicator_name}	
                    </TableCell>
                    <TableCell>
                        {dataset[0].threshold}%	
                    </TableCell>
                    <TableCell>
                        {dataset[0].expectedValues}
                    </TableCell>
                    <TableCell>
                        {dataset[0].actualValues}
                    </TableCell>
                    <TableCell>
                        {dataset[0].overallScore}
                    </TableCell>
                    <TableCell>
                        {dataset[0].divergentRegionsCount}
                    </TableCell>
                    <TableCell >
                        {dataset[0].divergentRegionsPercent}%
                    </TableCell>
                    <TableCell >
                        {dataset[0].orgUnitLevelsOrGroups.join(", ")}
                    </TableCell>
                </TableRow>
            ))
        :
        ""
        }
        </TableBody>
        
    </Table>


    <p>
        1d: Consistency of dataset completeness over time
      </p>
      <p>
      Completeness of datasets in 2022 compared to previous 3 years.
      </p>
      <Table>
        <TableHead>
        <TableRowHead>
                <TableCellHead>
                    Data set
                </TableCellHead>
                <TableCellHead>
                   Expected Trend	
                </TableCellHead>
                <TableCellHead>
                   Compare Region to	
                </TableCellHead>
                <TableCellHead>
                    Quality threshold	
                </TableCellHead>
                <TableCellHead>
                    Overall score
                </TableCellHead>
               <TableCellHead colSpan='3'>
                  Regions with divergent score
                <TableCellHead >
                    Number
                </TableCellHead>
                <TableCellHead>
                    Percentage
                </TableCellHead>
                <TableCellHead>
                    Name
                </TableCellHead>
               </TableCellHead>
            </TableRowHead>
        </TableHead>
        <TableBody>
        {sectionsData?  Object.values(sectionsData.section1.section1D[0]).map((dataset, key ) => (
                <TableRow>
                    <TableCell>
                        {dataset[0].dataset_name}	
                    </TableCell>
                    <TableCell>
                        {dataset[0].trend[0].toUpperCase() + dataset[0].trend.slice(1)}	
                    </TableCell>
                    <TableCell>
                        {dataset[0].comparison}	
                    </TableCell>
                    <TableCell>
                        ± {dataset[0].threshold}%	
                    </TableCell>
                    <TableCell>
                        {dataset[0].score}%
                    </TableCell>
                    <TableCell>
                        {dataset[0].divergentRegionsCount}
                    </TableCell>
                    <TableCell >
                        {dataset[0].divergentRegionsPercent}%
                    </TableCell>
                    <TableCell >
                        {dataset[0].orgUnitLevelsOrGroups.join(", ")}
                    </TableCell>
                </TableRow>
            ))
        :
        ""
        }
        </TableBody>
        
    </Table>
    </div>
        
        </>
    )
}
