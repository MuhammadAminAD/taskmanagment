import { DragEndEvent, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useAlert } from "../../../components/Alert/useAlert";
import { useUpdatedTodosMutation } from "../../../services/todo.services";
import { IItems, ITodo } from "../../../types/index.types";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { tDndcontainerActions } from "../../types/dndContainer.types";

export function useTaskStatusUpdater() {
    const [updateTodo] = useUpdatedTodosMutation();
    const { addAlert } = useAlert();

    const updateTaskStatus = async (taskId: string, newStatus: 'todo' | 'progress' | 'success') => {
        const statusMap = {
            progress: "in-progress",
            success: "success",
            todo: "to-do"
        } as const;

        try {
            await updateTodo({
                id: taskId,
                status: statusMap[newStatus]
            }).unwrap();
            addAlert("Task status updated", "success");
        } catch (error) {
            console.log(error);
            addAlert("Failed to update task status", "error");
        }
    };

    return updateTaskStatus;
}

// Tasklarni topish funksiyasi
function useTaskFinder(tasks: ITodo) {
    return (id: string): { task: IItems; status: keyof ITodo } | null => {
        if (tasks.success.find(t => t.id === id))
            return { task: tasks.success.find(t => t.id === id)!, status: 'success' };
        if (tasks.progress.find(t => t.id === id))
            return { task: tasks.progress.find(t => t.id === id)!, status: 'progress' };
        if (tasks.todo.find(t => t.id === id))
            return { task: tasks.todo.find(t => t.id === id)!, status: 'todo' };
        return null;
    };
}

// Drag and drop event handlerlari
export function useDragHandlers(
    tasks: ITodo,
    dispatch: React.Dispatch<tDndcontainerActions>,
    updateTaskStatus: (taskId: string, newStatus: 'todo' | 'progress' | 'success') => Promise<void>
) {
    const findTask = useTaskFinder(tasks);

    const handleDragStart = (event: DragStartEvent) => {
        dispatch({ type: "SET_ACTIVEID", payload: event.active.id as string });
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        dispatch({ type: "UNSET_ACTIVEID" });

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTaskInfo = findTask(activeId);
        if (!activeTaskInfo) return;

        if (["to do", "in progress", "success"].includes(overId)) {
            const newStatus =
                overId === "to do" ? "todo" :
                    overId === "in progress" ? "progress" : "success";

            const oldStatus = activeTaskInfo.status;

            if (oldStatus === newStatus) return;

            const newTasks = { ...tasks };
            newTasks[oldStatus] = newTasks[oldStatus].filter(t => t.id !== activeId);
            newTasks[newStatus] = [...newTasks[newStatus], activeTaskInfo.task];
            dispatch({ type: "SET_TASKS", payload: newTasks });

            await updateTaskStatus(activeId, newStatus);
            return;
        }

        const overTaskInfo = findTask(overId);
        if (!overTaskInfo) return;

        const oldStatus = activeTaskInfo.status;
        const newStatus = overTaskInfo.status;

        if (oldStatus !== newStatus) {
            const newTasks = { ...tasks };
            newTasks[oldStatus] = newTasks[oldStatus].filter(t => t.id !== activeId);
            newTasks[newStatus] = [...newTasks[newStatus], activeTaskInfo.task];
            dispatch({ type: "SET_TASKS", payload: newTasks });

            await updateTaskStatus(activeId, newStatus);
        }
    };

    const handleDragCancel = () => {
        dispatch({ type: "UNSET_ACTIVEID" });
    };

    return {
        handleDragStart,
        handleDragEnd,
        handleDragCancel
    };
}

// Sensorlarni sozlash
export function useDndSensors() {
    return useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
}


