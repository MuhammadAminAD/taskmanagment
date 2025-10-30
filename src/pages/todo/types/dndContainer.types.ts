import { IItems, ITodo, TStatus } from "../../../types/index.types";
import { STATUS_CONFIG } from "../components/dnd container/dndContainer.util";
import React from "react"

export interface StatusColumnProps {
    status: typeof STATUS_CONFIG[number];
    tasks: IItems[];
}

export interface iInitialState {
    tasks: ITodo,
    activeId: string | null
}

export interface DroppableZoneProps {
    status: TStatus;
    children: React.ReactNode;
}

export type tDndcontainerActions = { type: "SET_TASKS", payload: ITodo } |
{ type: "SET_ACTIVEID", payload: string } |
{ type: "UNSET_ACTIVEID" }


