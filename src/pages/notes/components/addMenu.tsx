// pages/NoteDetail/components/AddMenu.tsx
import { Icon } from "@iconify/react";
import { useState } from "react";

interface AddMenuProps {
    sectionId: number | string;
    onAdd: (sectionId: number | string, afterId: null, type: string) => void;
}

export function AddMenu({ sectionId, onAdd }: AddMenuProps) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-full py-2 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-500 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
            >
                <Icon icon="mdi:plus-circle" /> Element Qo'shish
            </button>

            {showMenu && (
                <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 p-2 z-10 min-w-[200px]">
                    <button
                        onClick={() => {
                            onAdd(sectionId, null, "text");
                            setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 rounded flex items-center gap-2"
                    >
                        <Icon icon="mdi:text" className="text-neutral-600" /> Matn
                    </button>
                    <button
                        onClick={() => {
                            onAdd(sectionId, null, "code");
                            setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 rounded flex items-center gap-2"
                    >
                        <Icon icon="mdi:code-braces" className="text-neutral-600" /> Kod
                    </button>
                    <button
                        onClick={() => {
                            onAdd(sectionId, null, "badge");
                            setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 rounded flex items-center gap-2"
                    >
                        <Icon icon="mdi:label" className="text-neutral-600" /> Badge
                    </button>
                </div>
            )}
        </div>
    );
}