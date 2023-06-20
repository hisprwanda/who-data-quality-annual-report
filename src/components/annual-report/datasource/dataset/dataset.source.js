// This file contains codes for reactive streams 

export const dataSetQueryStructure = {
    results: {
        resource: 'dataItems',
        params: {
            pageSize: 20,
            paging: true,
            fields: ['id', 'displayName', 'dimensionItemType']
        },
    },
}