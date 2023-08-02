const reducer = function(state = { category: 'Contribution' }, action ) {

    switch(action.type) {
        case 'Change':
            return {
                ...state,
                category: 'Unknown'
            }
        default: 
            return state
    }  
      
}

export default reducer;

