import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Empty from "../empty";
import ItemCard from "../itemCard";
import { DroppableZone } from "./DropableZone";
import { StatusColumnProps } from "./dndContainer.types";

export function StatusColumn({ status, tasks }: StatusColumnProps) {
    return (
        <div key={status.value} id={status.value} className="mt-8">
            <h3 className={`mb-2 py-1 px-3 ${status.color} rounded-md w-fit text-white font-bold`}>
                {status.label}
            </h3>

            <SortableContext
                items={tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
            >
                <DroppableZone status={status.value}>
                    {tasks.length === 0 ? (
                        <Empty />
                    ) : (
                        tasks.map((task) => (
                            <ItemCard key={task.id} id={task.id} task={task} />
                        ))
                    )}
                </DroppableZone>
            </SortableContext>
        </div>
    );
}