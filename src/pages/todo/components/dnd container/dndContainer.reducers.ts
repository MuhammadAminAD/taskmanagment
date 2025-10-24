import { iInitialState, tDndcontainerActions } from "./dndContainer.types"

export const DndcontainerInitialState: iInitialState = {
    tasks: { success: [], progress: [], todo: [] },
    activeId: null
}

const dndcontainerReducer = (state: iInitialState, action: tDndcontainerActions) => {
    switch (action.type) {
        case "SET_TASKS":
            return { ...state, tasks: action.payload }
        case "SET_ACTIVEID":
            return { ...state, activeId: action.payload }
        case "UNSET_ACTIVEID":
            return { ...state, activeId: null }
        default:
            return state
    }
}
export default dndcontainerReducer

