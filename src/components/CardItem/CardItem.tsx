import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { itemType, stageType, TaskType } from "@/types/types";
import StageButton from "@/components/shared/StageButton";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useCreateTaskItemMutation, useDeleteTaskMutation, useGroupCreateMutation, useGroupsQuery, useUpdateTaskMutation } from "@/services/baseApi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, Play } from "lucide-react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
    ContextMenuSubContent
} from "@/components/ui/context-menu"
import TaskItem from "../TaskItem/TaskItem";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function CardItem({
    stage,
    data,
    isFirst
}: {
    stage: stageType;
    data: TaskType;
    isFirst?: boolean
}) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(data.title);
    const [updateTask] = useUpdateTaskMutation();
    const [deletaTask] = useDeleteTaskMutation()
    const [createTaskItem] = useCreateTaskItemMutation()
    const [createGroup] = useGroupCreateMutation()
    const [changeTaskStatusPopover, setChangeTaskStatusPopover] = useState<boolean>(false);
    const [taskItems, setTaskItems] = useState<boolean>(false)
    const ulRef = useRef<null | HTMLUListElement>(null)
    const { data: groupsData } = useGroupsQuery("")
    const [created, setCreated] = useState<string | undefined>()

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: data.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    useEffect(() => {
        if (!data?.created) return
        const localDate = new Date(data.created)
        setCreated(localDate.toISOString().split("T")[0])
    }, [data])

    useEffect(() => {
        if (!taskItems) return
        function handleClickOutside(event: MouseEvent) {
            if (ulRef.current && !ulRef.current.contains(event.target as Node)) {
                setTaskItems(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [taskItems]);


    const isCloseDeadline = (expire: string) => {
        const diff = (new Date(expire).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        return diff <= 3 && diff > 0;
    };

    const handleDoubleClick = () => setIsEditing(true);

    const handleBlur = () => {
        setIsEditing(false);
        onChangeTitle(title);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setIsEditing(false);
            onChangeTitle(title);
        }
    };

    async function onCreateTaskItem(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        createTaskItem({ task: data.id, title: formData.get("title") })
        e.currentTarget.reset();
    }

    async function handleItemSetGroup(id: number) {
        await updateTask({ group: id, id: data.id, }).unwrap();
    }

    async function onUpdateStage(stage: stageType) {
        if (stage !== data.status) {
            try {
                await updateTask({ status: stage, id: data.id }).unwrap();
            } catch (err) {
                console.error("❌ Stage update failed:", err);
            }
        }
        setChangeTaskStatusPopover(false);
    }

    async function onChangeTitle(title: string) {
        if (title !== data.title) {
            try {
                await updateTask({ title: title, id: data.id }).unwrap();
            } catch (err) {
                console.error("❌ Title update failed:", err);
            }
        }
    }

    async function onGroupCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const inputData = Object.fromEntries(formData.entries())
        createGroup({ body: inputData }).unwrap()
        e.currentTarget.reset();
    }

    function onDelete() {
        deletaTask({ id: data.id })
    }

    return (
        <div>
            <Tooltip>
                <TooltipTrigger className="w-full text-left">
                    <div
                        ref={setNodeRef}
                        style={style}
                        className={`
        w-full border-t border-zinc-200 py-1 px-2 flex 
        items-center gap-2 first-of-type:border-0 duration-300 group
        ${stage === "success"
                                ? "hover:bg-green-50"
                                : stage === "in-progress"
                                    ? "hover:bg-yellow-50"
                                    : "hover:bg-zinc-50"
                            }
        ${isDragging ? "z-50" : ""}
      `}
                    >
                        {/* Drag handle */}
                        <button
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600"
                        >
                            <GripVertical size={18} />
                        </button>

                        <button
                            onClick={() => setTaskItems((prev) => !prev)}
                            className="cursor-pointer max-w-0 overflow-hidden duration-300 group-hover:max-w-5"
                        >
                            <Play width={10} className=" fill-zinc-600 stroke-zinc-600" style={{ rotate: taskItems ? "-90deg" : "90deg" }} />
                        </button>

                        <Popover open={changeTaskStatusPopover} onOpenChange={setChangeTaskStatusPopover}>
                            <PopoverTrigger asChild>
                                <div className="inline-flex items-center justify-center">
                                    <StageButton stage={stage} />
                                </div>
                            </PopoverTrigger>


                            <PopoverContent className="space-y-1 max-w-[200px] px-0">
                                <button
                                    onClick={() => onUpdateStage("success")}
                                    className="flex items-center gap-4 cursor-pointer w-full pl-2 hover:bg-green-100"
                                >
                                    <StageButton stage={"success"} /> success
                                </button>
                                <button
                                    onClick={() => onUpdateStage("in-progress")}
                                    className="flex items-center gap-4 cursor-pointer w-full pl-2 hover:bg-yellow-100"
                                >
                                    <StageButton stage={"in-progress"} /> in-progress
                                </button>
                                <button
                                    onClick={() => onUpdateStage("to-do")}
                                    className="flex items-center gap-4 cursor-pointer w-full pl-2 hover:bg-zinc-100"
                                >
                                    <StageButton stage={"to-do"} /> to-do
                                </button>
                            </PopoverContent>
                        </Popover>

                        {/* ✏️ Nom qismi */}
                        <ContextMenu>
                            <ContextMenuTrigger className="basis-3/5">
                                <div
                                    onDoubleClick={handleDoubleClick}
                                    className="cursor-pointer px-2 py-1 rounded transition-colors duration-150"
                                >
                                    {isEditing ? (
                                        <Input
                                            autoFocus
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            onBlur={handleBlur}
                                            onKeyDown={handleKeyDown}
                                            className="h-7 text-sm px-2"
                                        />
                                    ) : (
                                        <p className="text-sm text-zinc-700 truncate">{title}</p>
                                    )}
                                </div>
                            </ContextMenuTrigger>

                            <ContextMenuContent className="w-80 rounded-lg border border-zinc-200 bg-white shadow-md">
                                {/* Change title */}
                                <ContextMenuItem
                                    onClick={handleDoubleClick}
                                    className="cursor-pointer flex justify-between text-sm text-zinc-700 hover:bg-zinc-100 px-3 py-1.5 rounded-md"
                                >
                                    Change title
                                    <ContextMenuShortcut className="text-zinc-400">Double click</ContextMenuShortcut>
                                </ContextMenuItem>

                                <ContextMenuSeparator />

                                {/* Groups Section */}
                                <ContextMenuSub>
                                    <ContextMenuSubTrigger className="text-sm text-zinc-700 hover:bg-zinc-100 rounded-md px-3 py-1.5">
                                        Groups
                                    </ContextMenuSubTrigger>

                                    <ContextMenuSubContent className="w-52 bg-white border border-zinc-200 rounded-md shadow-sm p-2 space-y-1">
                                        {/* Add new group */}
                                        <form className="flex items-center gap-2" onSubmit={onGroupCreate}>
                                            <Input
                                                placeholder="Add new group"
                                                className="h-7 text-sm flex-1"
                                                name="title"
                                            />
                                            <Button
                                                size="sm"
                                                className="h-7 px-2 text-sm bg-black"
                                            >
                                                +
                                            </Button>
                                        </form>

                                        <ContextMenuSeparator />

                                        {/* Static "None" item */}
                                        <ContextMenuItem
                                            onClick={() => handleItemSetGroup(0)}
                                            className="flex items-center justify-between text-sm hover:bg-zinc-100 rounded px-2 py-1.5">
                                            None
                                            {(data.group_id == 0 || !data.group_id) && <Check className="h-4 w-4 text-zinc-400" />}
                                        </ContextMenuItem>

                                        {/* Dynamic groups */}
                                        {groupsData?.data?.map((group: { id: number; title: string }) => (
                                            <ContextMenuItem
                                                onClick={() => handleItemSetGroup(group.id)}
                                                key={group.id}
                                                className="flex items-center justify-between text-sm hover:bg-zinc-100 rounded px-2 py-1.5"
                                            >
                                                {group.title}
                                                {data.group_id == group.id && <Check className="h-4 w-4 text-blue-500" />}
                                            </ContextMenuItem>
                                        ))}
                                    </ContextMenuSubContent>
                                </ContextMenuSub>

                                <ContextMenuSeparator />

                                {/* Delete */}
                                <ContextMenuItem
                                    onClick={onDelete}
                                    className="text-red-500 cursor-pointer hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-md"
                                >
                                    Delete
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>


                        <div className="flex items-center gap-3 basis-3/16">
                            <p
                                className={`text-sm ${isCloseDeadline(data.expire) ? "text-red-500 font-medium" : "text-zinc-500/70"
                                    }`}
                            >
                                {created?.split("-").reverse().join(".")} -
                                {" " + data?.expire?.split("-").reverse().join(".")}
                            </p>

                        </div>

                        {stage === "success" && (
                            <div>
                                <button className="hover:underline cursor-pointer text-sm text-green-500" onClick={onDelete}>
                                    Finish
                                </button>
                            </div>
                        )}
                    </div>
                </TooltipTrigger>

                {isFirst && <TooltipContent className="text-xs text-zinc-700 bg-white border border-zinc-200 shadow-md p-2 rounded-md">
                    💡 <span className="font-medium text-zinc-900">Tips:</span>
                    <br />• <kbd className="px-1 py-0.5 bg-zinc-100 rounded text-[11px]">Right click</kbd> — open settings
                    <br />• <kbd className="px-1 py-0.5 bg-zinc-100 rounded text-[11px]">Double click</kbd> — edit title
                </TooltipContent>}

            </Tooltip>
            <ul ref={ulRef} className={`ml-15 duration-500 ${taskItems ? "max-h-120 overflow-y-auto" : "max-h-0 overflow-hidden"}`}>
                {data?.items?.map((item: itemType) =>
                    <TaskItem data={item} />
                )}
                <form className="flex items-center" onSubmit={onCreateTaskItem}>
                    <button type="submit" className="text-blue-300 text-sm cursor-pointer hover:underline">+Add </button>
                    <input name="title" type="text" placeholder="add new task item" className="w-full px-5 border-0 outline-0" />
                </form>
            </ul>
        </div>
    );
}

