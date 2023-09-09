import moment from "moment"

const year = moment().year()

const currentState = {
    selectedValue: {
        orgUnit: {
            displayName: 'Rwanda',
            path: 'Hjw70Lodtf2',
            id: '',
            children: 0
        },
        period: '',
        dataSet: '',
        element: [],
        configuredDataset: [],
        orgUnitSet: [],
        orgUnitIDSet: [],
        precedingYearForReference: 0,
        orgUnitLevel: 0,
    },
    datasetThreshold: {},
    period: {
        fixedPeriod: {
            period: 'Daily',
            year: year
        },
        relativePeriod: 'Day',
        selectedPeriod: []
    },
    reportViewStatus: false,
    
}
export default currentState