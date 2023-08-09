import Actions from "../utils/enum/Index";
import currentState from "../utils/initialstate.reducer";

const reducer = function (state = currentState, action) {
  switch (action.type) {
    case Actions.changeDataset:
      return {
        ...state,
        selectedValue: {
          dataSet: action.payload.el,
          orgUnit: {
            displayName: state.selectedValue.orgUnit.displayName,
            path: state.selectedValue.orgUnit.path,
          },
          period: state.selectedValue.period,
        },
      };
    case Actions.changeOrgUnit:
      return {
        ...state,
        selectedValue: {
          dataSet: state.selectedValue.dataSet,
          orgUnit: {
            displayName: action.payload.displayName,
            path: action.payload.path,
          },
        },
      };
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

    default:
      return state;
  }
};

export default reducer;
