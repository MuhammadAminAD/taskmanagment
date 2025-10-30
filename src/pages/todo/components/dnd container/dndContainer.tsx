import { useEffect, useReducer } from "react";
import { DndContext } from "@dnd-kit/core";
import { STATUS_CONFIG } from "./dndContainer.util";
import { useDndSensors, useDragHandlers, useTaskStatusUpdater } from "../../hooks/dndContainer.hooks";
import dndcontainerReducer, { DndcontainerInitialState } from "./dndContainer.reducers";
import StatusColumn from "./statusColumun";
import { useGetTodosQuery } from "../../../../services/todo.services";
import { useParams } from "react-router-dom";

export default function DndContainer() {
    const [state, dispatch] = useReducer(dndcontainerReducer, DndcontainerInitialState);
    const { id } = useParams()
    const { data } = useGetTodosQuery(id ?? "")

    useEffect(() => {
        if (data?.ok) {
            dispatch({ type: "SET_TASKS", payload: data.data })
        }
    }, [data])
    const sensors = useDndSensors();
    const updateTaskStatus = useTaskStatusUpdater();
    const { handleDragStart, handleDragEnd, handleDragCancel } = useDragHandlers(
        state.tasks,
        dispatch,
        updateTaskStatus
    );

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className="grid grid-cols-1 gap-4 mt-4">
                {STATUS_CONFIG.map((status) => (
                    <StatusColumn
                        key={status.key}
                        status={status}
                        tasks={state.tasks[status.key]}
                    />
                ))}
            </div>
        </DndContext>
    );
}
