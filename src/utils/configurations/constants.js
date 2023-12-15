// If in a dev environment, use a custom data store key if it's set.
// Otherwise, use "configurations" (if none is set or in production)
export const DATASTORE_KEY =
    (process.env.NODE_ENV === 'development' &&
        process.env.REACT_APP_DHIS2_APP_DATASTORE_KEY) ||
    'configurations'
export const DATASTORE_ID = `who-dqa/${DATASTORE_KEY}`

export const OLD_APP_DATASTORE_ID = 'dataQualityTool/settings'
