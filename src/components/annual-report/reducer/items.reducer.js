export const ItemReducer = (state, action) => {
    switch (action.type) {

        case 'addition':
            return {
                count: state.count + 1
            }
        case 'subtraction':
            return {
                count: state.count - 1
            }
        default:
            return {
                count: 0
            }

    }
}