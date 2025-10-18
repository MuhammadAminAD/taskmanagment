import { itemType } from "@/types/types"
import { useState } from "react"
import { Input } from "../ui/input"
import { useUpdateTaskItemMutation } from "@/services/baseApi"

export default function TaskItem({ data }: { data: itemType }) {
    const [isDone, setIsDone] = useState(data.done)
    const [title, setTitle] = useState(data.title)
    const [isEditing, setIsEditing] = useState(false)
    const [updateTask] = useUpdateTaskItemMutation()

    async function handleToggleDone() {
        const newStatus = !isDone
        setIsDone(newStatus)
        try {
            await updateTask({ status: newStatus, id: data.id }).unwrap()
        } catch (err) {
            console.error("❌ Status update failed:", err)
            setIsDone(!newStatus)
        }
    }

    async function onChangeTitle(title: string) {
        if (title !== data.title) {
            try {
                await updateTask({ title, id: data.id }).unwrap()
            } catch (err) {
                console.error("❌ Title update failed:", err)
            }
        }
    }

    function handleBlur() {
        setIsEditing(false)
        onChangeTitle(title)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") e.currentTarget.blur()
    }

    return (
        <label className={`${isDone ? "text-neutral-400 line-through" : "text-neutral-700"}`}>
            <div className="flex items-center gap-4 border-t py-1 relative">
                <input type="checkbox" checked={isDone} onChange={handleToggleDone} />
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
                    <p onDoubleClick={() => setIsEditing(true)}>{title}</p>
                )}
            </div>
        </label>
    )
}
