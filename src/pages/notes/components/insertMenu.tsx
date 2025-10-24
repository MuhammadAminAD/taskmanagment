// pages/NoteDetail/components/InsertMenu.tsx
import { Icon } from "@iconify/react";

interface InsertMenuProps {
    sectionId: number | string;
    afterId: number | string;
    onAdd: (type: string) => void;
    onClose: () => void;
}

export function InsertMenu({ onAdd, onClose }: InsertMenuProps) {
    return (
        <div className="absolute right-0 top-8 bg-white rounded-lg shadow-xl border border-neutral-200 p-2 z-10 min-w-[150px]">
            <button
                onClick={() => onAdd("text")}
                className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 rounded flex items-center gap-2"
            >
                <Icon icon="mdi:text" className="text-neutral-600" /> Matn
            </button>
            <button
                onClick={() => onAdd("code")}
                className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 rounded flex items-center gap-2"
            >
                <Icon icon="mdi:code-braces" className="text-neutral-600" /> Kod
            </button>
            <button
                onClick={() => onAdd("badge")}
                className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 rounded flex items-center gap-2"
            >
                <Icon icon="mdi:label" className="text-neutral-600" /> Badge
            </button>
            <div className="border-t mt-2 pt-2">
                <button
                    onClick={onClose}
                    className="w-full text-left text-sm text-neutral-500"
                >
                    Bekor qilish
                </button>
            </div>
        </div>
    );
}