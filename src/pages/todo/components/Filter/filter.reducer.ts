interface iInitialState {
    open: boolean
}

export const FilterInitialState: iInitialState = {
    open: false,
}

type tFilterActions = { type: "TOGGLE_DROPDOWN" } | { type: "OPEN_DROPDOWN" } | { type: "CLOSE_DROPDOWN" }


const filterReducer = (state: iInitialState, action: tFilterActions) => {
    switch (action.type) {
        case "TOGGLE_DROPDOWN":
            return { ...state, open: !state.open }
        case "CLOSE_DROPDOWN":
            return { ...state, open: false }
        case "OPEN_DROPDOWN":
            return { ...state, open: true }
        default:
            return state
    }
}
export default filterReducer

