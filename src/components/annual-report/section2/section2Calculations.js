import { getSection2abc } from './section2abcCalculations.js'
import { getSection2d } from './section2dCalculations.js'
import { getSection2e } from './section2eCalculations.js'

export const calculateSection2 = ({
    section2Response,
    mappedConfiguration,
    periods,
    overallOrgUnit,
}) => {
    // return formatted information for report
    return {
        ...getSection2abc({ section2Response, mappedConfiguration }),
        ...getSection2d({
            section2Response,
            mappedConfiguration,
            periods,
            overallOrgUnit,
        }),
        ...getSection2e({
            section2Response,
            mappedConfiguration,
            periods,
            overallOrgUnit,
        }),
    }
}
