import { useEffect, useRef, useState } from "react"
import type { TStatus } from "../../../types/index.types"
import { useUpdatedTodosMutation } from "../../../services/todo.services"

export default function ProgressDropdown({ status, id }: { status: TStatus, id: string }) {
    const [open, setOpen] = useState<boolean>(false)
    const toggleButtonRef = useRef<HTMLButtonElement | null>(null)
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const [updateTodo] = useUpdatedTodosMutation()

    const handleClickOutside = (e: MouseEvent) => {
        if (
            !dropdownRef.current?.contains(e.target as Node) &&
            !toggleButtonRef.current?.contains(e.target as Node)
        ) {
            setOpen(false)
        }
    }

    const handleChangeStatus = (newStatus: TStatus) => {
        updateTodo({ id: id, status: newStatus === "in progress" ? "in-progress" : newStatus === "success" ? "success" : "to-do" }).unwrap()
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleGetClassByStatus = (status: string) => {
        switch (status) {
            case "to-do":
                return { border: "border-rose-500", bg: "bg-rose-500" }
            case "in-progress":
                return { border: "border-orange-500", bg: "bg-orange-500" }
            case "success":
                return { border: "border-green-500", bg: "bg-green-500" }
            default:
                return { border: "border-gray-400", bg: "bg-gray-400" }
        }
    }

    return (
        <div className="relative flex items-center">
            {/* Tugma */}
            <button
                ref={toggleButtonRef}
                onClick={() => setOpen((prev) => !prev)}
                className={`w-5 h-5 flex items-center justify-center rounded-md border-2 ${handleGetClassByStatus(status)?.border} cursor-pointer transition-transform active:scale-95`}
            >
                <div
                    className={`w-3 h-3 rounded-[4px] ${handleGetClassByStatus(status)?.bg}`}
                ></div>
            </button>

            {/* Dropdown */}
            <div className="relative">
                <div
                    ref={dropdownRef}
                    className={`absolute w-[300px] left-6 top-0 bg-white shadow-lg rounded-md p-3 border border-gray-200 transition-all duration-150 origin-top-left ${open ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                        }`}
                >
                    <h4 className="text-sm font-medium text-neutral-700 mb-3">
                        Change status
                    </h4>

                    <div className="space-y-2">
                        {[
                            { color: "green", label: "success" },
                            { color: "orange", label: "in progress" },
                            { color: "rose", label: "to do" },
                        ].map((item) => (
                            <button
                                onClick={() => handleChangeStatus(item.label as TStatus)}
                                key={item.label}
                                className="flex items-center gap-3 cursor-pointer hover:pl-2 transition-all duration-100"
                            >
                                <div
                                    className={`w-4 h-4 border-2 border-${item.color}-500 flex items-center justify-center rounded-md`}
                                >
                                    <div
                                        className={`w-3 h-3 bg-${item.color}-500 rounded-sm`}
                                    ></div>
                                </div>
                                <p className="text-sm">{item.label}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
