export const fixedPeriodSource = [
    { name: 'Yearly', id: 'YEARLY' },
    { name: 'Financial Year (Start December)', id: 'FYDEC' },
    { name: 'Financial Year (Start October)', id: 'FYOCT' },
    { name: 'Financial Year (Start July)', id: 'FYJUL' },
    { name: 'Financial Year (Start April)', id: 'FYAPR' },
]
export const year = new Date().getFullYear()

export const periodTypesMapping = {
    Daily: 'DAILY',
    Weekly: 'WEEKLY',
    WeeklyMonday: 'WEEKLYMON',
    WeeklyTueday: 'WEEKLYTUE',
    WeeklyWednesday: 'WEEKLYWED',
    WeeklyThursday: 'WEEKLYTHU',
    WeeklyFriday: 'WEEKLYFRI',
    WeeklySaturday: 'WEEKLYSAT',
    WeeklySunday: 'WEEKLYSUN',
    BiWeekly: 'BIWEEKLY',
    Monthly: 'MONTHLY',
    BiMonthly: 'BIMONTHLY',
    Quarterly: 'QUARTERLY',
    QuarterlyJan: 'QUARTERLYJAN',
    QuarterlyFeb: 'QUARTERLYFEB',
    QuarterlyMar: 'QUARTERLYMAR',
    QuarterlyApril: 'QUARTERLYAPR',
    QuarterlyMay: 'QUARTERLYMAY',
    QuarterlyJun: 'QUARTERLYJUN',
    QuarterlyJuly: 'QUARTERLYJUL',
    QuarterlyAug: 'QUARTERLYAUG',
    QuarterlySep: 'QUARTERLYSEP',
    QuarterlyOct: 'QUARTERLYOCT',
    QuarterlyNov: 'QUARTERLYNOV',
    QuarterlyDec: 'QUARTERLYDEC',
    SixMonthly: 'SIXMONTHLY',
    SixMonthlyJan: 'SIXMONTHLYJAN',
    SixMonthlyFeb: 'SIXMONTHLYFEB',
    SixMonthlyMar: 'SIXMONTHLYMAR',
    SixMonthlyApril: 'SIXMONTHLYAPR',
    SixMonthlyMay: 'SIXMONTHLYMAY',
    SixMonthlyJun: 'SIXMONTHLYJUN',
    SixMonthlyJuly: 'SIXMONTHLYJUL',
    SixMonthlyAug: 'SIXMONTHLYAUG',
    SixMonthlySep: 'SIXMONTHLYSEP',
    SixMonthlyOct: 'SIXMONTHLYOCT',
    SixMonthlyNov: 'SIXMONTHLYNOV',
    SixMonthlyDec: 'SIXMONTHLYDEC',
    Yearly: 'YEARLY',
    FinancialJan: 'FYJAN',
    FinancialFeb: 'FYFEB',
    FinancialMar: 'FYMAR',
    FinancialApril: 'FYAPR',
    FinancialMay: 'FYMAY',
    FinancialJun: 'FYJUN',
    FinancialJuly: 'FYJUL',
    FinancialAug: 'FYAUG',
    FinancialSep: 'FYSEP',
    FinancialOct: 'FYOCT',
    FinancialNov: 'FYNOV',
    FinancialDec: 'FYDEC',
}

export default periodTypesMapping
