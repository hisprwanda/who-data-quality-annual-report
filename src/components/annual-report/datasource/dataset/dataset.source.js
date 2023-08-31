// This file contains codes for reactive streams 

import axios from "axios"

export const dataSetQueryStructure = {
    results: {
        resource: 'dataItems',
        params: {
            pageSize: 2,
            paging: true,
            fields: ['id', 'displayName', 'dimensionItemType']
        },
    },
}

export const allDataTypesQuery = {
    results: {
        resource: 'dataItems',
        params: {
            pageSize: 30,
            paging: true,
            fields: ['id', 'displayName', 'dimensionItemType']
        },
    },
}

export const dataSetQuery = {
    results: {
        resource: 'dataSets',
        params: {
            pageSize: 30,
            paging: true,
            fields: ['id', 'displayName', 'dimensionItemType']
        },
    },
}

export const indicatorQuery = {
    results: {
        resource: 'indicators',
        params: {
            pageSize: 30,
            paging: true,
            fields: ['id', 'displayName', 'dimensionItemType']
        },
    },
}

export const dataElementQuery = {
    results: {
        resource: 'dataElements',
        params: {
            pageSize: 30,
            paging: true,
            fields: ['id', 'displayName', 'dimensionItemType']
        },
    },
}

export const loadDataStore = {
    results: {
        resource: 'dataStore/dataQualityTool/settings',
    }
}

export const loadAnalytics = {
    results: {
        resource: 'analytics.json?dimension=pe:2000W01&filter=ou:Hjw70Lodtf2;LEVEL-2&displayProperty=NAME&skipData=true',
        paging: true,
    }
}

export const loadAnalyticsInformation = (dx, ou, pe) => {
    return {
        results: {
            resource: `analytics.json?dimension=dx:${dx}&dimension=ou:${ou}&dimension=pe:${pe}`,
            paging: true,
        }
    }
}

export const loadDataElements = (elements, paging) => {

    return {
        results: {
            resource: `dataElements.json?filter=id:in:[${elements}]&=&paging=false`,
            paging: true,
        }
    }
}

export const loadOrganizationUnit = (orgUnit) => { 

    return axios.get(`https://online.hisprwanda.org/eir/api/organisationUnits/${orgUnit}.json?fields=children[displayName,id,level,children::isNotEmpty]`, {
        auth: {
            username: 'bmafende',
            password: 'Admin@123',
          }
    })
}

export const loadReportingRate = (dx, ou, level, pe) => {
    return axios.get(`https://online.hisprwanda.org/eir/api/analytics.json?dimension=dx:${dx[0]}.REPORTING_RATE&dimension=ou:${ou}&dimension=pe:2022&displayProperty=NAME`, {
        auth: {
            username: 'bmafende',
            password: 'Admin@123',
          }
    })
}

export const loadDatasetInformation = (dataset) => {
    return axios.get(`https://online.hisprwanda.org/eir/api/dataSets.json?filter=id:in:[${dataset}]&fields=displayName,id,periodType&paging=false`, {
        auth: {
            username: 'bmafende',
            password: 'Admin@123',
          }
    })
}

export const loadReportingRateOnTime = (dx, ou, level) => {
                      https://online.hisprwanda.org/eir/api/29/analytics.json?dimension=dx:xcHDkwzQPI3.REPORTING_RATE_ON_TIME&dimension=ou:nBLRIqKNNOu&dimension=pe:2022&displayProperty=NAME
    return axios.get(`https://online.hisprwanda.org/eir/api/29/analytics.json?dimension=dx:${dx}.REPORTING_RATE_ON_TIME&dimension=ou:${ou}&dimension=pe:2022&displayProperty=NAME`, {
        auth: {
            username: 'bmafende',
            password: 'Admin@123',
          }
    })
}

export const getHttpRequest = () => {
    axios.get('https://online.hisprwanda.org/eir/api/identifiableObjects/ncVHO9PKoOh', {
        auth: {
            username: 'bmafende',
            password: 'Admin@123',
          }
    })
    .then(data => {console.log(data)})
    .catch(err => console.log(err))
    .finally(console.log('Finally run'))
}



export let allDataState = {count: 0}
export let dataInitialState = {count: 0}

//https://online.hisprwanda.org/eir/api/29/analytics.json?dimension=dx:xcHDkwzQPI3.REPORTING_RATE&dimension=ou:nBLRIqKNNOu&dimension=pe:2022&displayProperty=NAME