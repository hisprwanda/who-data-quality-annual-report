// This file contains codes for reactive streams 

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

export const loadAnalyticsInformation = () => {
    return {
        results: {
            resource: 'analytics.json?dimension=dx:xcHDkwzQPI3.REPORTING_RATE&dimension=ou:Hjw70Lodtf2;LEVEL-2&dimension=pe:2022;2019;2020;2021',
            paging: true,
        }
    }
}

export let allDataState = {count: 0}
export let dataInitialState = {count: 0}
