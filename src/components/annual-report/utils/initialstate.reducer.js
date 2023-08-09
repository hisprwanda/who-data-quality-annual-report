import moment from "moment"

const year = moment().year()

const currentState = {
    selectedValue: {
        orgUnit: {
            displayName: 'Rwanda',
            path: 'Hjw70Lodtf2'
        },
        period: '',
        dataSet: ''
    },
    period: {
        fixedPeriod: {
            period: 'Daily',
            year: year
        },
        relativePeriod: 'Day'
    }    
}
export default currentState