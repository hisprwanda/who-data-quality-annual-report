const reducer = function(state = { category: 'Is it known ?' }, action ) {

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

