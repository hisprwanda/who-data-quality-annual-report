import data from '../../../../data/sampleReportResponseLong.json'

const lookupMetadata = (key, metadata) => {
    return metadata[key].name
}

export const processReportData = (dataSet) => {

    console.log(dataSet)
    const reportingRateOverallOrgUnits = data.reporting_rate_over_all_org_units
    const reportingRateByOrgUnitLevel = data.reporting_rate_by_org_unit_level

    const reportingRateOverallOrgUnitsMetadata = reportingRateOverallOrgUnits.metaData
    const reportingRateByOrgUnitLevelMetadata = reportingRateByOrgUnitLevel.metaData
    
    const reportingRateOverallOrgUnitsRows = reportingRateOverallOrgUnits.rows
    const reportingRateByOrgUnitLevelRows = reportingRateByOrgUnitLevel.rows
    
    const uniqueOrgUnits = Array.from(new Set(reportingRateByOrgUnitLevelRows.map(row => row[1])))

    const reportingRateOverallOrgUnitsUniqueDataset = Array.from(new Set(reportingRateOverallOrgUnitsRows.map(row => row[0])))
    
    const datasetWithCurrentPeriod = reportingRateOverallOrgUnitsUniqueDataset.map(i => {
        const rowsWithCurrentPeriod = reportingRateOverallOrgUnitsRows.filter(d => d[0] === i && parseInt(d[2]) === 2022)  
        const datasetLookup = lookupMetadata(rowsWithCurrentPeriod[0][0], reportingRateOverallOrgUnitsMetadata.items)
        lookupDataset(i, dataSet)
        const currentYearInfoBelowThreashold = reportingRateByOrgUnitLevelRows.filter(d => d[0] === i && parseInt(d[2]) === 2022 && parseFloat(d[3]) <= 90)
        const processedOu = currentYearInfoBelowThreashold.map(c => {
            let m = c[1]
            return m
        })
        const t = processedOu.map(s => {
            return lookupMetadata(s, reportingRateByOrgUnitLevelMetadata.items)
        })
        return {
            'name': datasetLookup,
            "threshold": 0,
            'score': rowsWithCurrentPeriod[0][3],
            'divergentRegionsCount': currentYearInfoBelowThreashold.length,
            'divergentRegionsPercent': (currentYearInfoBelowThreashold.length / uniqueOrgUnits.length) * 100,
            'region':  t.length > 0 ? t.join(', ') : ''
        }
    })
    return datasetWithCurrentPeriod

}