import { useDroppable } from "@dnd-kit/core";
import { DroppableZoneProps } from "./dndContainer.types";



export function DroppableZone({ status, children }: DroppableZoneProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
    });

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[100px] p-2 rounded-md transition-colors ${isOver ? 'bg-blue-100' : 'bg-transparent'
                }`}
        >
            {children}
        </div>
    );
}