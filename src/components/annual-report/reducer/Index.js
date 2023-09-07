import { Action } from "rxjs/internal/scheduler/Action";
import Actions from "../utils/enum/Index";
import currentState from "../utils/initialstate.reducer";

const reducer = function (state = currentState, action) {
  switch (action.type) {
    case Actions.changeFixedPeriod:
      return {
        ...state,
        period: {
          fixedPeriod: {
            ...state.period.fixedPeriod,
            ...{ year: action.payload.year, period: action.payload.period },
          },
        },
      };

    case Actions.periodSelection:
      console.log(action.payload, action.type)
      return {
        ...state,
        period: {
          ...state.period,
          selectedPeriod: action.payload.period,
        },
      };

    case Actions.changeGroup:
      return {
        ...state,
        selectedValue: {
          ...state.selectedValue,
          dataSet: action.payload,
        }
      };

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
          }
        },
      };

    case Actions.changeOrgUnitSet:
      return {
        ...state,
        selectedValue: {
          ...state.selectedValue,
          orgUnitSet: action.payload.ou,
        }
      };

    case Actions.changeDataset:
      return {
        ...state,
        selectedValue: {
          ...state.selectedValue,
          dataSet: action.payload.el,
        }
      };

    case Actions.changeReportViewStatus:
      return {
        ...state,
        reportViewStatus: action.payload.status,
      };

    case Actions.changeElement:
      return {
        ...state,
        selectedValue: {
          ...state.selectedValue,
          element: action.payload.elements,
        },
      };

    case Actions.changeConfiguredDataset:
      return {
        ...state,
        selectedValue: {
          ...state.selectedValue,
          configuredDataset: action.payload.dataset,
        },
      };

    case Actions.precedingYearForReference:
      return {
        ...state,
        selectedValue: {
          ...state.selectedValue,
          precedingYearForReference: action.payload.year
        }
      }

    case Actions.changeOrgUnitID:
      return {
        ...state,
        selectedValue: {
          ...state.selectedValue,
          orgUnitIDSet: action.payload.id 
        }
      }

    case Actions.changeOrgUnitLevel:
      return {
        ...state,
        selectedValue: {
          ...state.selectedValue,
          orgUnitLevel: action.payload.level
        }
      }

    default:
      return state;
  }
};

export default reducer;
