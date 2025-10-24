import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

export default function MoreOptions({
    activeChange,
    deleteTask,
}: {
    activeChange: () => void;
    deleteTask: () => void;
}) {
    const [open, setOpen] = useState(false);
    const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (e: MouseEvent) => {
        if (
            !dropdownRef.current?.contains(e.target as Node) &&
            !toggleButtonRef.current?.contains(e.target as Node)
        ) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block">
            <button
                ref={toggleButtonRef}
                onClick={() => setOpen((prev) => !prev)}
                className="cursor-pointer hover:bg-zinc-100 p-1 rounded transition"
            >
                <Icon icon="material-symbols:more-vert" width="24" height="24" />
            </button>

            {open && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 bg-white border border-zinc-200 shadow-lg rounded-lg p-2 w-40 z-50"
                >
                    <h4 className="text-xs text-neutral-600 mb-2">More options</h4>

                    <button
                        onClick={() => {
                            activeChange();
                            setOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-700 hover:bg-zinc-100 rounded-md transition"
                    >
                        <Icon icon="mdi:pencil" width="18" height="18" />
                        Update title
                    </button>

                    <button
                        onClick={() => {
                            deleteTask();
                            setOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-md transition"
                    >
                        <Icon icon="mdi:trash-can-empty" width="18" height="18" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
