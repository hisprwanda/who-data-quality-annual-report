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

