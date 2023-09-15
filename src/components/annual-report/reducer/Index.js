import { Action } from 'rxjs/internal/scheduler/Action'
import Actions from '../utils/enum/Index'
import currentState from '../utils/initialstate.reducer'

// Reducer function used to manage the redux store
const reducer = function (state = currentState, action) {
    switch (action.type) {
        // this case runs when the user changes the fixed period
        case Actions.changeFixedPeriod:
            return {
                ...state,
                period: {
                    fixedPeriod: {
                        ...state.period.fixedPeriod,
                        ...{
                            year: action.payload.year,
                            period: action.payload.period,
                        },
                    },
                },
            }

        // This case runs when a user selects the period in the context selector
        case Actions.periodSelection:
            return {
                ...state,
                period: {
                    ...state.period,
                    selectedPeriod: action.payload.periodTextContent,
                    selectedPeriodIsoValue: action.payload.periodIsoValue,
                    selectedPeriodTextContent: action.payload.periodTextContent,
                },
            }

        // This is run whenever a user changes the period type in the context selector
        case Actions.changeSelectedPeriodTypeText:
            return {
                ...state,
                period: {
                    ...state.period,
                    selectedPeriodTypeTextContent: action.payload.periodType,
                },
            }

        // This is run whenever a user changes the period in the context selector
        case Actions.changeSelectedPeriodText:
            return {
                ...state,
                period: {
                    ...state.period,
                    selectedPeriodTextContent: action.payload.period,
                },
            }

        case Actions.changeGroup:
            return {
                ...state,
                selectedValue: {
                    ...state.selectedValue,
                    dataSet: action.payload,
                },
            }

        case Actions.changeOrgUnit:
            return {
                ...state,
                selectedValue: {
                    ...state.selectedValue,
                    orgUnit: {
                        ...state.selectedValue.orgUnit,
                        displayName: action.payload.displayName,
                        path: action.payload.path,
                        id: action.payload.id,
                        children: action.payload.children,
                    },
                },
            }

        case Actions.changeOrgUnitSet:
            return {
                ...state,
                selectedValue: {
                    ...state.selectedValue,
                    orgUnitSet: action.payload.ou,
                },
            }

        case Actions.changeDataset:
            return {
                ...state,
                selectedValue: {
                    ...state.selectedValue,
                    groupName: action.payload.group,
                    groupCode: action.payload.groupCode,
                },
            }

        case Actions.changeReportViewStatus:
            return {
                ...state,
                reportViewStatus: action.payload.status,
            }

        case Actions.changeElement:
            return {
                ...state,
                selectedValue: {
                    ...state.selectedValue,
                    element: action.payload.elements,
                },
            }

        case Actions.changeConfiguredDataset:
            return {
                ...state,
                selectedValue: {
                    ...state.selectedValue,
                    configuredDataset: action.payload.dataset,
                },
            }

        case Actions.precedingYearForReference:
            return {
                ...state,
                selectedValue: {
                    ...state.selectedValue,
                    precedingYearForReference: action.payload.year,
                },
            }

        case Actions.changeOrgUnitID:
            return {
                ...state,
                selectedValue: {
                    ...state.selectedValue,
                    orgUnitIDSet: action.payload.id,
                },
            }

        case Actions.changeOrgUnitLevel:
            return {
                ...state,
                selectedValue: {
                    ...state.selectedValue,
                    orgUnitLevel: action.payload.level,
                },
            }

        default:
            return state
    }
}

export default reducer
