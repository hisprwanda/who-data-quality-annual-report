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

export let allDataState = {count: 0}
export let dataInitialState = {count: 0}

//dataElements.json?filter=id:in:[B97VsJr27J6,GDaveYNVsl9,GDaveYNVsl9,TFMq8A8iZMx,b2WxuOLQ451,eHz3LgFY3UU,xcHDkwzQPI3]&=&paging=false