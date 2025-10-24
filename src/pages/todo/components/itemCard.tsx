import { Icon } from "@iconify/react";
import ProgressDropdown from "./progressDropdown";
import type { IItems } from "../../../types/index.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MoreOptions from "./moreOptions";
import { useState } from "react";
import { useDeleteTodosMutation } from "../../../services/todo.services";
import { useAlert } from "../../../components/Alert/useAlert";
import CreateTask from "./create task/create";


export default function ItemCard({ id, task, }: { id: string, task: IItems }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });
    const [deleteTodo] = useDeleteTodosMutation()
    const { addAlert } = useAlert()
    const [updateModal, setUpdateModal] = useState(false) // typo tuzatildi

    const handleFormatTime = (time: number) => {
        return new Date(time).toLocaleDateString("uz-UZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleActiveChange = () => {
        setUpdateModal(true)
    }

    const handleClose = () => {
        setUpdateModal(false)
    }

    const handleDeleteTask = async () => {
        await deleteTodo(id).unwrap()
        addAlert("Task deleted successfully", "success")
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <div
                className={`flex items-center justify-between px-4 py-2 border-b border-zinc-300 bg-white hover:bg-gray-50 ${isDragging ? "shadow-lg" : ""
                    }`}
            >
                <div className="flex items-center gap-2">
                    <button
                        {...listeners}
                        className="cursor-n-resize active:cursor-grabbing touch-none pointer-events-auto"
                    >
                        <Icon icon="material-symbols:drag-indicator" width="24" height="24" />
                    </button>

                    <ProgressDropdown status={task.status} id={task.id} />
                    <p className="ml-2">{task.title}</p>
                </div>

                <div className="flex items-center gap-5">
                    <p className="text-sm text-gray-600">{handleFormatTime(task.created)} - {handleFormatTime(task.expire)}</p>
                    <MoreOptions activeChange={handleActiveChange} deleteTask={handleDeleteTask} />
                </div>
            </div>

            {updateModal && (
                <CreateTask
                    key={task.id}
                    isUpdate={true}
                    data={task}
                    handleClose={handleClose}
                />
            )}
        </div>
    );
}