// This file contains codes for reactive streams 

import axios from "axios"
import { baseURL, userAuth, subURL } from "../../utils/configuration"

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

    return axios.get(`${baseURL}/${subURL}/api/organisationUnits/${orgUnit}.json?fields=children[displayName,id,level,children::isNotEmpty]`, {
        auth: userAuth
    })
}

export const loadReportingRate = (dx, ou, level, pe) => {
    return axios.get(`${baseURL}/${subURL}/api/analytics.json?dimension=dx:${dx[0]}.REPORTING_RATE&dimension=ou:${ou}&dimension=pe:2022&displayProperty=NAME`, {
        auth: userAuth
    })
}

export const loadDatasetInformation = (dataset) => {
    return axios.get(`${baseURL}/${subURL}/api/dataSets.json?filter=id:in:[${dataset}]&fields=displayName,id,periodType&paging=false`, {
        auth: userAuth
    })
}

export const loadReportingRateOnTime = (dx, ou, level) => {
    return axios.get(`${baseURL}/${subURL}/api/29/analytics.json?dimension=dx:${dx}.REPORTING_RATE_ON_TIME&dimension=ou:${ou}&dimension=pe:2022&displayProperty=NAME`, {
        auth: userAuth
    })
}

// Function used to load organization unit groups
export const loadOrganizationUnitGroups = () => {
    return axios.get(`${baseURL}/${subURL}/api/29/organisationUnitGroups.json?=&paging=false`, {
        auth: userAuth
    })
}

export const loadOrganizationUnitLevels = () => {
    return axios.get(`${baseURL}/${subURL}/api/29/organisationUnitLevels.json?=&paging=false`, {
        auth: userAuth
    })
}
export let allDataState = {count: 0}
export let dataInitialState = {count: 0}
