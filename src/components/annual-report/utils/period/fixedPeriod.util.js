import moment from 'moment';

export const processFixedPeriod = function(data) {

    // const currentDate = moment().format('YYYY-MM-DD')
    // const currentYear = moment(currentDate).year()
    // const startDate = moment(`${currentYear}-01-01`)
    // const endDate = moment(`${currentYear}-12-31`)

    // let between = 0
    // let dateBetween = '';
    // if(data === 'Daily') {
    //     between = 1
    // }
    // if(data === 'Weekly') {
    //     between = 7
    // }
    // if(data === 'Monthly') {
    //     between = 30
    // }
    // if(data.length > 2) {
    //     dateBetween = getDaysBetweenDates(startDate, endDate, between)
    // }
    // return dateBetween

    
}

var getDaysBetweenDates = function(startDate, endDate, between) {
    var now = startDate.clone(), dates = [];
    while (now.isSameOrBefore(endDate)) {
        dates.push(now.format('YYYY-MM-DD'));
        now.add(between, 'days');
    }
    return dates;
};
