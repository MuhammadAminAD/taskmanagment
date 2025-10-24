// pages/NoteDetail/components/ItemActions.tsx
import { Icon } from "@iconify/react";

interface ItemActionsProps {
    onDelete: () => void;
    onAddAfter: () => void;
}

export function ItemActions({ onDelete, onAddAfter }: ItemActionsProps) {
    return (
        <div className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button
                onClick={onAddAfter}
                className="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-blue-600 shadow-lg"
                title="Qo'shish"
            >
                <Icon icon="mdi:plus" />
            </button>
            <button
                onClick={onDelete}
                className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 shadow-lg"
                title="O'chirish"
            >
                <Icon icon="mdi:delete" />
            </button>
        </div>
    );
}