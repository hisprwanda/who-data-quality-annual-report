import moment from 'moment';

export const processFixedPeriod = function(calendar, periodType, year, locale) {

    const generateFixedPeriodsPayload = {
        calendar,
        periodType,
        year,
        locale,
    
        // only used when generating yearly periods, so save to use
        // here, regardless of the period type.
        // + 1 so we include 1970 as well
        yearsCount: year - 1970 + 1,
      };
    
      let yearProcessed = generateFixedPeriods(generateFixedPeriodsPayload)
    
}