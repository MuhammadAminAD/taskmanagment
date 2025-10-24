export type tCreateTodoErrors = {
    title?: string;
    date?: string;
}

export interface iInitialState {
    open: boolean;
    buttonDisabled: boolean;
    errors: tCreateTodoErrors;
}

export const CreateTodoInitialState: iInitialState = {
    open: false,
    buttonDisabled: false,
    errors: {}
}

export type tCreateTodoActions =
    | { type: "CLOSE_DIALOG" }
    | { type: "OPEN_DIALOG" }
    | { type: "TOGGLE_DIALOG" }
    | { type: "DISABLED_BUTTON" }
    | { type: "UNDISABLED_BUTTON" }
    | { type: "SET_ERRORS"; payload: tCreateTodoErrors }
    | { type: "UNSET_ERRORS" }

const createTodoReducer = (state: iInitialState, action: tCreateTodoActions): iInitialState => {
    switch (action.type) {
        case "CLOSE_DIALOG":
            return { ...state, open: false };
        case "OPEN_DIALOG":
            return { ...state, open: true };
        case "TOGGLE_DIALOG":
            return { ...state, open: !state.open };
        case "DISABLED_BUTTON":
            return { ...state, buttonDisabled: true };
        case "UNDISABLED_BUTTON":
            return { ...state, buttonDisabled: false };
        case "SET_ERRORS":
            return { ...state, errors: action.payload };
        case "UNSET_ERRORS":
            return { ...state, errors: {} };
        default:
            return state;
    }
}

export default createTodoReducer;