import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

export default function Aside() {
    const navigate = useNavigate()
    return (
        <div className="w-full border-r border-zinc-300 h-dvh">
            <h1 className="text-xl font-bold text-center py-5.5 border-b border-zinc-300">Menu</h1>

            <div className="p-4 space-y-2">
                <button
                    onClick={() => navigate("/todo")}
                    className="flex items-center px-2 gap-4 hover:bg-neutral-200 w-full rounded cursor-pointer py-1">
                    <Icon icon="material-symbols:check-box-outline" width="30" height="30" color="#404040" />

                    <p className="text-lg font-medium text-neutral-700">To do</p>
                </button>
                <button
                    onClick={() => navigate("/note")}
                    className="flex items-center px-2 gap-4 hover:bg-neutral-200 w-full rounded cursor-pointer py-1">
                    <Icon icon="material-symbols:apk-document" width="30" height="30" color="#404040" />

                    <p className="text-lg font-medium text-neutral-700">Notes</p>
                </button>
            </div>
        </div>
    )
}
