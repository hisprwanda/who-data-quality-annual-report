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
      return {
        ...state,
        period: {
          ...state.period,
          selectedPeriod: action.payload.period
        }
      }

    case Actions.changeGroup:
      return {
        ...state,
        selectedValue: {
          ...state.selectedValue,
          dataSet: action.payload
        }
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
            children: action.payload.children
          }
        }
      }

    case Actions.changeDataset:
      return {
        ...state,
        selectedValue: {
          ...state.selectedValue,
          dataSet: action.payload.el
        }
      }

    case Actions.changeReportViewStatus:
      return {
        ...state,
        reportViewStatus: action.payload.status
      }

    case Actions.changeElement:
      return {
        ...state,
        selectedValue: {
          ...state.selectedValue,
          element: action.payload.elements
        }
      }

    case Actions.changeConfiguredDataset:
      return {
        ...state,
        selectedValue: {
          ...state.selectedValue,
          configuredDataset: action.payload.dataset
        }
      }

    default:
      return state;
  }
};

export default reducer;