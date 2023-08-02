import currentState from "../utils/initialstate.reducer";

const reducer = function(state = currentState, action ) {

    switch(action.type) {
        case 'Change Dataset':
            return {
                ...state,
                selectedValue : {
                    dataSet: action.payload.el
                }
            }
        default: 
            return state
    }  

}

export default reducer;

