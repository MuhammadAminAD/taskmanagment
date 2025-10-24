import { useReducer, useRef } from "react";
import IPlus from "../../../../components/Icons/IPlus";
import {
    useCreateTodosMutation,
    useUpdatedTodosMutation,
} from "../../../../services/todo.services";
import { useAlert } from "../../../../components/Alert/useAlert";
import { IGroups } from "../../../../types/index.types";
import { useGetGroupsQuery } from "../../../../services/groups.services";
import { createPortal } from "react-dom";
import { formatDateTimeToISO } from "./create.utils";
import { validateForm } from "./create.validators";
import { useBodyScroll, useKeyboardShortcuts, useInputFocus } from "./create.hooks";
import createTodoReducer, { CreateTodoInitialState, tCreateTodoErrors } from "./create.reducers";
import { iCreateTaskProps } from "./create.types";

export default function CreateTask({
    isUpdate = false,
    data,
    handleClose
}: iCreateTaskProps) {
    const [state, dispatch] = useReducer(createTodoReducer, CreateTodoInitialState);
    const [createTodo] = useCreateTodosMutation();
    const [updateTodo] = useUpdatedTodosMutation();
    const { data: groupsData } = useGetGroupsQuery("");
    const { addAlert } = useAlert();
    const titleInputRef = useRef<HTMLInputElement>(null);

    // Custom hooklar
    useBodyScroll(state.open, isUpdate, handleClose, dispatch);
    useInputFocus(state.open, titleInputRef);
    useKeyboardShortcuts(state.open, isUpdate, dispatch);

    // Real-time validatsiya
    const handleInputChange = (field: keyof tCreateTodoErrors) => {
        if (state.errors[field]) {
            const newErrors = { ...state.errors };
            delete newErrors[field];
            dispatch({ type: "SET_ERRORS", payload: newErrors });
        }
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget as HTMLFormElement);
        const formData = Object.fromEntries(form.entries());
        const { title, group, date } = formData as {
            title: string;
            group: string;
            date?: string;
        };

        // Validatsiya
        const { isValid, errors } = validateForm({
            title,
            date,
            isUpdate
        });

        if (!isValid) {
            dispatch({ type: "SET_ERRORS", payload: errors });
            return;
        }

        dispatch({ type: "DISABLED_BUTTON" });

        try {
            if (isUpdate && data?.id) {
                await updateTodo({
                    id: data.id,
                    group: group === "null" ? null : group,
                    title: title.trim()
                }).unwrap();
                addAlert("Task updated successfully!", "success");
            } else {
                const formattedDate = formatDateTimeToISO(date!, "23:59");
                const newTask = {
                    title: title.trim(),
                    expire: formattedDate,
                    group: group === "null" ? null : group
                };
                await createTodo(newTask).unwrap();
                addAlert("Task created successfully!", "success");
            }
            dispatch({ type: "CLOSE_DIALOG" });
        } catch (error: unknown) {
            console.error("Error:", error);

            // Error handling with proper types
            let errorMessage = "Failed to process task";

            if (typeof error === 'object' && error !== null) {
                // RTK Query error structure
                if ('data' in error && typeof error.data === 'object' && error.data !== null) {
                    const errorData = error.data as { message?: string };
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                }

                // Standard Error object
                else if ('message' in error && typeof error.message === 'string') {
                    errorMessage = error.message;
                }
            }

            addAlert(errorMessage, "error");
        } finally {
            dispatch({ type: "UNDISABLED_BUTTON" });
        }
    };

    const handleCloseModal = () => {
        dispatch({ type: "CLOSE_DIALOG" });
    };

    const handleOpenModal = () => {
        dispatch({ type: "OPEN_DIALOG" });
    };

    return (
        <div>
            {/* + Button */}
            <button
                onClick={handleOpenModal}
                className={`w-10 h-10 flex justify-center items-center bg-blue-400 text-zinc-200 hover:bg-blue-500 hover:text-white rounded shadow transition duration-300 ${isUpdate && "hidden"}`}
                aria-label="Create new task"
            >
                <IPlus />
            </button>

            {/* Overlay */}
            {createPortal(
                <div
                    onClick={handleCloseModal}
                    className={`fixed top-0 left-0 w-full h-full bg-black/70 z-[99] transition-opacity duration-300 ${state.open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        }`}
                >
                    {/* Sidebar */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`h-full bg-white w-[350px] sm:w-[400px] md:w-[350px] shadow-lg transition-all duration-300 border-r border-neutral-300 overflow-hidden ${!state.open ? "max-w-0 opacity-0" : "max-w-[500px] py-6 px-5 opacity-100"
                            }`}
                    >
                        <h2 className="text-center text-xl font-semibold text-neutral-700 mb-6">
                            {isUpdate ? "Update Task" : "Create a new task"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    Task title *
                                </label>
                                <input
                                    ref={titleInputRef}
                                    name="title"
                                    type="text"
                                    defaultValue={isUpdate ? data?.title : ""}
                                    placeholder="Enter task title"
                                    className={`w-full border rounded py-2 px-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${state.errors.title ? "border-red-500" : "border-neutral-400"}`}
                                    onChange={() => handleInputChange('title')}
                                    maxLength={100}
                                />
                                {state.errors.title && (
                                    <p className="text-red-500 text-xs mt-1">{state.errors.title}</p>
                                )}
                            </div>

                            {/* Group */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    Group
                                </label>
                                <select
                                    name="group"
                                    defaultValue={isUpdate ? data?.group_id : ""}
                                    className="w-full border border-neutral-400 rounded py-2 px-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                >
                                    <option value={"null"}>None</option>
                                    {groupsData?.data?.map((group: IGroups) => (
                                        <option key={group.id} value={group.id}>
                                            {group.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Deadline (only when creating) */}
                            {!isUpdate && (
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        Deadline date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        className={`w-full border rounded py-2 px-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${state.errors.date ? "border-red-500" : "border-neutral-400"}`}
                                        onChange={() => handleInputChange('date')}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {state.errors.date && (
                                        <p className="text-red-500 text-xs mt-1">{state.errors.date}</p>
                                    )}
                                </div>
                            )}

                            {/* Submit button */}
                            <button
                                disabled={state.buttonDisabled}
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-md transition cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed"
                            >
                                {state.buttonDisabled
                                    ? isUpdate
                                        ? "Updating..."
                                        : "Creating..."
                                    : isUpdate
                                        ? "Update Task"
                                        : "Create Task"}
                            </button>
                        </form>

                        {/* Shortcut info */}
                        {!isUpdate && (
                            <div className="mt-6 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
                                <p>💡 Quick tip: Press <kbd className="px-1 py-0.5 bg-gray-200 rounded border">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 rounded border">K</kbd> to quickly open this form</p>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}